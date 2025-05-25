'use client';

import { useRouter } from 'next/navigation';
import type { PaginationInfo } from '@/lib/types';
import { PAGINATION_LIMITS } from '@/modules/students/constants';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useTransition } from 'react';
import { buildSearchParams } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ServerStudentPaginationProps {
  pagination: PaginationInfo;
  filters: {
    search: string;
    status: string;
    program: string;
    page: number;
    limit: number;
  };
}

export function ServerStudentPagination({
  pagination,
  filters,
}: ServerStudentPaginationProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { page, limit, total, totalPages } = pagination;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  const navigateToPage = (newPage: number) => {
    const queryString = buildSearchParams({
      ...filters,
      page: newPage,
    });
    startTransition(() => {
      router.push(`/dashboard/server?${queryString}`);
    });
  };

  const changeLimit = (newLimit: number) => {
    const queryString = buildSearchParams({
      ...filters,
      limit: newLimit,
      page: 1,
    });
    startTransition(() => {
      router.push(`/dashboard/server?${queryString}`);
    });
  };

  const isMobile = useMediaQuery('(max-width: 640px)');

  if (isMobile) {
    return (
      <div className='flex items-center justify-center gap-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => navigateToPage(page - 1)}
          disabled={!canGoPrevious || isPending}
          className='border-teal-300 text-teal-700 hover:bg-teal-50'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <span className='text-sm text-gray-600'>
          Page {page} of {totalPages}
        </span>
        <Button
          variant='outline'
          size='sm'
          onClick={() => navigateToPage(page + 1)}
          disabled={!canGoNext || isPending}
          className='border-teal-300 text-teal-700 hover:bg-teal-50'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-between gap-4 py-4 sm:flex-row'>
      <div className='flex items-center gap-4'>
        <div className='text-sm text-gray-600'>
          Showing {startItem} to {endItem} of {total} results
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-600'>Show:</span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => changeLimit(Number.parseInt(value))}
            disabled={isPending}
          >
            <SelectTrigger className='w-20'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGINATION_LIMITS.map((limitOption) => (
                <SelectItem key={limitOption} value={limitOption.toString()}>
                  {limitOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => navigateToPage(1)}
          disabled={!canGoPrevious || isPending}
          className='border-teal-300 text-teal-700 hover:bg-teal-50'
        >
          <ChevronsLeft className='h-4 w-4' />
        </Button>

        <Button
          variant='outline'
          size='sm'
          onClick={() => navigateToPage(page - 1)}
          disabled={!canGoPrevious || isPending}
          className='border-teal-300 text-teal-700 hover:bg-teal-50'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>

        <div className='flex items-center gap-1'>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (page <= 3) {
              pageNumber = i + 1;
            } else if (page >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = page - 2 + i;
            }

            return (
              <Button
                key={pageNumber}
                variant={pageNumber === page ? 'default' : 'outline'}
                size='sm'
                onClick={() => navigateToPage(pageNumber)}
                disabled={isPending}
                className={
                  pageNumber === page
                    ? 'h-8 w-8 bg-teal-600 p-0 hover:bg-teal-700'
                    : 'h-8 w-8 border-teal-300 p-0 text-teal-700 hover:bg-teal-50'
                }
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        <Button
          variant='outline'
          size='sm'
          onClick={() => navigateToPage(page + 1)}
          disabled={!canGoNext || isPending}
          className='border-teal-300 text-teal-700 hover:bg-teal-50'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>

        <Button
          variant='outline'
          size='sm'
          onClick={() => navigateToPage(totalPages)}
          disabled={!canGoNext || isPending}
          className='border-teal-300 text-teal-700 hover:bg-teal-50'
        >
          <ChevronsRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
