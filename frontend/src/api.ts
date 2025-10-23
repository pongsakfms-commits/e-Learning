import { AttemptSummary, AttemptDetail, Student, Quiz } from './types';

const API_BASE = '/api/admin';

export async function getAttempts(filters?: {
  studentId?: number;
  quizId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}): Promise<AttemptSummary[]> {
  const params = new URLSearchParams();
  if (filters?.studentId) params.append('studentId', filters.studentId.toString());
  if (filters?.quizId) params.append('quizId', filters.quizId.toString());
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.search) params.append('search', filters.search);

  const response = await fetch(`${API_BASE}/attempts?${params}`);
  if (!response.ok) throw new Error('Failed to fetch attempts');
  return response.json();
}

export async function getAttemptDetail(id: number): Promise<AttemptDetail> {
  const response = await fetch(`${API_BASE}/attempts/${id}`);
  if (!response.ok) throw new Error('Failed to fetch attempt detail');
  return response.json();
}

export async function updateScore(id: number, score: number, note?: string): Promise<void> {
  const response = await fetch(`${API_BASE}/attempts/${id}/score`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score, note })
  });
  if (!response.ok) throw new Error('Failed to update score');
}

export async function addNote(id: number, note: string): Promise<void> {
  const response = await fetch(`${API_BASE}/attempts/${id}/note`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note })
  });
  if (!response.ok) throw new Error('Failed to add note');
}

export async function getStudents(): Promise<Student[]> {
  const response = await fetch(`${API_BASE}/students`);
  if (!response.ok) throw new Error('Failed to fetch students');
  return response.json();
}

export async function getQuizzes(): Promise<Quiz[]> {
  const response = await fetch(`${API_BASE}/quizzes`);
  if (!response.ok) throw new Error('Failed to fetch quizzes');
  return response.json();
}

export async function getStudentReport(studentId: number): Promise<any> {
  const response = await fetch(`${API_BASE}/report/${studentId}`);
  if (!response.ok) throw new Error('Failed to fetch report');
  return response.json();
}
