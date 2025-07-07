export type CursusDTO = {
    id: string;
    name: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateCursusDto = {
    name: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
};

export type UpdateCursusDto = {
    id: string;
    name: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
};

export enum CursusLevel {
    Beginner = 'beginner',
    Intermediate = 'intermediate',
    Advanced = 'advanced'
}

export type CursusLevelDropDown = {
    id: string;
    name: string;
    value: CursusLevel;
};

export type CursusCategoryDropDown = {
    id: string;
    name: string;
    value: string;
};
