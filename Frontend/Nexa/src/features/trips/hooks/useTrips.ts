import { useQuery } from '@tanstack/react-query';

import { getTrips } from '@/api/endpoints/trips';
import { queryKeys } from '@/api/keys';

export function useTrips() {
  return useQuery({
    queryKey: queryKeys.trips,
    queryFn: getTrips,
    select: (trips) =>
      [...trips].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()),
  });
}
