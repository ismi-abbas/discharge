import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type ReportData = {
  reportId: string;
  date: Date;
  report: MergeData[];
};

export interface ResultItem {
  reportId: string;
  date: Date;
  totalTankVolume: number;
  totalCompartmentVolume: number;
  status: string;
}

export type CompartmentData = {
  id: number;
  compartmentId: string;
  fuelType: string;
  volume: string;
};

export type MergeData = {
  id: number | string;
  tankId: string;
  tankFuelType: string;
  tankVolume: string;
  tankMaxVolume: string;
  compartmentId: string;
  compartmenFuelType: string;
  compartmentVolume: string;
  mergedVolume: string;
};

export type DropdownList = {
  label: string;
  value: string;
};

export type TankData = {
  id: number;
  tankId: string;
  fuelType: string;
  volume: string;
  maxVolume: string;
};

export interface InitialSetupInfo {
  done: boolean;
  data: TankData[];
}

export interface StationInfo {
  stationId: string;
  name: string;
  address: string;
  companyName: string;
  companyAddress: string;
}

export type AppStackParamList = {
  OneTimeSetup: undefined;
  Home: undefined;
  CompartmentInfo: undefined;
  TankInfo: undefined;
  CompartmentTankVerify: undefined;
  DischargeReport: {};
  ViewReport: {};
};

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;
