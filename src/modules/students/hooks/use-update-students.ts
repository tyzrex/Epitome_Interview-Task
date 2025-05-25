import { revalidateAfterUpdate } from '@/actions/revalidate';
import { StudentUpdateData } from '@/modules/students/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StudentUpdateData) => {
      const response = await fetch(`/api/students/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch students data
      queryClient.invalidateQueries({ queryKey: ['students'] });
      revalidateAfterUpdate('students');
    },
  });
}
