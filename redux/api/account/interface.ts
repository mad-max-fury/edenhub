export interface IAddress {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  phone: string;
  additionalPhone?: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  addressCode?: string;
  isDefault: boolean;
}

export interface IAddressPayload {
  firstName: string;
  lastName: string;
  fullName?: string;
  phone: string;
  additionalPhone?: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  country?: string;
  postalCode?: string;
  addressCode?: string;
  isDefault?: boolean;
}
