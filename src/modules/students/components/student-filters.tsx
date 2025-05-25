'use client';

import type { StudentFilters } from '@/modules/students';
import { STUDENT_STATUSES, PROGRAMS } from '@/modules/students';
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

interface StudentFiltersProps {
  filters: StudentFilters;
  onFiltersChange: (filters: Partial<StudentFilters>) => void;
}

export function StudentFiltersComponent({
  filters,
  onFiltersChange,
}: StudentFiltersProps) {
  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'All',
      program: 'All',
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'All' ||
    filters.program !== 'All';

  return (
    <div className='flex w-full flex-col gap-4 sm:flex-row lg:w-auto'>
      {/* Search Input */}
      <div className='relative'>
        <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
        <Input
          placeholder='Search by name, email, or program...'
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className='w-full pl-10 sm:w-80'
        />
      </div>

      {/* Status Filter */}
      <Select
        value={filters.status}
        onValueChange={(value) => onFiltersChange({ status: value as any })}
      >
        <SelectTrigger className='w-full sm:w-48'>
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
        onValueChange={(value) => onFiltersChange({ program: value })}
      >
        <SelectTrigger className='w-full sm:w-48'>
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
          className='flex items-center gap-2'
        >
          <X className='h-4 w-4' />
          Clear
        </Button>
      )}
    </div>
  );
}
