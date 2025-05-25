import React from 'react';
import { SelectSeparator } from '@/components/ui/select';

export default function TableLoaderPage() {
  return (
    <div className='space-y-6'>
      <div className=''>
        <div className='bg-muted h-8 max-w-[300px] animate-pulse rounded-md'></div>
        <div className='bg-muted mt-5 h-6 max-w-[600px] animate-pulse rounded-md'></div>
      </div>

      <div className='my-5'>
        <SelectSeparator />
      </div>

      <TableLoader />
    </div>
  );
}

export function TableLoader() {
  return (
    <div className='mx-auto w-full'>
      <div className='overflow-hidden border sm:rounded-lg'>
        <table className='min-w-full divide-y'>
          <thead>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'
              >
                <div className='bg-muted h-4 w-[50px] animate-pulse rounded-md'></div>
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'
              >
                <div className='bg-muted h-4 w-[150px] animate-pulse rounded-md'></div>
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'
              >
                <div className='bg-muted h-4 w-[150px] animate-pulse rounded-md'></div>
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'
              >
                <div className='bg-muted h-4 w-[150px] animate-pulse rounded-md'></div>
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'
              >
                <div className='bg-muted h-4 w-[150px] animate-pulse rounded-md'></div>
              </th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {Array.from({ length: 8 }, (_, idx) => (
              <tr className='hover:bg-muted/50 cursor-pointer' key={idx}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='bg-muted h-4 w-[50px] animate-pulse rounded-md'></div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='bg-muted h-4 w-[200px] animate-pulse rounded-md'></div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='bg-muted h-4 w-[250px] animate-pulse rounded-md'></div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='bg-muted h-4 w-[100px] animate-pulse rounded-md'></div>
                </td>
                <td className='px-6 py-4 text-sm whitespace-nowrap'>
                  <div className='bg-muted h-4 w-[100px] animate-pulse rounded-md'></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
