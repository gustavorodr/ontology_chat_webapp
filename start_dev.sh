#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# PID file to track running instances
PIDFILE="/tmp/amora_start_dev.pid"

# Cleanup function
cleanup() {
    echo -e "${YELLOW}Limpando ambiente...${NC}"
    # Kill any remaining processes on selected port
    local PORT_CLEANUP="${E2E_PORT:-3000}"
    PIDS=$(lsof -t -i:${PORT_CLEANUP} 2>/dev/null || true)
    if [ -n "$PIDS" ]; then
        echo -e "${YELLOW}Matando processos na porta ${PORT_CLEANUP}: $PIDS${NC}"
        kill -9 $PIDS 2>/dev/null || true
    fi
    
    if [ -f "$PIDFILE" ]; then
        rm -f "$PIDFILE"
    fi
    
    echo -e "${GREEN}Cleanup concluído${NC}"
}

# Set trap to cleanup on exit
trap cleanup EXIT INT TERM

# Check if already running
if [ -f "$PIDFILE" ]; then
    OLD_PID=$(cat "$PIDFILE")
    if ps -p "$OLD_PID" > /dev/null 2>&1; then
        echo -e "${RED}Erro: start_dev.sh já está rodando (PID: $OLD_PID)${NC}"
        echo -e "${YELLOW}Use 'kill $OLD_PID' para parar a instância anterior${NC}"
        exit 1
    else
        # PID file exists but process is dead, clean it up
        rm -f "$PIDFILE"
    fi
fi

# Write our PID
echo $$ > "$PIDFILE"

# Detecta se deve usar sudo (Linux sim, Windows não)
if [ "$OS" = "Windows_NT" ] || ! command -v sudo >/dev/null 2>&1; then
    SUDO=""
else
    SUDO="sudo"
fi

# Configurações
MOCK_SERVER_PORT=1081
DOCKER_HOST_ADDRESS=${DOCKER_HOST_ADDRESS:-"localhost"}
EXPECTATIONS_DIR="./tests/expectations"
MAX_RETRIES=30
RETRY_DELAY=1

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  Iniciando ambiente de desenvolvimento${NC}"
echo -e "${GREEN}=====================================${NC}"

# Função para limpar o MockServer
clear_mock_server() {
    local uri="http://${DOCKER_HOST_ADDRESS}:${MOCK_SERVER_PORT}/mockserver/reset"
    echo -e "${YELLOW}Limpando MockServer...${NC}"
    
    response=$(curl -s -w "%{http_code}" -X PUT "$uri" -o /dev/null)
    
    if [ "$response" != "200" ]; then
        echo -e "${RED}Erro ao limpar MockServer. Status code: $response${NC}"
        return 1
    fi
    
    echo -e "${GREEN}MockServer limpo com sucesso!${NC}"
    return 0
}

# Função para carregar expectativas no MockServer
load_expectations() {
    local file=$1
    local uri="http://${DOCKER_HOST_ADDRESS}:${MOCK_SERVER_PORT}/mockserver/expectation"
    
    echo -e "${YELLOW}Carregando expectativas de: $(basename "$file")${NC}"
    
    response=$(curl -s -w "%{http_code}" -X PUT "$uri" \
        -H "Content-Type: application/json; charset=utf-8" \
        --data-binary @"$file" \
        -o /dev/null)
    
    if [ "$response" != "201" ] && [ "$response" != "200" ]; then
        echo -e "${RED}Erro ao carregar expectativas de $file. Status code: $response${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✓ Expectativas carregadas: $(basename "$file")${NC}"
    return 0
}

# Função para verificar se o MockServer está pronto
check_mock_server() {
    local uri="http://${DOCKER_HOST_ADDRESS}:${MOCK_SERVER_PORT}/mockserver/reset"

    # Faz uma requisição de teste direto
    # Se o servidor ainda não estiver pronto, o curl deve retornar "000" ou falhar
    response=$(curl -s -w "%{http_code}" -X PUT "$uri" -o /dev/null 2>/dev/null)

    if [ "$response" = "200" ]; then
        return 0
    fi

    return 1
}

# 1. Parar containers existentes (se houver)
echo -e "${YELLOW}Parando containers existentes...${NC}"
$SUDO docker compose down

# 2. Iniciar docker-compose
echo -e "${YELLOW}Iniciando docker-compose...${NC}"
$SUDO docker compose up -d

# 3. Aguardar o MockServer estar pronto
echo -e "${YELLOW}Aguardando MockServer inicializar...${NC}"
retry_count=0

