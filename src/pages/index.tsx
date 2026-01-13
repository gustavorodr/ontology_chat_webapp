import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiService } from '@/services/api';
import type { CreateBugRequest, Employee, Session } from '@/types';

export default function VerificationPage() {
  const router = useRouter();
  return (
    <BugSelectionView onSessionCreated={(key) => router.push(`/session/${key}`)} />
  );
}

interface BugSelectionViewProps {
  onSessionCreated: (sessionKey: string) => void;
}

function BugSelectionView({ onSessionCreated }: BugSelectionViewProps) {
  const [bugs, setBugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedBugKey, setSelectedBugKey] = useState<string>('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(true);
  const [selectedParticipantKeys, setSelectedParticipantKeys] = useState<string[]>([]);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  const [newBug, setNewBug] = useState<CreateBugRequest>({
    // Use an example ID that does not collide with the seeded sample bug
    bug_id: 'BUG-5001',
    title: '',
    severity: 'P1',
    status: 'completed',
    completed_date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    loadBugs();
    loadEmployees();
    loadSessions();
  }, []);

  const loadBugs = async () => {
    try {
      const response = await apiService.getBugs();
      setBugs(response.bugs);
    } catch (error) {
      console.error('Failed to load bugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await apiService.getEmployees();
      setEmployees(response.employees);

      // Pré-seleciona participantes relevantes (Subject, Verifiers, Context Provider)
      const defaultSelected = response.employees
        .filter(emp => {
          const role = emp.role.toLowerCase();
          return (
            role.includes('backend developer') ||
            role.includes('qa lead') ||
            role.includes('tech lead') ||
            role.includes('product manager') ||
            role.includes('customer support')
          );
        })
        .map(emp => emp.employee_key);

      setSelectedParticipantKeys(defaultSelected);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setParticipantsLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await apiService.getSessions();
      setSessions(response.sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setSessionsError('Erro ao carregar sessões');
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!selectedBugKey) return;

    setCreating(true);
    try {
      const session = await apiService.createSession({ bug_key: selectedBugKey });
      onSessionCreated(session.session_key);
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Erro ao criar sessão de verificação');
    } finally {
      setCreating(false);
    }
  };

  const handleCreateBugAndSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBug.title.trim() || !newBug.bug_id.trim()) return;

    setCreating(true);
    try {
      const createdBug = await apiService.createBug(newBug);
      const session = await apiService.createSession({ bug_key: createdBug.bug_key });
      onSessionCreated(session.session_key);
    } catch (error) {
      console.error('Failed to create bug and session:', error);
      alert('Erro ao criar bug e sessão de verificação');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="verification-page">
        <div className="verification-card" style={{ textAlign: 'center' }}>
          <p className="verification-title" style={{ marginBottom: '1rem' }}>
            Iniciando ambiente de verificação
          </p>
          <p className="verification-subtitle">
            Carregando bugs disponíveis...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-page">
      <div className="verification-card">
        <h1 className="verification-title">
          Iniciar Verificação de Habilidades
        </h1>
        <p className="verification-subtitle">
          Selecione um bug concluído para iniciar o processo de verificação automática
        </p>

        {bugs.length === 0 ? (
          <div className="verification-empty-state">
            Nenhum bug disponível para verificação.
            <br />
            Certifique-se de que o backend está rodando e que existe ao menos um bug com status "completed".
          </div>
        ) : (
          <>
            <div className="bugs-list">
              {bugs
                // Só permite iniciar sessão para bugs concluídos que não
                // possuam uma sessão de verificação já concluída.
                .filter(bug => bug.status === 'completed' && bug.session_status !== 'completed')
                .map((bug) => {
                  const selected = selectedBugKey === bug.bug_key;
                  return (
                    <div
                      key={bug.bug_key}
                      className={`bug-card ${selected ? 'bug-card-selected' : ''}`}
                      onClick={() => setSelectedBugKey(bug.bug_key)}
                    >
                      <div style={{ flex: 1 }}>
                        <h4 className="bug-card-title">{bug.title}</h4>
                        <p className="bug-card-description">{bug.description}</p>
                        <div className="bug-card-meta">
                          <span className="bug-severity-pill">{bug.severity}</span>
                          <span className="bug-completed-date">
                            Concluído em: {new Date(bug.completed_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        className="bug-radio"
                        checked={selected}
                        onChange={() => setSelectedBugKey(bug.bug_key)}
                      />
                    </div>
                  );
                })}
            </div>

            <div className="verification-actions">
              <button
                onClick={handleCreateSession}
                disabled={!selectedBugKey || creating}
                className="btn-primary"
              >
                {creating ? 'Iniciando verificação...' : 'Iniciar Verificação'}
              </button>
            </div>

            {/* Lista de sessões concluídas, logo abaixo do botão */}
            <div style={{ marginTop: '1.5rem' }}>
              <h2 className="verification-title" style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                Sessões já concluídas
              </h2>
              {sessionsLoading ? (
                <p className="verification-subtitle">Carregando sessões...</p>
              ) : sessionsError ? (
                <p className="verification-empty-state">{sessionsError}</p>
              ) : sessions.filter(s => s.status === 'completed').length === 0 ? (
                <p className="verification-subtitle">
                  Nenhuma sessão concluída ainda. Conclua uma verificação para vê-la aqui.
                </p>
              ) : (
                <div className="bugs-list">
                  {sessions
                    .filter(s => s.status === 'completed')
                    .map(session => (
                      <div
                        key={session.session_key}
                        className="bug-card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onSessionCreated(session.session_key)}
                      >
                        <div style={{ flex: 1 }}>
                          <h4 className="bug-card-title">
                            Sessão {session.session_key.slice(0, 8)}...
                          </h4>
                          <p className="bug-card-description">
                            Status: concluída &mdash; conversas: {session.conversations.length}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <h2 className="verification-title" style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                Ou crie um novo bug concluído para iniciar uma nova sessão:
              </h2>
              <form onSubmit={handleCreateBugAndSession} style={{ display: 'grid', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: '1.5fr 1fr' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      ID do Bug (ex: BUG-2847)
                    </label>
                    <input
                      type="text"
                      value={newBug.bug_id}
                      onChange={(e) => setNewBug({ ...newBug, bug_id: e.target.value })}
                      style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Severidade
                    </label>
                    <select
                      value={newBug.severity}
                      onChange={(e) => setNewBug({ ...newBug, severity: e.target.value })}
                      style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                    >
                      <option value="P0">P0</option>
                      <option value="P1">P1</option>
                      <option value="P2">P2</option>
                      <option value="P3">P3</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Título
                  </label>
                  <input
                    type="text"
                    value={newBug.title}
                    onChange={(e) => setNewBug({ ...newBug, title: e.target.value })}
                    placeholder="Payment failures on concurrent transactions"
                    style={{ width: '95%', padding: '0.45rem 0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Data de conclusão
                  </label>
                  <input
                    type="date"
                    value={newBug.completed_date || ''}
                    onChange={(e) => setNewBug({ ...newBug, completed_date: e.target.value })}
                    style={{ padding: '0.45rem 0.6rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.35rem' }}>
                    Participantes da verificação
                  </label>
                  {participantsLoading ? (
                    <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      Carregando participantes...
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                      {employees.map((emp) => {
                        const checked = selectedParticipantKeys.includes(emp.employee_key);
                        return (
                          <label
                            key={emp.employee_key}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              fontSize: '0.8rem',
                              padding: '0.35rem 0.5rem',
                              borderRadius: '0.5rem',
                              border: '1px solid #e5e7eb',
                              background: checked ? '#eff6ff' : '#ffffff',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setSelectedParticipantKeys(prev =>
                                  prev.includes(emp.employee_key)
                                    ? prev.filter(k => k !== emp.employee_key)
                                    : [...prev, emp.employee_key]
                                );
                              }}
                              style={{ margin: 0 }}
                            />
                            <span>
                              <span style={{ fontWeight: 600 }}>{emp.name}</span>
                              <span style={{ color: '#6b7280' }}> – {emp.role}</span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  <p style={{ marginTop: '0.35rem', fontSize: '0.75rem', color: '#6b7280' }}>
                    Os participantes selecionados serão usados pelo sistema para conduzir as conversas de verificação.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={creating || !newBug.title.trim() || !newBug.bug_id.trim()}
                  className="btn-primary"
                >
                  {creating ? 'Criando bug e sessão...' : 'Criar bug concluído e iniciar sessão'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}