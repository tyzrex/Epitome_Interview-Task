import { revalidateAfterUpdate } from '@/actions/revalidate';
import { updateStudentStatus } from '@/modules/students/services/student-api';
import { StudentUpdateData } from '@/modules/students/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StudentUpdateData) => {
      console.log(data);
      const response = await updateStudentStatus(data.id, data.status);

      if (!response.success) {
        throw new Error('Failed to update student');
      }

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch students data
      queryClient.invalidateQueries({ queryKey: ['students'] });
      revalidateAfterUpdate('students');
    },
  });
}
