import { PaginatedResponse } from '@/lib/types';
import { Student, StudentFilters } from '@/modules/students/types';
import { useQuery } from '@tanstack/react-query';

interface UseStudentsParams {
  page: number;
  limit: number;
  filters: StudentFilters;
}

export function useStudents({ page, limit, filters }: UseStudentsParams) {
  return useQuery({
    queryKey: ['students', page, limit, filters],
    queryFn: async (): Promise<PaginatedResponse<Student>> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: filters.search,
        status: filters.status,
        program: filters.program,
      });

      const response = await fetch(`/api/students?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      return response.json();
    },
  });
}
