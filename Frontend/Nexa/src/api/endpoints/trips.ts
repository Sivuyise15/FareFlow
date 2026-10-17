import { USE_MOCKS } from '@/constants/config';
import { request } from '../client';
import { mockTrips } from '../mock';
import type { Trip } from '../types';

export function getTrips(): Promise<Trip[]> {
  if (USE_MOCKS) return mockTrips();
  return request<Trip[]>('/api/trips');
}
