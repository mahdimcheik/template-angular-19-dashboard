export type FormationCreateDTO = {
    title: string;
    company: string;
    startAt: Date;
    endAt: Date;
    city: string;
    country: string;
};

export type FormationResponseDTO = {
    id: string;
    title: string;
    company: string;
    startAt: Date;
    endAt: Date;
    city: string;
    country: string;
    userId: string;
};

export type FormationUpdateDTO = {
    id: string;
    title: string;
    company: string;
    startAt: Date;
    endAt: Date;
    city: string;
    country: string;
};
