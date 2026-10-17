import { useQuery } from '@tanstack/react-query';

import { getDashboard } from '@/api/endpoints/dashboard';
import { queryKeys } from '@/api/keys';

export function useDashboard() {
  return useQuery({ queryKey: queryKeys.dashboard, queryFn: getDashboard });
}
