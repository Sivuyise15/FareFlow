import { useMutation, useQueryClient } from '@tanstack/react-query';

import { importReceipts } from '@/api/endpoints/sync';
import { queryKeys } from '@/api/keys';

export function useImportReceipts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importReceipts,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      void queryClient.invalidateQueries({ queryKey: queryKeys.trips });
    },
  });
}
