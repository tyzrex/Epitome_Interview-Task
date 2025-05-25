'use client';

import type React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { STUDENT_STATUSES, PROGRAMS } from '@/modules/students/constants';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useState, useTransition } from 'react';
import { buildSearchParams } from '@/lib/utils';

interface ServerStudentFiltersProps {
  filters: {
    search: string;
    status: string;
    program: string;
    page: number;
    limit: number;
  };
}

export function ServerStudentFilters({ filters }: ServerStudentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(filters.search);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    const queryString = buildSearchParams(updatedFilters);

    startTransition(() => {
      router.push(`/dashboard/server?${queryString}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchValue });
  };

  const handleClearFilters = () => {
    setSearchValue('');
    startTransition(() => {
      router.push('/dashboard/server');
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'All' ||
    filters.program !== 'All';

  return (
    <div className='flex w-full flex-col flex-wrap gap-4 sm:flex-row lg:w-auto'>
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className='relative'>
        <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
        <Input
          placeholder='Search by name, email, or program...'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className='w-full pl-10 md:w-80'
          disabled={isPending}
        />
      </form>

      {/* Status Filter */}
      <Select
        value={filters.status}
        onValueChange={(value) => updateFilters({ status: value })}
        disabled={isPending}
      >
        <SelectTrigger className='w-full md:w-48'>
          <SelectValue placeholder='Filter by status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='All'>All Statuses</SelectItem>
          {STUDENT_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Program Filter */}
      <Select
        value={filters.program}
        onValueChange={(value) => updateFilters({ program: value })}
        disabled={isPending}
      >
        <SelectTrigger className='w-full md:w-48'>
          <SelectValue placeholder='Filter by program' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='All'>All Programs</SelectItem>
          {PROGRAMS.map((program) => (
            <SelectItem key={program} value={program}>
              {program}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant='outline'
          onClick={handleClearFilters}
          disabled={isPending}
          className='flex items-center gap-2'
        >
          <X className='h-4 w-4' />
          Clear
        </Button>
      )}
    </div>
  );
}
