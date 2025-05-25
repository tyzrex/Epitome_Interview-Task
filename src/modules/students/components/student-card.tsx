import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate, getInitials } from '@/lib/utils';
import { STATUS_COLORS } from '@/modules/students/constants';
import { Student } from '@/modules/students/types';
import { Eye, Mail } from 'lucide-react';

export default function StudentCard({
  student,
  selectedIds,
  handleSelectOne,
  handleRefresh,
  isPending,
}: {
  student: Student;
  selectedIds: string[];
  handleSelectOne: (id: string, checked: boolean) => void;
  handleRefresh: () => void;
  isPending: boolean;
}) {
  return (
    <div
      key={student.id}
      className='w-full space-y-3 rounded-lg border border-gray-200 p-4'
    >
      <div className='flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-0'>
        <div className='flex min-w-0 flex-1 items-center gap-3'>
          <Checkbox
            checked={selectedIds.includes(student.id)}
            onCheckedChange={(checked) =>
              handleSelectOne(student.id, checked as boolean)
            }
          />
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-medium text-white'>
            {getInitials(student.name)}
          </div>
          <div className='min-w-0 flex-1'>
            <h3 className='break-after-all font-medium text-gray-900'>
              {student.name}
            </h3>
            <p className='break-after-all text-sm text-gray-500 sm:block'>
              {student.email}
            </p>
          </div>
        </div>
        <Badge
          variant='outline'
          className={`${STATUS_COLORS[student.status]} text-xs`}
        >
          {student.status}
        </Badge>
      </div>

      <div className='space-y-2 text-sm'>
        <div className='flex items-center gap-2 text-gray-600'>
          <Mail className='h-4 w-4 flex-shrink-0' />
          <span>{student.email}</span>
        </div>
        <div className='text-gray-600'>
          <span className='font-medium'>Program:</span> {student.program}
        </div>
        <div className='text-gray-600'>
          <span className='font-medium'>Applied:</span>{' '}
          {formatDate(student.applicationDate)}
        </div>
        {student.notes && (
          <div className='text-gray-600'>
            <span className='font-medium'>Notes:</span> {student.notes}
          </div>
        )}
      </div>

      <div className='flex flex-col gap-2 pt-2 sm:flex-row'>
        <Button
          variant='outline'
          size='sm'
          className='flex-1 border-teal-300 py-2 text-teal-700 hover:bg-teal-50'
        >
          <Eye className='mr-2 h-4 w-4' />
          View
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={handleRefresh}
          disabled={isPending}
          className='flex-1 py-2'
        >
          {isPending ? 'Updating...' : 'Update'}
        </Button>
      </div>
    </div>
  );
}
