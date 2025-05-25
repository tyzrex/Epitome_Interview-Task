'use client';

import type { Student } from '@/modules/students/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Mail, Eye } from 'lucide-react';
import { useState, useTransition } from 'react';
import { STATUS_COLORS } from '@/modules/students/constants';
import { formatDate, getInitials } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useMediaQuery } from '@/hooks/use-media-query';
import StudentCard from '@/modules/students/components/student-card';
import { StatusUpdateDialog } from '@/modules/students/components/status-update-dialog';

interface ServerStudentTableProps {
  students: Student[];
  revalidateData?: () => Promise<void>;
}

export function ServerStudentTable({
  students,
  revalidateData,
}: ServerStudentTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(students.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const handleRefresh = () => {
    startTransition(async () => {
      if (!revalidateData) return;
      await revalidateData();
    });
  };

  if (isMobile) {
    return (
      <div className='block md:hidden'>
        <ScrollArea className='h-[600px]'>
          <div className='space-y-3'>
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                selectedIds={selectedIds}
                handleSelectOne={handleSelectOne}
                handleRefresh={handleRefresh}
                isPending={isPending}
              />
            ))}
            {students.length === 0 && (
              <div className='text-center text-gray-500'>
                No students found matching the criteria.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <>
      <div className='overflow-y-scroll rounded-lg border border-gray-200 bg-white'>
        {/* <ScrollArea className='xl:w-full 2xl:h-[450px]'>
          <ScrollBar orientation='horizontal' /> */}
        <Table>
          <TableHeader>
            <TableRow className='bg-gray-50'>
              <TableHead className='w-12'>
                <Checkbox
                  checked={
                    selectedIds.length === students.length &&
                    students.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>REGISTERED</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>PROGRAM</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className='w-12'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id} className='hover:bg-gray-50'>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(student.id)}
                      onCheckedChange={(checked) =>
                        handleSelectOne(student.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className='text-sm text-gray-600'>
                      <div>{formatDate(student.applicationDate)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-medium text-white'>
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <div className='font-medium text-gray-900'>
                          {student.name}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div
                      className='max-w-xs text-sm text-gray-600'
                      title={student.program}
                    >
                      {student.program}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={`${STATUS_COLORS[student.status]}`}
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setSelectedStudent(student)}
                      className='h-8 w-8 p-0'
                    >
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='text-center text-gray-500'>
                  No students found matching the criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* </ScrollArea> */}
      </div>

      {selectedIds.length > 0 && (
        <div className='fixed bottom-6 left-1/2 -translate-x-1/2 transform rounded-lg border border-gray-200 bg-white p-4 shadow-lg'>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-gray-600'>
              {selectedIds.length} items selected
            </span>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='border-teal-300 text-teal-700 hover:bg-teal-50'
              >
                Verify
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='border-red-300 text-red-700 hover:bg-red-50'
              >
                Reject
              </Button>
              <Button variant='destructive' size='sm'>
                Deactivate
              </Button>
            </div>
          </div>
        </div>
      )}

      <StatusUpdateDialog
        student={selectedStudent}
        open={!!selectedStudent}
        onOpenChange={(open) => !open && setSelectedStudent(null)}
      />
    </>
  );
}
