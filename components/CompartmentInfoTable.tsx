import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { typography } from '../theme/typography';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { DropdownList } from './CompartmentVSTankTable';
import { Dropdown } from 'react-native-element-dropdown';
import { petrolType } from '../utils/constant';

export type CompartmentData = {
	id: number;
	compartmentId: string;
	fuelType: string;
	volume: string;
};

type Props = {
	tableData: CompartmentData[] | undefined;
	setTableData: (data: CompartmentData[]) => void;
	editable: boolean;
	handleFuelTypeChange: Function;
	handleVolumeChange: Function;
	handleCompartmentSelect: Function;
};

const CompartmentInfoTable = ({ tableData, editable, handleVolumeChange, handleCompartmentSelect }: Props) => {
	const [dropdownList, setDropDownList] = useState<DropdownList[]>(petrolType);

	return (
		<View style={styles.container}>
			<ScrollView horizontal>
				{tableData?.map((column, index) => (
					<View key={column.id}>
						<View style={styles.box}>
							<Text style={styles.header}>{column.compartmentId}</Text>
						</View>

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
							value={column.fuelType}
							onChange={item => handleCompartmentSelect(item, column.compartmentId)}
						/>

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

export default CompartmentInfoTable;