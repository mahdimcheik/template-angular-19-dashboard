/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Category } from './Category';
import type { Level } from './Level';
export type CursusDto = {
    id?: string;
    name?: string | null;
    description?: string | null;
    levelId?: string;
    level?: Level;
    categoryId?: string;
    category?: Category;
    createdAt?: string;
    updatedAt?: string | null;
};

