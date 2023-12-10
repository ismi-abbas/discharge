import { MergeData } from "../components/CompartmentVSTankTable";

export const tankData = [
  {
    id: 1,
    tankId: "T1",
    fuelType: "",
    volume: "0",
    maxVolume: "0"
  },
  {
    id: 2,
    tankId: "T2",
    fuelType: "",
    volume: "0",
    maxVolume: "0"
  },
  {
    id: 3,
    tankId: "T3",
    fuelType: "",
    volume: "0",
    maxVolume: "0"
  },
  {
    id: 4,
    tankId: "T4",
    fuelType: "",
    volume: "0",
    maxVolume: "0"
  },
  {
    id: 5,
    tankId: "T5",
    fuelType: "",
    volume: "0",
    maxVolume: "0"
  },
  {
    id: 6,
    tankId: "T6",
    fuelType: "",
    volume: "0",
    maxVolume: "0"
  },
  {
    id: 7,
    tankId: "T7",
    fuelType: "",
    volume: "0",
    maxVolume: "0"
  }
];

export const compartmentData = [
  {
    id: 1,
    compartmentId: "C1",
    fuelType: "U95",
    volume: "15000"
  },
  {
    id: 2,
    compartmentId: "C2",
    fuelType: "V97",
    volume: "14000"
  },
  {
    id: 3,
    compartmentId: "C3",
    fuelType: "E7",
    volume: "17000"
  },
  {
    id: 4,
    compartmentId: "C4",
    fuelType: "EUROB7",
    volume: "30000"
  },
  {
    id: 5,
    compartmentId: "C5",
    fuelType: "AGO",
    volume: "25000"
  }
];

export const compartmentToTank: MergeData[] = [
  {
    id: 1,
    compartmentId: "",
    compartmenFuelType: "",
    compartmentVolume: "",
    tankId: "",
    tankVolume: "",
    tankFuelType: "",
    mergedVolume: ""
  },
  {
    id: 2,
    compartmentId: "",
    compartmenFuelType: "",
    compartmentVolume: "",
    tankId: "",
    tankVolume: "",
    tankFuelType: "",
    mergedVolume: ""
  },
  {
    id: 3,
    compartmentId: "",
    compartmenFuelType: "",
    compartmentVolume: "",
    tankId: "",
    tankVolume: "",
    tankFuelType: "",
    mergedVolume: ""
  },
  {
    id: 4,
    compartmentId: "",
    compartmenFuelType: "",
    compartmentVolume: "",
    tankId: "",
    tankVolume: "",
    tankFuelType: "",
    mergedVolume: ""
  },
  {
    id: 5,
    compartmentId: "",
    compartmenFuelType: "",
    compartmentVolume: "",
    tankId: "",
    tankVolume: "",
    tankFuelType: "",
    mergedVolume: ""
  },
  {
    id: 6,
    compartmentId: "",
    compartmenFuelType: "",
    compartmentVolume: "",
    tankId: "",
    tankVolume: "",
    tankFuelType: "",
    mergedVolume: ""
  },
  {
    id: 7,
    compartmentId: "",
    compartmenFuelType: "",
    compartmentVolume: "",
    tankId: "",
    tankVolume: "",
    tankFuelType: "",
    mergedVolume: ""
  }
];

export const Compartment = ["C1", "C2", "C3", "C4", "C5"];

export const petrolType = [
  {
    label: "U95",
    value: "U95"
  },
  {
    label: "V97",
    value: "V97"
  },
  {
    label: "E7",
    value: "E7"
  },
  {
    label: "EUROB7",
    value: "EUROB7"
  },
  {
    label: "AGO",
    value: "AGO"
  }
];
// truck limit 100000 per Compartment
