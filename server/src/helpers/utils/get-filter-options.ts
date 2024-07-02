import { FilterOption } from "@/types";
import { Repository } from "typeorm";

export async function getFilterOptions<T, K extends keyof T>(
    repository: Repository<T>,
    field: K
): Promise<FilterOption<T[K]>[]> {
    const fieldName = String(field);

    return repository
        .createQueryBuilder('entity')
        .select(`entity.${fieldName}`, 'label')
        .addSelect('COUNT(*)', 'count')
        .groupBy(`entity.${fieldName}`)
        .getRawMany();
}