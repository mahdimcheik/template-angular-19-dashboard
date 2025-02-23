export type AdresseDTO = {
  id: string;
  streetNumber: number;
  street: string;
  streetLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  addressType: number;
};
export enum AddressTypeEnum {
  Domicile = 1,
  Travail = 2,
  Facturation = 3,
  Livraison = 4,
}

export type AddressDropDown = {
  id: string;
  name: string;
  value: number;
};
