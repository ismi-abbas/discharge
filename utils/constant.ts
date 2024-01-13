import { MergeData } from './types';

export const tankDefaultData = [
  {
    id: 1,
    tankId: 'T1',
    fuelType: '',
    volume: '0',
    maxVolume: '0',
  },
  {
    id: 2,
    tankId: 'T2',
    fuelType: '',
    volume: '0',
    maxVolume: '0',
  },
  {
    id: 3,
    tankId: 'T3',
    fuelType: '',
    volume: '0',
    maxVolume: '0',
  },
  {
    id: 4,
    tankId: 'T4',
    fuelType: '',
    volume: '0',
    maxVolume: '0',
  },
  {
    id: 5,
    tankId: 'T5',
    fuelType: '',
    volume: '0',
    maxVolume: '0',
  },
];

export const compartmentDefaultData = [
  {
    id: 1,
    compartmentId: 'C1',
    fuelType: '',
    volume: '0',
  },
  {
    id: 2,
    compartmentId: 'C2',
    fuelType: '',
    volume: '0',
  },
  {
    id: 3,
    compartmentId: 'C3',
    fuelType: '',
    volume: '0',
  },
  {
    id: 4,
    compartmentId: 'C4',
    fuelType: '',
    volume: '0',
  },
  {
    id: 5,
    compartmentId: 'C5',
    fuelType: '',
    volume: '0',
  },
];

export const compartmentToTank: MergeData[] = [
  {
    id: 1,
    compartmentId: '',
    compartmentFuelType: '',
    compartmentVolume: '',
    tankId: '',
    tankVolume: '',
    tankFuelType: '',
    mergedVolume: '',
    tankMaxVolume: '',
    compartmentList: [],
  },
  {
    id: 2,
    compartmentId: '',
    compartmentFuelType: '',
    compartmentVolume: '',
    tankId: '',
    tankVolume: '',
    tankFuelType: '',
    mergedVolume: '',
    tankMaxVolume: '',
    compartmentList: [],
  },
  {
    id: 3,
    compartmentId: '',
    compartmentFuelType: '',
    compartmentVolume: '',
    tankId: '',
    tankVolume: '',
    tankFuelType: '',
    mergedVolume: '',
    tankMaxVolume: '',
    compartmentList: [],
  },
  {
    id: 4,
    compartmentId: '',
    compartmentFuelType: '',
    compartmentVolume: '',
    tankId: '',
    tankVolume: '',
    tankFuelType: '',
    mergedVolume: '',
    tankMaxVolume: '',
    compartmentList: [],
  },
  {
    id: 5,
    compartmentId: '',
    compartmentFuelType: '',
    compartmentVolume: '',
    tankId: '',
    tankVolume: '',
    tankFuelType: '',
    mergedVolume: '',
    tankMaxVolume: '',
    compartmentList: [],
  },
];

export const petrolType = [
  {
    label: 'U95',
    value: 'U95',
  },
  {
    label: 'V97',
    value: 'V97',
  },
  {
    label: 'E7',
    value: 'E7',
  },
  {
    label: 'EUROB7',
    value: 'EUROB7',
  },
  {
    label: 'AGO',
    value: 'AGO',
  },
];

export const APP_TEXT = {
  PRE_SETUP_TEXT: 'Please key in company details, station tank max capacity, number and product type.',
  PRE_SETUP_TABLE_HELPER: 'Scroll to the right for more info. 3rd row is the max volume for tank.',
  TANK_INFO_TEXT: 'Please key in your latest tank dipping (T).',
  COMPARTMENT_INFO_TEXT: 'Please key in the Tanker compartment details, Compartment (C).',
  COMPARTMENT_TANK_VERIFY_TEXT: 'Station Tank (T) to Tanker Compartment (C) fuel match.',
};
