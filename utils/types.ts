import { NativeStackScreenProps } from '@react-navigation/native-stack';

export interface ReportData {
  reportId: string;
  date: Date;
  report: MergeData[];
}

export interface ViewReportData {
  reportId: string;
  date: Date;
  stationName: string;
  stationLocation: string;
  companyName: string;
  companyLocation: string;
  report: MergeData[];
  totalDeliverdVolume: number;
}

export interface ResultItem {
  reportId: string;
  date: Date;
  totalTankVolume: number;
  totalAddedCompartmentVolumne: number;
  status: string;
  totalCurrentTankVolume: number;
}

export interface CompartmentData {
  id: number;
  compartmentId: string;
  fuelType: string;
  volume: string;
}

export interface MergeData {
  id: number | string;
  tankId: string;
  tankFuelType: string;
  tankVolume: string;
  tankMaxVolume: string;
  compartmentId: string;
  compartmentFuelType: string;
  compartmentVolume: string;
  mergedVolume: string;
}

export interface DropdownList {
  label: string;
  value: string;
}

export interface TankData {
  id: number;
  tankId: string;
  fuelType: string;
  volume: string;
  maxVolume: string;
}

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
  OneTimeSetup: {
    fromScreen: boolean;
  };
  Home: undefined;
  CompartmentInfo: undefined;
  TankInfo: undefined;
  CompartmentTankVerify: undefined;
  DischargeReport: {};
  ViewReport: {
    reportId: string;
    reportData: {
      totalDelivered: number;
    };
  };
};

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;
