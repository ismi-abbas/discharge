import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { typography } from '../theme/typography';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { compartmentData } from '../utils/constant';

export type CompartmentData = {
	id: number;
	compartmentId: string;
	fuelType: string;
	volume: string;
};

type Props = {
	data: CompartmentData[] | undefined;
	setTableData: (data: CompartmentData[]) => void;
	editable: boolean;
};

const TableBase = ({ data, setTableData, editable }: Props) => {
	const [compartmentTableData, setCompartmentData] = useState(compartmentData); // Initialize with your data

	const handleTypeChange = (id: number, value: string) => {
		const updatedCompartmentData = compartmentTableData.map(compartment =>
			compartment.id === id ? { ...compartment, fuelType: value } : compartment,
		);

		setCompartmentData(updatedCompartmentData);
		setTableData(updatedCompartmentData);
	};

	const handleVolumeChange = (id: number, value: string) => {
		const updatedCompartmentData = compartmentTableData.map(compartment =>
			compartment.id === id ? { ...compartment, volume: value } : compartment,
		);

		setCompartmentData(updatedCompartmentData);
		setTableData(updatedCompartmentData);
	};

	return (
		<View style={styles.container}>
			<ScrollView horizontal>
				{compartmentTableData.map(column => (
					<View key={column.id}>
						<View style={styles.box}>
							<Text style={styles.header}>{column.compartmentId}</Text>
						</View>
						<View
							style={{
								...styles.box,
								backgroundColor: editable ? 'green' : 'white',
							}}>
							<TextInput
								editable={editable}
								style={{ ...styles.input, color: editable ? 'white' : 'black' }}
								value={column.fuelType}
								onChangeText={type => handleTypeChange(column.id, type)}
							/>
						</View>
						<View
							style={{
								...styles.box,
								backgroundColor: editable ? 'green' : 'white',
							}}>
							<TextInput
								editable={editable}
								style={{ ...styles.input, color: editable ? 'white' : 'black' }}
								value={column.volume}
								onChangeText={volume => handleVolumeChange(column.id, volume)}
							/>
						</View>
					</View>
				))}
			</ScrollView>
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
		width: 70,
		borderWidth: 0.5,
		height: 40,
		backgroundColor: '#fff',
	},
	input: {
		fontSize: 14,
		fontFamily: typography.primary.medium,
		textAlign: 'center',
		color: 'black',
	},
	header: {
		fontSize: 14,
		fontFamily: typography.primary.semibold,
		textAlign: 'center',
		color: 'black',
	},
});

export default TableBase;