while [ $retry_count -lt $MAX_RETRIES ]; do
    if check_mock_server; then
        echo -e "${GREEN}MockServer está pronto!${NC}"
        break
    fi
    
    retry_count=$((retry_count + 1))
    
    # Mostra progresso a cada 5 tentativas
    if [ $((retry_count % 5)) -eq 0 ]; then
        echo -e "${YELLOW}Aguardando... ($retry_count/$MAX_RETRIES)${NC}"
    fi
    
    sleep $RETRY_DELAY
done

if [ $retry_count -eq $MAX_RETRIES ]; then
    echo -e "${RED}Timeout: MockServer não inicializou a tempo.${NC}"
    echo -e "${YELLOW}Dica: Verifique os logs com: docker logs mock_server${NC}"
    exit 1
fi

# 4. Limpar o MockServer agora que ele está pronto
if ! clear_mock_server; then
    echo -e "${RED}Falha ao limpar o MockServer após inicialização.${NC}"
    exit 1
fi

echo -e "${GREEN}MockServer pronto e limpo!${NC}"

# 5. Carregar todos os arquivos de expectativas
if [ -d "$EXPECTATIONS_DIR" ]; then
    echo -e "${YELLOW}Carregando arquivos de expectativas...${NC}"
    
    expectation_files=$(find "$EXPECTATIONS_DIR" -name "*.json" -type f)
    
    if [ -z "$expectation_files" ]; then
        echo -e "${YELLOW}Nenhum arquivo de expectativa encontrado em $EXPECTATIONS_DIR${NC}"
    else
        file_count=0
        for file in $expectation_files; do
            if [ -s "$file" ]; then  # Verifica se o arquivo não está vazio
                if load_expectations "$file"; then
                    file_count=$((file_count + 1))
                fi
            else
                echo -e "${YELLOW}⚠ Arquivo vazio ignorado: $(basename "$file")${NC}"
            fi
        done
        
        echo -e "${GREEN}=====================================${NC}"
        echo -e "${GREEN}Total de arquivos carregados: $file_count${NC}"
        echo -e "${GREEN}=====================================${NC}"
    fi
else
    echo -e "${YELLOW}Diretório de expectativas não encontrado: $EXPECTATIONS_DIR${NC}"
fi

# 6. Exportar variáveis de ambiente para apontar para o MockServer
# e configurar porta do Frontend
PORT="${E2E_PORT:-3001}"

# 7. Garantir porta livre e iniciar servidor Next.js
echo -e "${GREEN}Garantindo porta ${PORT} livre...${NC}"

# Force kill any process on selected port immediately
PIDS=$($SUDO lsof -t -i:${PORT} 2>/dev/null || true)
if [ -n "$PIDS" ]; then
    echo -e "${YELLOW}Forçando kill de processos na porta ${PORT}: $PIDS${NC}"
    $SUDO kill -9 $PIDS 2>/dev/null || true
    sleep 2
fi

# Tenta liberar a porta algumas vezes antes de desistir
MAX_PORT_RETRIES=5
PORT_RETRY_DELAY=1

for i in $(seq 1 $MAX_PORT_RETRIES); do
    # Verifica se a porta está livre
    if ! $SUDO lsof -i :${PORT} > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Porta ${PORT} está livre!${NC}"
        break
    fi

    echo -e "${YELLOW}Tentativa $i/$MAX_PORT_RETRIES: Porta ${PORT} ainda ocupada${NC}"
    
    # Tenta matar novamente
    PIDS=$($SUDO lsof -t -i:${PORT} || true)
    if [ -n "$PIDS" ]; then
        echo -e "${YELLOW}  → Matando: $PIDS${NC}"
        $SUDO kill -9 $PIDS 2>/dev/null || true
    fi
    
    sleep $PORT_RETRY_DELAY
done

# Verifica se conseguiu liberar a porta
if $SUDO lsof -i :${PORT} > /dev/null 2>&1; then
    echo -e "${RED}❌ Erro: não foi possível liberar a porta ${PORT} após $MAX_PORT_RETRIES tentativas.${NC}"
    echo -e "${YELLOW}Processos ainda ativos na porta ${PORT}:${NC}"
    $SUDO lsof -i :${PORT} || true
    echo -e "${YELLOW}Diagnóstico (ss -ltnp):${NC}"
    ss -ltnp | grep ":${PORT} " || true
    exit 1
fi

echo -e "${GREEN}✓ Porta ${PORT} confirmada como livre!${NC}"
echo -e "${GREEN}Iniciando Next.js na porta ${PORT}...${NC}"

# Start Next.js in foreground (blocking)
# The cleanup trap will handle killing it on script exit
exec npx next dev -p ${PORT}
