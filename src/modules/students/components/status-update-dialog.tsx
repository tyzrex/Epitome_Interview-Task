'use client';

import { useState } from 'react';
import type { Student, StudentStatus } from '@/modules/students/';
import { STUDENT_STATUSES } from '@/modules/students';
import { useUpdateStudent } from '@/modules/students/hooks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface StatusUpdateDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StatusUpdateDialog({
  student,
  open,
  onOpenChange,
}: StatusUpdateDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<StudentStatus | ''>('');

  const updateMutation = useUpdateStudent();

  const handleSubmit = async () => {
    if (!student || !selectedStatus) return;

    try {
      await updateMutation.mutateAsync({
        id: student.id,
        status: selectedStatus,
      });

      toast.success('Student status updated successfully', {
        description: `Status changed to ${selectedStatus}`,
      });

      onOpenChange(false);
      setSelectedStatus('');
    } catch (error) {
      toast.error('Failed to update student status', {
        description: 'Please try again later.',
      });
    }
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Update Student Status</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <h4 className='font-medium'>{student.name}</h4>
            <p className='text-sm text-gray-600'>{student.email}</p>
            <p className='text-sm text-gray-600'>
              Current Status: {student.status}
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='status'>New Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as StudentStatus | '')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select new status' />
              </SelectTrigger>
              <SelectContent>
                {STUDENT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedStatus || updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
