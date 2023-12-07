import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { typography } from '../theme/typography';
import { ScrollView } from 'react-native-gesture-handler';
import { CompartmentData } from './CompartmentInfoTable';
import { TankData } from './TankInfoTable';
import { Dropdown } from 'react-native-element-dropdown';

type Props = {
	tankData: TankData[];
	setTankData: (data: TankData[]) => void;
	compartmentData: CompartmentData[];
	setCompartmentData: (data: CompartmentData[]) => void;
	editable: boolean;
	mergedData: MergeData[] | undefined;
	setMergedData: (data: MergeData[]) => void;
};
export type MergeData = {
	id: number | string;
	tankId: string;
	tankFuelType: string;
	tankVolume: string;
	compartmentId: string;
	compartmenFuelType: string;
	compartmentVolume: string;
	mergedVolume: string;
};

export type DropdownList = {
	label: string;
	value: string;
};

const CompartmentVSTankTable = ({ compartmentData, editable, mergedData, setMergedData }: Props) => {
	const [dropdownList, setDropDownList] = useState<DropdownList[]>([]);

	if (!mergedData) {
		return null; // or handle the case appropriately
	}

	useEffect(() => {
		const newDropdownList = compartmentData.map(data => ({
			label: data.compartmentId,
			value: data.compartmentId,
		}));

		setDropDownList(newDropdownList);

		console.log(mergedData);
	}, []);

	const handleCompartmentSelect = (item: DropdownList, tankId: string) => {
		const id = item.value;
		const compartment = compartmentData.find(data => data.compartmentId === item.value);
		if (!compartment) {
			return;
		}

		const compartmentFuelType = compartment.fuelType || '';
		const volume = compartment.volume || '';

		const updatedData = mergedData?.map(data =>
			data.tankId === tankId
				? {
						...data,
						compartmentId: id,
						compartmentVolume: volume,
						compartmenFuelType: compartmentFuelType,
						mergedVolume: calculateTotal(volume, data.tankVolume),
				  }
				: data,
		);
		setMergedData(updatedData!);
	};

	const calculateTotal = (compartmentVolume: string, tankVolume: string): string => {
		const compartment = parseInt(compartmentVolume) || 0;
		const tank = parseInt(tankVolume) || 0;
		return (compartment + tank).toString();
	};

	return (
		<View style={styles.container}>
			<ScrollView horizontal>
				{mergedData?.map(column => (
					<View key={column.id}>
						{/* Tank ID */}
						<View
							style={{
								...styles.box,
								backgroundColor: 'rgba(91, 217, 250, 0.8)',
							}}>
							<Text style={styles.header}>{column.tankId}</Text>
						</View>
						{/* Tank Petrol Type */}
						<View
							style={{
								...styles.box,
								backgroundColor: 'rgba(91, 217, 250, 0.8)',
							}}>
							<Text style={styles.text}>{column.tankFuelType}</Text>
						</View>
						{/* Tank Volume */}
						<View
							style={{
								...styles.box,
								backgroundColor: 'rgba(91, 217, 250, 0.8)',
							}}>
							<Text style={styles.text}>{column.tankVolume}</Text>
						</View>
						{/* Compartment Select */}
						<Dropdown
							disable={!editable}
							style={{ ...styles.dropdown, backgroundColor: editable ? 'yellow' : 'white' }}
							placeholderStyle={styles.placeholderStyle}
							selectedTextStyle={styles.selectedTextStyle}
							iconStyle={styles.iconStyle}
							data={dropdownList}
							labelField="label"
							valueField="value"
							placeholder="Select"
							value={column.compartmentId}
							onChange={item => handleCompartmentSelect(item, column.tankId)}
						/>

						{/* Compartment Type */}
						<View
							style={{
								...styles.box,
								backgroundColor: column.compartmenFuelType === column.tankFuelType ? 'white' : 'red',
							}}>
							<Text style={styles.text}>{column.compartmenFuelType}</Text>
						</View>

						{/* Compartment Volume */}
						<View
							style={{
								...styles.box,
							}}>
							<Text style={styles.text}>{column.compartmentVolume}</Text>
						</View>

						<View
							style={{
								marginTop: 40,
								...styles.box,
							}}>
							<Text style={styles.text}>{calculateTotal(column.compartmentVolume, column.tankVolume)}</Text>
						</View>
					</View>
				))}
			</ScrollView>
			{/* Merged Volume Text */}
			<View
				style={{
					position: 'absolute',
					width: 333,
					height: 310,
					zIndex: -10,
					backgroundColor: 'rgba(91, 250, 124, 0.8)',
				}}>
				<Text
					style={{
						fontSize: 14,
						fontFamily: typography.primary.bold,
						textAlign: 'center',
						color: 'black',
						top: '80%',
					}}>
					New Merged Volume
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 10,
		borderWidth: 0.5,
		borderColor: 'black',
		display: 'flex',
		flexDirection: 'column',
	},
	box: {
		justifyContent: 'center',
		width: 100,
		borderWidth: 0.5,
		height: 40,
		backgroundColor: '#fff',
	},
	text: {
		fontSize: 14,
		fontFamily: typography.primary.medium,
		textAlign: 'center',
		color: 'black',
	},
	header: {
		fontSize: 14,
		fontFamily: typography.primary.bold,
		textAlign: 'center',
		color: 'black',
	},
	dropdown: {
		height: 40,
		borderWidth: 0.5,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	placeholderStyle: {
		fontSize: 12,
		fontFamily: typography.primary.bold,
	},
	selectedTextStyle: {
		fontSize: 14,
		fontFamily: typography.primary.bold,
	},
	iconStyle: {
		display: 'none',
	},
});

export default CompartmentVSTankTable;
