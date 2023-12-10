export interface Compartment {
  id: string;
  type: string;
  amount: number;
}

export interface Station {
  stationId: string;
  name: string;
  address: string;
  companyName: string;
  companyAddress: string;
  compartments?: Compartment[];
}

export interface Discharge {
  date: string;
  amount: string;
  amountTotal: string;
  status: string;
}

export interface FuelData {
  stations: Station[];
  discharges: Discharge[];
}
