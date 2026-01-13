/**
 * Application constants
 */

export const APP_CONFIG = {
  NAME: 'Alia - Sistema de Verificação de Habilidades',
  DESCRIPTION: 'Sistema de verificação automática de competências através de conversas com múltiplos stakeholders',
  VERSION: '1.0.0',
} as const;

export const API_ENDPOINTS = {
  // Session endpoints
  SESSIONS: '/api/sessions',
  SESSION_BY_KEY: (key: string) => `/api/sessions/${key}`,
  SESSION_ONTOLOGY: (key: string) => `/api/sessions/${key}/ontology`,
  
  // Conversation endpoints
  NEXT_MESSAGE: (key: string) => `/api/conversations/${key}/next-message`,
  SEND_MESSAGE: (key: string) => `/api/conversations/${key}/messages`,
  UPDATE_STATUS: (key: string) => `/api/conversations/${key}/status`,
  CONVERSATION_MESSAGES: (key: string) => `/api/conversations/${key}/messages`,
  
  // Employee endpoints
  EMPLOYEES: '/api/employees',
  EMPLOYEE_BY_KEY: (key: string) => `/api/employees/${key}`,
  
  // Bug endpoints
  BUGS: '/api/bugs',
  BUG_BY_KEY: (key: string) => `/api/bugs/${key}`,
  
  // Skill Ontology endpoints
  SKILL_ONTOLOGY: (key: string) => `/api/skill-ontologies/${key}`,
} as const;

export const CONVERSATION_STATUS = {
  NOT_STARTED: 'not_started',
  ACTIVE: 'active',
  WAITING_RESPONSE: 'waiting_response',
  TYPING: 'typing',
  COMPLETED: 'completed',
} as const;

export const SESSION_STATUS = {
  INITIALIZING: 'initializing',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export const MESSAGE_SENDER = {
  ALIA: 'Alia',
  EMPLOYEE: 'Employee',
} as const;

export const MESSAGE_TYPE = {
  TEXT: 'text',
  SYSTEM: 'system',
} as const;

export const POLLING_INTERVALS = {
  SESSION_STATUS: 5000, // 5 seconds
  NEXT_MESSAGE: 3000,   // 3 seconds
  TYPING_DURATION: 2000, // 2 seconds
} as const;

export const ANIMATION_DURATIONS = {
  MESSAGE_APPEAR: 300,
  STATUS_TRANSITION: 500,
  TYPING_INDICATOR: 1400,
} as const;

export const UI_CONSTANTS = {
  MAX_CHAT_WINDOWS: 4,
  MESSAGE_MAX_LENGTH: 500,
  CHAT_CONTAINER_HEIGHT: 'calc(100vh - 12rem)',
} as const;

export const AVATAR_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
] as const;

export const EMPLOYEE_ROLES = {
  BACKEND_DEVELOPER: 'Backend Developer',
  FRONTEND_DEVELOPER: 'Frontend Developer',
  QA_LEAD: 'QA Lead',
  TECH_LEAD: 'Tech Lead',
  PRODUCT_MANAGER: 'Product Manager',
  CUSTOMER_SUPPORT: 'Customer Support',
  DEVOPS_ENGINEER: 'DevOps Engineer',
  DATA_ANALYST: 'Data Analyst',
} as const;

export const USER_TYPES = {
  SUBJECT: 'Subject',
  VERIFIER: 'Verifier',
  CONTEXT_PROVIDER: 'Context Provider',
  IRRELEVANT: 'Irrelevant',
} as const;

export const BUG_SEVERITIES = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
} as const;

export const BUG_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CLOSED: 'closed',
} as const;