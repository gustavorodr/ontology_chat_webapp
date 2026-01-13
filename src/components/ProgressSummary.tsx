import React from 'react';
import { Session, SkillOntology } from '@/types';
import { ConversationState } from '@/hooks/useConversations';

interface ProgressSummaryProps {
  session: Session;
  ontology?: SkillOntology;
  conversationsUI: ConversationState[];
}

export function ProgressSummary({ session, ontology, conversationsUI }: ProgressSummaryProps) {
  // Preferimos o estado de UI (useConversations) para progresso e contagem
  // de mensagens, pois ele reflete exatamente o que o usuário vê.
  const totalConversations = conversationsUI.length || session.conversations.length;

  const completedConversations = conversationsUI.length
    ? conversationsUI.filter(c => c.conversation.status === 'completed').length
    : session.conversations.filter(conv => conv.status === 'completed').length;

  const progressPercentage = totalConversations > 0
    ? (completedConversations / totalConversations) * 100
    : 0;

  return (
    <div className="progress-summary-card">
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem', color: '#0f172a' }}>
        Progresso da Verificação
      </h2>

      {/* Progress Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#4b5563' }}>
            Conversas concluídas
          </span>
          <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>
            {completedConversations}/{totalConversations}
          </span>
        </div>
        <div style={{ width: '100%', background: '#e5e7eb', borderRadius: 999, height: 6, overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercentage}%`,
              height: '100%',
              borderRadius: 999,
              background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Session Status */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {(() => {
            const color =
              session.status === 'completed'
                ? '#22c55e'
                : session.status === 'active'
                ? '#3b82f6'
                : '#9ca3af';
            return (
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  backgroundColor: color,
                }}
              />
            );
          })()}
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#4b5563' }}>
            Status da Sessão:{' '}
            <span style={{ textTransform: 'capitalize' }}>
              {session.status === 'completed'
                ? 'Concluída'
                : session.status === 'active'
                ? 'Ativa'
                : 'Inicializando'}
            </span>
          </span>
        </div>
      </div>

      {/* Conversations List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 500, color: '#4b5563', margin: 0 }}>Participantes:</h3>
        {session.conversations.map((conversation) => {
          const avatarBg = conversation.employee_avatar_color || '#4f46e5';

          const uiState = conversationsUI.find(
            c => c.conversation.conversation_key === conversation.conversation_key
          );
          const effectiveStatus = uiState?.conversation.status ?? conversation.status;

          const uiMessagesCount = uiState ? uiState.messages.length : undefined;
          const messagesCount =
            uiMessagesCount !== undefined ? uiMessagesCount : (conversation as any).messages_count ?? 0;
          const statusColor =
            effectiveStatus === 'completed'
              ? '#16a34a'
              : effectiveStatus === 'active' ||
                effectiveStatus === 'typing' ||
                effectiveStatus === 'waiting_response'
              ? '#2563eb'
              : '#9ca3af';

          return (
            <div
              key={conversation.conversation_key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.65rem',
                borderRadius: '0.6rem',
                background: '#f9fafb',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    backgroundColor: avatarBg,
                  }}
                >
                  {conversation.employee_name.substring(0, 1)}
                </div>
                <div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#111827' }}>
                    {conversation.employee_name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: 4 }}>
                    ({conversation.employee_role})
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                  {messagesCount} msg
                </span>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: statusColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Show ontology if session is completed */}
      {session.status === 'completed' && ontology && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <h3 style={{ fontWeight: 600, color: '#111827', margin: '0 0 1rem' }}>
            🎯 Ontologia de Habilidades Gerada
          </h3>
          <OntologyDisplay ontology={ontology} />
        </div>
      )}
    </div>
  );
}

interface OntologyDisplayProps {
  ontology: SkillOntology;
}

