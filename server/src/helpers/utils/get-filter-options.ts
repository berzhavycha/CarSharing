import { Repository } from 'typeorm';

import { FilterOption } from '@/types';

export async function getFilterOptions<T, K extends keyof T>(
  repository: Repository<T>,
  field: K,
): Promise<FilterOption<T[K]>[]> {
  const fieldName = String(field);

  return repository
    .createQueryBuilder('entity')
    .select(`entity.${fieldName}`, 'label')
    .addSelect('COUNT(*)', 'count')
    .groupBy(`entity.${fieldName}`)
    .getRawMany();
}
