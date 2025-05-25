import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
};

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const buildPageParam = (
  currentPage: number | null | undefined,
): string => (currentPage ? `?page=${currentPage}` : '');
export const buildQueryParams = (params: Record<string, any>): string => {
  const queryParams = Object.entries(params)
    .filter(([, value]) => value != null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );

  if (queryParams.length === 0) {
    return '';
  }

  return `?${queryParams.join('&')}`;
};

export function parseSearchParams(searchParams: URLSearchParams) {
  return {
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 20,
    search: searchParams.get('search') || '',
    status: (searchParams.get('status') as any) || 'All',
    program: searchParams.get('program') || 'All',
  };
}

export function buildSearchParams(
  params: Record<string, string | number | undefined>,
) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== 'All') {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
}
