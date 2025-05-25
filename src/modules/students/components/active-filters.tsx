import { Badge } from '@/components/ui/badge';

export default function ActiveFilters(
  filters: Readonly<{
    status: string;
    program: string;
    search: string;
  }>,
) {
  return (
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

      {filters.status === 'All' &&
        filters.program === 'All' &&
        filters.search === '' && (
          <Badge
            variant='secondary'
            className='border-gray-200 bg-gray-50 text-gray-700'
          >
            No filters applied
          </Badge>
        )}
    </div>
  );
}
