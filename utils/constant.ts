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
// truck limit 100000 per Compartment