function OntologyDisplay({ ontology }: OntologyDisplayProps) {
  // Backend retorna a ontologia em um formato próprio (subject, session,
  // ontology_data, verified_skills, etc.). Aqui construímos o objeto
  // "structured_data" esperado pelo componente de UI a partir desse
  // payload bruto, mantendo compatibilidade com o tipo SkillOntology
  // usado no frontend.
  const raw: any = ontology as any;

  const mapConfidenceLabel = (label: string | undefined): number => {
    if (!label) return 0.5;
    const norm = label.toLowerCase();
    if (norm === 'high') return 0.9;
    if (norm === 'medium') return 0.7;
    if (norm === 'low') return 0.4;
    return 0.5;
  };

  const bug = raw.session?.bug || {};
  const subject = raw.subject || {};
  const verifiedSkills = Array.isArray(raw.verified_skills) ? raw.verified_skills : [];

  const structured = (raw.structured_data as any) || {
    subject: {
      name: subject.name ?? 'Funcionário avaliado',
      role: subject.role ?? 'Desconhecido',
      employee_key: subject.employee_key ?? '',
    },
    bug_context: {
      bug_key: bug.bug_key ?? '',
      title: bug.title ?? '',
      severity: bug.severity ?? 'N/A',
      business_impact:
        raw.business_impact_description ??
        'Impacto positivo demonstrado pela correção do bug em produção.',
    },
    verified_skills: verifiedSkills.map((skill: any) => {
      const verifications = Array.isArray(skill.skill_verifications)
        ? skill.skill_verifications
        : [];

      return {
        skill_name: skill.skill_name,
        evidence: skill.evidence_description,
        confidence_level: mapConfidenceLabel(skill.confidence_level),
        business_impact: `Impacto ${skill.business_impact_score ?? 0}/5`,
        verifications: verifications.map((v: any) => ({
          verified_by: v.verifier?.name ?? 'Desconhecido',
          verifier_role: v.verification_role ?? v.verifier?.role ?? 'Verificador',
          confidence_level: (v.verification_rating ?? 0) / 5,
          evidence_quote: v.verification_comment ?? '',
        })),
      };
    }),
    verification_summary: {
      total_verifiers: verifiedSkills.reduce((acc: number, skill: any) => {
        const verifs = Array.isArray(skill.skill_verifications)
          ? skill.skill_verifications.length
          : 0;
        return acc + verifs;
      }, 0),
      completion_rate: 1,
      overall_confidence: typeof raw.confidence_score === 'number'
        ? raw.confidence_score
        : 0.8,
      generated_at: raw.generated_at ?? raw.created_at ?? '',
    },
  };

  const data = structured;

  if (!data) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Subject Info */}
      <div style={{ background: '#eff6ff', padding: '0.9rem 1rem', borderRadius: '0.75rem' }}>
        <h4 style={{ fontWeight: 500, color: '#1d4ed8', margin: '0 0 0.35rem' }}>Sujeito Avaliado</h4>
        <p style={{ fontSize: '0.9rem', color: '#1e40af', margin: 0 }}>
          <strong>{data.subject.name}</strong> ({data.subject.role})
        </p>
      </div>

      {/* Bug Context */}
      <div style={{ background: '#f9fafb', padding: '0.9rem 1rem', borderRadius: '0.75rem' }}>
        <h4 style={{ fontWeight: 500, color: '#111827', margin: '0 0 0.35rem' }}>Contexto do Bug</h4>
        <div style={{ fontSize: '0.9rem', color: '#374151' }}>
          <p style={{ margin: '0 0 0.2rem' }}><strong>Título:</strong> {data.bug_context.title}</p>
          <p style={{ margin: '0 0 0.2rem' }}><strong>Severidade:</strong> {data.bug_context.severity}</p>
          <p style={{ margin: 0 }}><strong>Impacto:</strong> {data.bug_context.business_impact}</p>
        </div>
      </div>

      {/* Verified Skills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h4 style={{ fontWeight: 500, color: '#111827', margin: 0 }}>Habilidades Verificadas</h4>
        {data.verified_skills.map((skill, index) => (
          <div key={index} style={{ background: '#ecfdf3', padding: '0.9rem 1rem', borderRadius: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <h5 style={{ fontWeight: 500, color: '#166534', margin: 0 }}>{skill.skill_name}</h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#15803d' }}>
                  Confiança: {Math.round(skill.confidence_level * 100)}%
                </span>
                <div style={{ width: 44, height: 6, background: '#bbf7d0', borderRadius: 999, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${skill.confidence_level * 100}%`,
                      height: '100%',
                      background: '#22c55e',
                    }}
                  />
                </div>
              </div>
            </div>
            
            <p style={{ fontSize: '0.88rem', color: '#166534', margin: '0 0 0.3rem' }}>
              <strong>Evidência:</strong> {skill.evidence}
            </p>
            
            <p style={{ fontSize: '0.88rem', color: '#166534', margin: '0 0 0.5rem' }}>
              <strong>Impacto no Negócio:</strong> {skill.business_impact}
            </p>

            {/* Verifications */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 500, color: '#166534', margin: 0 }}>
                Verificado por:
              </p>
              {skill.verifications.map((verification, vIndex) => (
                <div key={vIndex} style={{ background: '#dcfce7', padding: '0.4rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.78rem', color: '#166534' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 500 }}>
                      {verification.verified_by} ({verification.verifier_role})
                    </span>
                    <span>
                      {Math.round(verification.confidence_level * 100)}%
                    </span>
                  </div>
                  <p style={{ margin: '0.2rem 0 0', fontStyle: 'italic' }}>
                    "{verification.evidence_quote}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ background: '#eef2ff', padding: '0.9rem 1rem', borderRadius: '0.75rem' }}>
        <h4 style={{ fontWeight: 500, color: '#3730a3', margin: '0 0 0.5rem' }}>Resumo da Verificação</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.6rem', fontSize: '0.88rem', color: '#4338ca' }}>
          <div>
            <span style={{ fontWeight: 500 }}>Total de Verificadores:</span>
            <span style={{ marginLeft: 4 }}>{data.verification_summary.total_verifiers}</span>
          </div>
          <div>
            <span style={{ fontWeight: 500 }}>Taxa de Conclusão:</span>
            <span style={{ marginLeft: 4 }}>{Math.round(data.verification_summary.completion_rate * 100)}%</span>
          </div>
          <div>
            <span style={{ fontWeight: 500 }}>Confiança Geral:</span>
            <span style={{ marginLeft: 4 }}>{Math.round(data.verification_summary.overall_confidence * 100)}%</span>
          </div>
          <div>
            <span style={{ fontWeight: 500 }}>Gerado em:</span>
            <span style={{ marginLeft: 4 }}>
              {new Date(data.verification_summary.generated_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}