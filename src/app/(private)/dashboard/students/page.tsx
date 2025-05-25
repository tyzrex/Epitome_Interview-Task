'use client';

import { useState } from 'react';
import type { StudentFilters, ViewMode } from '@/modules/students';
import { useDebounce } from '@/hooks/use-debounce';
import {
  VIRTUALIZATION_THRESHOLD,
  RECOMMENDED_PAGE_SIZE,
} from '@/modules/students/';
import { StudentFiltersComponent } from '@/modules/students/components/student-filters';
import { StudentPagination } from '@/modules/students/components/student-pagination';
import { VirtualizationWarning } from '@/modules/students/components/virtualization-warning';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Download, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServerStudentTable } from '@/modules/students/components/student-table';
import { useStudents } from '@/modules/students/hooks';

export default function StudentDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filters, setFilters] = useState<StudentFilters>({
    search: '',
    status: 'All',
    program: 'All',
  });

  // Debounce search to avoid too many API calls
  const debouncedFilters = useDebounce(filters, 300);

  const { data, isLoading, error, isError } = useStudents({
    page,
    limit,
    filters: debouncedFilters,
  });

  const handleFiltersChange = (newFilters: Partial<StudentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  // Check if we should show virtualization warning
  const shouldShowVirtualizationWarning =
    data && data.pagination.total > VIRTUALIZATION_THRESHOLD;

  if (isError) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load students'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900'>Students</h1>
          <p className='mt-1 text-gray-600'>
            Manage student applications and track their progress
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

      {/* Virtualization Warning */}
      {shouldShowVirtualizationWarning && (
        <VirtualizationWarning
          totalRecords={data.pagination.total}
          currentPageSize={limit}
          onOptimize={() => setLimit(RECOMMENDED_PAGE_SIZE)}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className='flex justify-center py-12'>
          <LoadingSpinner size='lg' />
        </div>
      )}

      {/* Content */}
      {data && (
        <>
          {/* Results Summary */}
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-600'>
              Showing {data.pagination.limit} of {data.pagination.total}{' '}
              students
            </p>
            <p className='text-xs text-gray-500'>
              Client-side fetching with React Query
            </p>
          </div>

          {/* Students Display */}
          {data.data.length === 0 ? (
            <div className='rounded-lg border border-gray-200 bg-white py-12 text-center'>
              <p className='text-lg text-gray-500'>No students found</p>
              <p className='mt-2 text-sm text-gray-400'>
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <ServerStudentTable students={data.data} />
          )}

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <StudentPagination
              pagination={data.pagination}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          )}
        </>
      )}
    </div>
  );
}
