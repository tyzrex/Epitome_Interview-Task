'use server';

import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';

export async function revalidateAfterUpdate(tag: string) {
  revalidateTag(tag);
}

export async function revalidateAfterPathUpdate(path: string) {
  revalidatePath(path);
}
