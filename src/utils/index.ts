/**
 * Utility functions for the application
 */

/**
 * Format timestamp to readable time
 */
export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString();
}

/**
 * Format timestamp to full readable datetime
 */
export function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Get avatar color based on name
 */
export function getAvatarColor(name: string): string {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
  ];
  
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

/**
 * Delay execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate random delay between min and max milliseconds
 */
export function randomDelay(min: number = 1000, max: number = 3000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Check if conversation is active (can send/receive messages)
 */
export function isConversationActive(status: string): boolean {
  return ['active', 'waiting_response', 'typing'].includes(status);
}

/**
 * Get status display text in Portuguese
 */
export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'not_started': 'Não iniciada',
    'active': 'Ativa',
    'waiting_response': 'Aguardando resposta',
    'typing': 'Digitando...',
    'completed': 'Concluída',
  };
  
  return statusMap[status] || 'Desconhecido';
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Validate if string is a valid UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}