import { USE_MOCKS } from '@/constants/config';
import { request } from '../client';
import { mockDashboard } from '../mock';
import type { DashboardSummary } from '../types';

export function getDashboard(): Promise<DashboardSummary> {
  if (USE_MOCKS) return mockDashboard();
  return request<DashboardSummary>('/api/dashboard');
}
