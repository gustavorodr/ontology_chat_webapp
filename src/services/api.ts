import { getClientEnv } from '@/config/env';
import {
  Bug,
  BugListResponse,
  ConversationMessagesResponse,
  ConversationStatus,
  CreateSessionRequest,
  Employee,
  EmployeeListResponse,
  NextMessageResponse,
  SendMessageRequest,
  Session,
  SessionListResponse,
  SkillOntology,
  UpdateConversationStatusRequest,
  CreateBugRequest,
} from '@/types';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getClientEnv().API_BASE_URL;
  }

  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  // Session endpoints
  async createSession(request: CreateSessionRequest): Promise<Session> {
    return this.fetchApi<Session>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getSession(sessionKey: string): Promise<Session> {
    return this.fetchApi<Session>(`/api/sessions/${sessionKey}`);
  }

  async getSessions(): Promise<SessionListResponse> {
    return this.fetchApi<SessionListResponse>('/api/sessions');
  }

  async getSessionOntology(sessionKey: string): Promise<SkillOntology> {
    return this.fetchApi<SkillOntology>(`/api/sessions/${sessionKey}/ontology`);
  }

  // Conversation endpoints
  async getNextMessage(conversationKey: string): Promise<NextMessageResponse | null> {
    // Tratamos 404 como "sem próxima mensagem" em vez de erro.
    const url = `${this.baseUrl}/api/conversations/${conversationKey}/next-message`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  async sendMessage(
    conversationKey: string,
    request: SendMessageRequest
  ): Promise<NextMessageResponse> {
    return this.fetchApi<NextMessageResponse>(`/api/conversations/${conversationKey}/messages`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateConversationStatus(
    conversationKey: string,
    request: UpdateConversationStatusRequest
  ): Promise<ConversationStatus> {
    return this.fetchApi<ConversationStatus>(`/api/conversations/${conversationKey}/status`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getConversationMessages(conversationKey: string): Promise<ConversationMessagesResponse> {
    return this.fetchApi<ConversationMessagesResponse>(`/api/conversations/${conversationKey}/messages`);
  }

  // Employee endpoints
  async getEmployees(): Promise<EmployeeListResponse> {
    return this.fetchApi<EmployeeListResponse>('/api/employees');
  }

  async getEmployee(employeeKey: string): Promise<Employee> {
    return this.fetchApi<Employee>(`/api/employees/${employeeKey}`);
  }

  // Bug endpoints
  async getBugs(): Promise<BugListResponse> {
    return this.fetchApi<BugListResponse>('/api/bugs');
  }

  async getBug(bugKey: string): Promise<Bug> {
    return this.fetchApi<Bug>(`/api/bugs/${bugKey}`);
  }

   async createBug(request: CreateBugRequest): Promise<Bug> {
    return this.fetchApi<Bug>('/api/bugs', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Skill Ontology endpoints
  async getSkillOntology(skillOntologieKey: string): Promise<SkillOntology> {
    return this.fetchApi<SkillOntology>(`/api/skill-ontologies/${skillOntologieKey}`);
  }
}

export const apiService = new ApiService();