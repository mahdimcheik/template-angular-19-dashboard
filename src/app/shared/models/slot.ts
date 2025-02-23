export type SlotResponseDTO = {
  id: string;
  startAt: Date;
  endAt: Date;
  createAt: Date;
  createById: string;
  price: number;
  reduction: number;
  discountedPrice: number;
  type: number;
  studentId?: string;
  studentFirstName?: string;
  studentLastName?: string;
  studentImgUrl?: string;
  typeHelp?: number;
  subject?: string;
  description?: string;
};

export type SlotCreateDTO = {
  startAt: Date;
  endAt: Date;
  createdAt: Date;
  price: number;
  reduction: number;
  type: number;
};

export type SlotUpdateDTO = {
  id: string;
  startAt: Date;
  endAt: Date;
  createdAt: Date;
  price: number;
  reduction: number;
  type: number;
};

export enum EnumTypeHelp {
  other = 0,
  homework = 1,
  exams = 2,
}

export type BookingCreateDTO = {
  slotId: string;
  subject: string;
  description: string;
  typeHelp: number;
};
