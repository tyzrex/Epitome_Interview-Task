import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share, Server } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { getStudents } from '@/modules/students/services/student-api';
import { parseSearchParams } from '@/lib/utils';
import { ServerStudentTable } from '@/modules/students/components/student-table';
import { ServerStudentPagination } from '@/modules/students/components/server-student-pagination';
import TableSkeleton from '@/modules/students/components/table-skeleton';
import { ServerStudentFilters } from '@/modules/students/components/server-side-student-filters';

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

  console.log(filters);
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

  console.log(filters);

  return (
    <>
      <ServerStudentFilters filters={filters} />

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

        {filters.status === 'All' &&
          filters.program === 'All' &&
          filters.search === '' && (
            <Badge
              variant='secondary'
              className='border-gray-200 bg-gray-50 text-gray-700'
            >
              No filters applied
            </Badge>
          )}
      </div>

      <div className='flex flex-wrap items-center justify-between'>
        <p className='text-sm text-gray-600'>
          Showing {response.data?.pagination?.limit} of{' '}
          {response.data?.pagination?.total} students
        </p>
        <div className='hidden items-center gap-2 sm:flex'>
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

export default async function ServerStudentDashboard({
  searchParams,
}: ServerStudentDashboardProps) {
  const key = JSON.stringify(await searchParams);
  return (
    <div className='space-y-6'>
      <div className='flex flex-col justify-between gap-5 md:flex-row md:items-center'>
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

      <Suspense fallback={<TableSkeleton />} key={key}>
        <ServerStudentContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
