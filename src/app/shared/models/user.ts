export type User = {};

export type UserCreateDTO = {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    title?: string;
    dateOfBirth: Date;
    description?: string;
    gender?: EnumGender;
    phoneNumber: string;
};

export type UserUpdateDTO = {
    email: string;
    firstName: string;
    lastName: string;
    title?: string;
    dateOfBirth: Date;
    description?: string;
    gender: EnumGender;
};

export type UserChangePasswordDTO = {
    userId: string;
    resetToken: string;
    password?: string;
    passwordConfirmation?: string;
};

export enum EnumGender {
    Homme = 0,
    Femme = 1,
    NonBinaire = 2,
    Autre = 3
}

export type GenderDropDown = {
    id: string;
    name: string;
    value: number;
};

export type UserResponseDTO = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    imgUrl: string;
    dateOfBirth: Date;
    lastLogginAt: Date;
    gender: EnumGender;
    emailConfirmed: boolean;
    title?: string;
    description?: string;
    roles: string[];
};

export type UserLoginDTO = {
    email: string;
    password: string;
};

export type ResponseDTO = {
    message: string;
    status: number;
    data?: any;
    count?: number;
};
