import { PaginatedResponse } from '@/lib/types';
import { buildQueryParams } from '@/lib/utils';
import { Student } from '@/modules/students/types';
import { fetchWrapper } from '@/services/request-handler';

export const getStudents = async (params: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  program?: string;
}) => {
  const { page, pageSize, search, status, program } = params;

  const queryParams: Record<string, string | number | undefined> = {
    page,
    limit: pageSize,
    ...(search && { name: search }),
    ...(status && { status }),
    ...(program && { program }),
  };

  const queryString = buildQueryParams(queryParams);
  try {
    const response = await fetchWrapper<PaginatedResponse<Student>>(
      `/api/students${queryString}`,
      {
        method: 'GET',
        validateStatus: (httpStatus: number) =>
          httpStatus >= 200 && httpStatus < 300,
        tags: ['students', 'list'],
        cache: 'no-cache',
      },
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (_error) {
    return {
      success: false,
      message: 'Failed to fetch students',
    };
  }
};

export const updateStudentStatus = async (
  studentId: string,
  status?: string,
): Promise<{ success: boolean; data?: Student; message?: string }> => {
  try {
    console.log('Status:', status);
    const response = await fetchWrapper<Student>(`/api/students/${studentId}`, {
      method: 'PATCH',
      body: {
        status: status,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: (httpStatus: number) =>
        httpStatus >= 200 && httpStatus < 300,
      tags: ['students', 'update'],
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update student status',
    };
  }
};
