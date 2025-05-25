'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap } from 'lucide-react';

interface VirtualizationWarningProps {
  totalRecords: number;
  currentPageSize: number;
  onOptimize: () => void;
}

export function VirtualizationWarning({
  totalRecords,
  currentPageSize,
  onOptimize,
}: VirtualizationWarningProps) {
  return (
    <Alert className='border-amber-200 bg-amber-50'>
      <AlertTriangle className='h-4 w-4 text-amber-600' />
      <AlertDescription className='flex items-center justify-between'>
        <div className='text-amber-800'>
          <strong>Performance Notice:</strong> You have{' '}
          {totalRecords.toLocaleString()} records. For optimal performance with
          large datasets, consider:
          <ul className='mt-2 ml-4 list-disc text-sm'>
            <li>Using smaller page sizes (recommended: 50 items)</li>
            <li>Implementing virtual scrolling for table views</li>
            <li>Adding more specific filters to reduce data load</li>
            <li>Consider server-side pagination with search</li>
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
}
