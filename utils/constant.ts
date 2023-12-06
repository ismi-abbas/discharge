export const tankData = [
	[
		{ value: 'T1', isVerified: true },
		{ value: 'T2', isVerified: true },
		{ value: 'T3', isVerified: true },
		{ value: 'T4', isVerified: true },
		{ value: 'T5', isVerified: true },
		{ value: 'T6', isVerified: true },
		{ value: 'T7', isVerified: true },
		{ value: 'T8', isVerified: true },
		{ value: 'T9', isVerified: true },
	],
	[
		{ value: 'V97', isVerified: false },
		{ value: 'R95', isVerified: false },
		{ value: 'AGO', isVerified: false },
		{ value: 'EUROB7', isVerified: false },
		{ value: 'TEST', isVerified: false },
		{ value: 'TEST', isVerified: false },
		{ value: 'TEST', isVerified: false },
		{ value: 'TEST', isVerified: false },
		{ value: 'TEST', isVerified: false },
	],
	[
		{ value: '40000', isVerified: false },
		{ value: '50000', isVerified: false },
		{ value: '30000', isVerified: false },
		{ value: '40000', isVerified: false },
		{ value: '25000', isVerified: false },
		{ value: '25000', isVerified: false },
		{ value: '15000', isVerified: false },
		{ value: '35000', isVerified: false },
		{ value: '25000', isVerified: false },
	],
];

export const compartmentData = [
	{ id: 1, compartmentId: 'C1', fuelType: 'R95', volume: '15000' },
	{ id: 2, compartmentId: 'C2', fuelType: 'V97', volume: '14000' },
	{ id: 3, compartmentId: 'C3', fuelType: 'E7', volume: '17000' },
	{ id: 4, compartmentId: 'C4', fuelType: 'EUROB7', volume: '30000' },
	{ id: 5, compartmentId: 'C5', fuelType: 'AGO', volume: '25000' },
	{ id: 6, compartmentId: 'C6', fuelType: 'R95', volume: '21000' },
];

export const Compartment = ['C1', 'C2', 'C3', 'C4', 'C5'];

export const petrolType = ['R95', 'V97', 'E7', 'EUROB7', 'AGO'];
// truck limit 100000 per Compartment
