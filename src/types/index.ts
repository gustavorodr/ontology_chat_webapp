// Employee Types
export interface Employee {
  employee_key: string;
  name: string;
  role: string;
  user_type: string;
  relevance_level: number;
  avatar_color: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeListResponse {
  employees: Employee[];
}

// Bug Types
export interface Bug {
  bug_key: string;
  title: string;
  description: string;
  severity: string;
  assignee_key: string;
  pr_link: string | null;
  status: string;
  completed_date: string;
  created_at: string;
  updated_at: string;
}

export interface BugListResponse {
  bugs: Bug[];
}

// Payload para criar um novo bug
export interface CreateBugRequest {
  bug_id: string;
  title: string;
  severity: string;
  assignee_id?: number | null;
  pr_link?: string | null;
  pr_merged_by?: number | null;
  status?: string;
  completed_date?: string | null;
}

// Session Types
export interface Session {
  session_key: string;
  bug_key: string;
  status: 'initializing' | 'active' | 'completed';
  started_at: string;
  completed_at?: string;
  conversations: ConversationSummary[];
}

export interface SessionListResponse {
  sessions: Session[];
}

export interface ConversationSummary {
  conversation_key: string;
  employee_key: string;
  employee_name: string;
  employee_role: string;
  employee_avatar_color?: string;
  status: ConversationStatusType;
  messages_count: number;
}

export interface CreateSessionRequest {
  bug_key: string;
}

// Conversation Types
export type ConversationStatusType = 
  | 'not_started'
  | 'active'
  | 'waiting_response'
  | 'typing'
  | 'completed';

export interface ConversationStatus {
  conversation_key: string;
  status: ConversationStatusType;
  updated_at: string;
}

export interface UpdateConversationStatusRequest {
  status: ConversationStatusType;
  duration_ms?: number;
}

// Message Types
export interface Message {
  message_key: string;
  conversation_key: string;
  sender: 'Alia' | 'Employee';
  content: string;
  message_type: 'text' | 'system';
  timestamp: string;
}

export interface NextMessageResponse {
  message_key: string;
  content: string;
  sender: 'Alia' | 'Employee';
  timestamp: string;
  is_final_message: boolean;
}

export interface ConversationMessagesResponse {
  conversation_key: string;
  employee_name: string;
  messages: Message[];
}

export interface SendMessageRequest {
  content: string;
  sender: 'Alia' | 'Employee';
  message_type?: 'text' | 'system';
}

// Skill Ontology Types
export interface SkillVerification {
  verified_by: string;
  verifier_role: string;
  confidence_level: number;
  evidence_quote: string;
}

export interface VerifiedSkill {
  skill_name: string;
  evidence: string;
  confidence_level: number;
  business_impact: string;
  verifications: SkillVerification[];
}

export interface SkillOntology {
  skill_ontologie_key: string;
  session_key: string;
  structured_data: {
    subject: {
      name: string;
      role: string;
      employee_key: string;
    };
    bug_context: {
      bug_key: string;
      title: string;
      severity: string;
      business_impact: string;
    };
    verified_skills: VerifiedSkill[];
    verification_summary: {
      total_verifiers: number;
      completion_rate: number;
      overall_confidence: number;
      generated_at: string;
    };
  };
  created_at: string;
}

// UI Types
export interface ChatWindowProps {
  conversation: ConversationSummary;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export interface StatusIndicatorProps {
  status: ConversationStatusType;
  className?: string;
}

export interface ProgressSummaryProps {
  session: Session;
  ontology?: SkillOntology;
}