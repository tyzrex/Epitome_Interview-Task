'use client';
import { useState, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import {
  STATUS_COLORS,
  type Student,
  type StudentFilters,
  type ViewMode,
} from '@/modules/students';
import { useStudents } from '@/modules/students/hooks/use-student';
import { useDebounce } from '@/hooks/use-debounce';
import { StudentFiltersComponent } from '@/modules/students/components/student-filters';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Download, Share, Zap, Mail, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate, getInitials } from '@/lib/utils';
import ActiveFilters from '@/modules/students/components/active-filters';

interface VirtualStudentRowProps {
  student: Student;
  index: number;
}

function VirtualStudentRow({ student, index }: VirtualStudentRowProps) {
  return (
    <div className='border-b border-gray-200 bg-white hover:bg-gray-50'>
      {/* Mobile Card View for Table Mode */}
      <div className='block p-4 md:hidden'>
        <div className='space-y-3'>
          <div className='flex items-start justify-between'>
            <div className='flex min-w-0 flex-1 items-center gap-3'>
              <Checkbox />
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-medium text-white'>
                {getInitials(student.name)}
              </div>
              <div className='min-w-0 flex-1'>
                <h3 className='truncate font-medium text-gray-900'>
                  {student.name}
                </h3>
                <p className='truncate text-sm text-gray-500'>#{student.id}</p>
              </div>
            </div>
            <Badge
              variant='outline'
              className={`${STATUS_COLORS[student.status]} text-xs`}
            >
              {student.status}
            </Badge>
          </div>
          <div className='space-y-2 text-sm text-gray-600'>
            <div className='flex items-center gap-2'>
              <Mail className='h-4 w-4 flex-shrink-0' />
              <span className='truncate'>{student.email}</span>
            </div>
            <div>
              <span className='font-medium'>Program:</span> {student.program}
            </div>
            <div>
              <span className='font-medium'>Applied:</span>{' '}
              {formatDate(student.applicationDate)}
            </div>
            {student.notes && (
              <div>
                <span className='font-medium'>Notes:</span> {student.notes}
              </div>
            )}
          </div>
          <div className='flex gap-2 pt-2'>
            <Button
              variant='outline'
              size='sm'
              className='flex-1 border-teal-300 text-teal-700 hover:bg-teal-50'
            >
              <Eye className='mr-2 h-4 w-4' />
              View
            </Button>
            <Button variant='outline' size='sm' className='flex-1'>
              Update
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Table Row */}
      <div className='hidden min-w-0 items-center gap-4 px-4 py-3 md:grid md:grid-cols-8'>
        <div className='flex items-center'>
          <Checkbox />
        </div>
        <div className='min-w-0 text-sm text-gray-600'>
          <div className='truncate'>{formatDate(student.applicationDate)}</div>
          <div className='truncate text-xs text-gray-400'>
            {new Date(student.applicationDate).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
        <div className='flex min-w-0 items-center gap-2'>
          <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-medium text-white'>
            {getInitials(student.name)}
          </div>
          <div className='min-w-0'>
            <div className='truncate text-sm font-medium text-gray-900'>
              {student.name}
            </div>
            <div className='truncate text-xs text-gray-500'>#{student.id}</div>
          </div>
        </div>
        <div className='truncate text-sm text-gray-600'>{student.email}</div>
        <div className='truncate text-sm text-gray-600' title={student.program}>
          {student.program}
        </div>
        <div>
          <Badge
            variant='outline'
            className={`${STATUS_COLORS[student.status]} text-xs`}
          >
            {student.status}
          </Badge>
        </div>
        <div className='flex justify-end'>
          <Button
            variant='outline'
            size='sm'
            className='border-teal-300 text-xs text-teal-700 hover:bg-teal-50'
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function VirtualStudentDashboard() {
  const [filters, setFilters] = useState<StudentFilters>({
    search: '',
    status: 'All',
    program: 'All',
  });

  // For virtualization, we'll fetch all data and filter client-side
  const debouncedFilters = useDebounce(filters, 300);
  const { data, isLoading, error, isError } = useStudents({
    page: 1,
    limit: 100000, // Fetch large dataset
    filters: debouncedFilters,
  });

  const filteredStudents = useMemo(() => {
    if (!data?.data) return [];
    return data.data;
  }, [data?.data]);

  const handleFiltersChange = (newFilters: Partial<StudentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

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
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='flex items-center gap-2 text-2xl font-semibold text-gray-900'>
            <Zap className='h-6 w-6 text-teal-600' />
            Virtual Table Demo
          </h1>
          <p className='mt-1 text-gray-600'>
            React Virtuoso implementation for handling large datasets
            efficiently
          </p>
        </div>
      </div>

      {/* Performance Info */}
      <Alert className='border-teal-200 bg-teal-50'>
        <Zap className='h-4 w-4 text-teal-600' />
        <AlertDescription className='text-teal-800'>
          <strong>React Virtuoso Benefits:</strong>
          <ul className='mt-2 ml-4 list-disc text-sm'>
            <li>Automatic item sizing and dynamic heights</li>
            <li>Smooth scrolling with momentum and inertia</li>
            <li>Built-in loading states and infinite scroll support</li>
            <li>Better accessibility and keyboard navigation</li>
            <li>Handles 100,000+ records without performance issues</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Filters and View Toggle */}
      <div className='flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center'>
        <div className='w-full lg:w-auto'>
          <StudentFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters
        program={filters.program}
        status={filters.status}
        search={filters.search}
      />

      {/* Loading State */}
      {isLoading && (
        <div className='flex justify-center py-12'>
          <LoadingSpinner size='lg' />
        </div>
      )}

      {/* Virtuoso List */}
      {data && (
        <>
          {/* Results Summary */}
          <div className='flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
            <p className='text-sm text-gray-600'>
              Showing {filteredStudents.length} students (React Virtuoso -
              dynamic sizing)
            </p>
            <p className='text-xs text-gray-500'>
              Advanced virtualization with automatic sizing
            </p>
          </div>

          {/* Virtuoso Container */}
          {filteredStudents.length === 0 ? (
            <div className='rounded-lg border border-gray-200 bg-white py-12 text-center'>
              <p className='text-lg text-gray-500'>No students found</p>
              <p className='mt-2 text-sm text-gray-400'>
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <div className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
              {/* Table Header for Desktop */}
              <div className='sticky top-0 z-10 hidden border-b border-gray-200 bg-gray-50 md:block'>
                <div className='grid grid-cols-8 gap-4 px-4 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase'>
                  <div>SELECT</div>
                  <div>REGISTERED</div>
                  <div>NAME</div>
                  <div>EMAIL</div>
                  <div>PROGRAM</div>
                  <div>STATUS</div>
                  <div>ACTIONS</div>
                </div>
              </div>
              <Virtuoso
                style={{ height: '600px' }}
                data={filteredStudents}
                itemContent={(index, student) => (
                  <VirtualStudentRow student={student} index={index} />
                )}
                components={{
                  Footer: () => (
                    <div className='border-t border-gray-200 p-4 text-center text-sm text-gray-500'>
                      End of list - {filteredStudents.length} students loaded
                    </div>
                  ),
                }}
                className='custom-scrollbar'
              />
            </div>
          )}

          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <Card>
              <CardContent className='p-4 text-center'>
                <div className='text-2xl font-bold text-teal-600'>
                  {filteredStudents.length.toLocaleString()}
                </div>
                <div className='text-sm text-gray-600'>Total Records</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4 text-center'>
                <div className='text-2xl font-bold text-teal-600'>Dynamic</div>
                <div className='text-sm text-gray-600'>Item Heights</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4 text-center'>
                <div className='text-2xl font-bold text-teal-600'>~98%</div>
                <div className='text-sm text-gray-600'>Memory Saved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4 text-center'>
                <div className='text-2xl font-bold text-teal-600'>Smooth</div>
                <div className='text-sm text-gray-600'>Scrolling</div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
