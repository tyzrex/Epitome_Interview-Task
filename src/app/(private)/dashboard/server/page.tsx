import { Suspense } from 'react';
// import { ServerStudentTable } from './ServerStudentTable';
// import { ServerStudentFilters } from './ServerStudentFilters';
// import { ServerStudentPagination } from './ServerStudentPagination';
// import { DashboardSkeleton } from './DashboardSkeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share, Server } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { getStudents } from '@/modules/students/services/student-api';
import { parseSearchParams } from '@/lib/utils';
import { ServerStudentTable } from '@/modules/students/components/server-student-table';
import { ServerStudentPagination } from '@/modules/students/components/server-student-pagination';

interface ServerStudentDashboardProps {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    program?: string;
  }>;
}

async function ServerStudentContent({
  searchParams,
}: ServerStudentDashboardProps) {
  const filters = parseSearchParams(
    new URLSearchParams((await searchParams) as any),
  );
  const response = await getStudents({
    page: filters.page,
    pageSize: filters.limit,
    search: filters.search,
    status: filters.status,
    program: filters.program,
  });

  async function revalidateData() {
    'use server';
    revalidatePath('/dashboard/server');
  }

  if (!response.success) {
    return <p className='text-red-500'>Failed to load students data</p>;
  }

  return (
    <>
      {/* Filters */}
      {/* <ServerStudentFilters filters={filters} /> */}

      {/* Active Filters */}
      <div className='flex flex-wrap items-center gap-2'>
        {filters.status !== 'All' && (
          <Badge
            variant='secondary'
            className='border-teal-200 bg-teal-50 text-teal-700'
          >
            Status: {filters.status}
          </Badge>
        )}
        {filters.program !== 'All' && (
          <Badge
            variant='secondary'
            className='border-teal-200 bg-teal-50 text-teal-700'
          >
            Program: {filters.program}
          </Badge>
        )}
        {filters.search && (
          <Badge
            variant='secondary'
            className='border-teal-200 bg-teal-50 text-teal-700'
          >
            Search: &quot;{filters.search}&quot;
          </Badge>
        )}
      </div>

      {/* Results Summary */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-600'>
          Showing {response.data?.pagination?.limit} of{' '}
          {response.data?.pagination?.total} students
        </p>
        <div className='flex items-center gap-2'>
          <p className='text-xs text-gray-500'>
            Server-side rendering with Next.js
          </p>
          <form action={revalidateData}>
            <Button
              type='submit'
              variant='outline'
              size='sm'
              className='text-xs'
            >
              Refresh Data
            </Button>
          </form>
        </div>
      </div>

      {/* Students Table */}
      <ServerStudentTable
        students={response.data?.data || []}
        revalidateData={revalidateData}
      />

      {/* Pagination */}
      {response.data && response.data?.pagination?.totalPages > 1 && (
        <ServerStudentPagination
          pagination={response.data?.pagination}
          filters={filters}
        />
      )}
    </>
  );
}

export default function ServerStudentDashboard({
  searchParams,
}: ServerStudentDashboardProps) {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='flex items-center gap-2 text-2xl font-semibold text-gray-900'>
            <Server className='h-6 w-6 text-teal-600' />
            Students (Server-Side)
          </h1>
          <p className='mt-1 text-gray-600'>
            Server-side rendered student data with URL-based filtering
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button variant='outline' className='flex items-center gap-2'>
            <Share className='h-4 w-4' />
            Share
          </Button>
          <Button className='flex items-center gap-2 bg-teal-600 hover:bg-teal-700'>
            <Download className='h-4 w-4' />
            Export
          </Button>
        </div>
      </div>

      <Suspense fallback={null}>
        <ServerStudentContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
