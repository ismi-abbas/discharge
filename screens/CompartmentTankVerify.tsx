import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { AppStackScreenProps } from '../MainNavigator';
import { typography } from '../theme/typography';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { compartmentData, tankData } from '../utils/constant';
import FeatherIcons from '@expo/vector-icons/Feather';
import { ScrollView } from 'react-native-gesture-handler';

const CompartmentTankVerify = ({ navigation }: AppStackScreenProps<'CompartmentTankVerify'>) => {
	const [tankDataGrid, setTankDataGrid] = useState(tankData);
	const [compartmentDataGrid, setCompartmentDataGrid] = useState(compartmentData);
	const [mergeDataGrid, setMergeDataGrid] = useState([
		[{ value: 'New Merged Volume', isVerified: true }],
		[
			{ value: '35000', isVerified: true },
			{ value: '11000', isVerified: true },
			{ value: '39000', isVerified: true },
			{ value: '40000', isVerified: true },
			{ value: '55000', isVerified: true },
		],
	]);

	const [editable, setEditable] = useState(false);
	const [isVerified, setIsVerified] = useState(false);
	const [isSaved, setSaved] = useState(false);

	useEffect(() => {
		getGridData();
	}, []);

	const getGridData = async () => {
		const data = await AsyncStorage.getItem('tankData');
		setTankDataGrid(JSON.parse(data || ''));
	};

	const handleInputChange = (row: any, col: any, value: string) => {
		const field = tankDataGrid[row][col];
		if (value.trim() !== '' && value !== '0') {
			field.isVerified = true;
		} else {
			field.isVerified = false;
		}
		if (row !== 0) {
			const newGridValues = [...tankDataGrid];
			newGridValues[row][col].value = value;
			setTankDataGrid(newGridValues);
		}
	};

	const saveData = async () => {
		AsyncStorage.setItem('tankData', JSON.stringify(tankDataGrid));
		Toast.show({
			type: 'success',
			text1: 'Data Saved',
			text2: 'Tank details has been saved 👍🏻',
			position: 'bottom',
			visibilityTime: 2000,
		});
	};

	const verifyAll = () => {
		console.log(tankDataGrid);
		const verified =
			tankDataGrid[1].every(column => column.value.trim() !== '') &&
			tankDataGrid[2].every(column => column.value.trim() !== '');

		if (verified) {
			setIsVerified(true);
			Toast.show({
				type: 'success',
				text1: 'Data Verified',
				text2: 'All data has been verified',
				position: 'bottom',
				visibilityTime: 2000,
			});
			setTimeout(() => {
				navigation.navigate('DischargeReport');
			}, 2000);
		} else {
			Toast.show({
				type: 'error',
				text1: 'Invalid data',
				text2: 'Please fill in all the columns',
				position: 'bottom',
				visibilityTime: 2000,
			});
			setIsVerified(false);
		}
	};

	const date = new Date();

	return (
		<MainLayout>
			<View style={styles.dischargeBox}>
				<View style={styles.titleBox}>
					<Pressable
						onPress={() => navigation.navigate('Home')}
						style={{
							backgroundColor: 'rgba(215, 215, 215, 0.8)',
							padding: 2,
							borderRadius: 5,
							position: 'absolute',
							top: 0,
							right: 0,
						}}>
						<FeatherIcons name="x" size={20} />
					</Pressable>
					<View>
						<Text style={styles.titleBoxText}>New Discharge</Text>
						<Text
							style={{
								marginTop: 20,
								fontFamily: typography.primary.bold,
								fontSize: 17,
							}}>
							Truck Compartment (C) toStation Tank (T) Petrol Match
						</Text>

						<Text
							style={{
								marginTop: 20,
								fontFamily: typography.primary.light,
								fontSize: 17,
							}}>
							Please match Compartment (C)to Tank (V)
						</Text>
						{/* <ScrollView horizontal> */}
						{/* Compartment Data */}
						<View style={{ marginTop: 20 }}>
							{compartmentDataGrid.map((row, rowIndex) => (
								<View key={rowIndex} style={styles.row}>
									{row.slice(0, 5).map((col, colIndex) => (
										<TextInput
											editable={editable && rowIndex !== 0}
											key={colIndex}
											style={{
												fontFamily: rowIndex === 0 ? typography.primary.bold : typography.primary.semibold,
												color: rowIndex !== 0 ? (editable ? 'gray' : 'black') : 'black',
												backgroundColor: !col.isVerified && rowIndex !== 0 ? 'red' : 'rgba(3, 244, 28, 1)',
												...styles.box,
											}}
											value={tankDataGrid[rowIndex][colIndex].value}
											onChangeText={value => handleInputChange(rowIndex, colIndex, value)}
											keyboardType={`${rowIndex == 2 ? 'numeric' : 'default'}`}
										/>
									))}
								</View>
							))}
						</View>
						{/* Station Tank Data */}
						<View>
							{tankDataGrid.map((row, rowIndex) => (
								<View key={rowIndex} style={styles.row}>
									{row.slice(0, 5).map((col, colIndex) => (
										<TextInput
											editable={editable && rowIndex !== 0}
											key={colIndex}
											style={{
												fontFamily: rowIndex === 0 ? typography.primary.bold : typography.primary.semibold,
												color: rowIndex !== 0 ? (editable ? 'gray' : 'black') : 'black',
												backgroundColor: 'yellow',
												...styles.box,
											}}
											value={tankDataGrid[rowIndex][colIndex].value}
											onChangeText={value => handleInputChange(rowIndex, colIndex, value)}
											keyboardType={`${rowIndex == 2 ? 'numeric' : 'default'}`}
										/>
									))}
								</View>
							))}
						</View>
						{/* Merged Data */}
						<View>
							{mergeDataGrid.map((row, rowIndex) => (
								<View key={rowIndex} style={styles.row}>
									{row.map((col, colIndex) => (
										<TextInput
											editable={editable && rowIndex !== 0}
											key={colIndex}
											style={{
												fontFamily: typography.primary.bold,
												color: rowIndex !== 0 ? (editable ? 'gray' : 'black') : 'black',
												backgroundColor: 'rgba(0, 199, 227, 0.9)',
												...styles.box,
											}}
											value={mergeDataGrid[rowIndex][colIndex].value}
											onChangeText={value => handleInputChange(rowIndex, colIndex, value)}
											keyboardType={`${rowIndex == 2 ? 'numeric' : 'default'}`}
										/>
									))}
								</View>
							))}
						</View>
						{/* </ScrollView> */}
					</View>
				</View>
				<View
					style={{
						display: 'flex',
						marginTop: 20,
						alignItems: 'flex-start',
						width: '95%',
					}}>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 10,
							marginTop: 4,
						}}>
						<Pressable
							onPress={() => {
								setEditable(!editable);
								setSaved(false);
							}}
							style={{ ...styles.button, backgroundColor: !editable ? 'rgba(4, 113, 232, 1)' : 'gray' }}>
							<Text style={{ ...styles.text, color: 'white' }}>Edit</Text>
						</Pressable>
					</View>
				</View>
			</View>

			<View
				style={{
					marginTop: 10,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-start',
					width: '95%',
					gap: 10,
					paddingLeft: 20,
				}}>
				<Pressable
					aria-disabled={isVerified}
					onPress={saveData}
					style={{ ...styles.button, backgroundColor: 'rgba(4, 113, 232, 1)' }}>
					<Text style={{ ...styles.text, color: 'white' }}>Save</Text>
				</Pressable>
				<Pressable onPress={verifyAll} style={{ ...styles.button, backgroundColor: 'rgba(215, 215, 215, 0.8)' }}>
					<Text style={styles.text}>Verify</Text>
				</Pressable>
			</View>
		</MainLayout>
	);
};

const styles = StyleSheet.create({
	dischargeBox: {
		padding: 20,
		display: 'flex',
		marginTop: 20,
		borderRadius: 10,
		backgroundColor: '#fff',
		height: 600,
		width: '95%',
	},
	titleBox: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	titleBoxText: {
		fontSize: 20,
		fontFamily: typography.primary.semibold,
	},
	row: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-evenly',
	},
	box: {
		// fontFamily: typography.primary.semibold,
		flex: 1,
		width: 'auto',
		height: 40,
		// backgroundColor: 'rgba(3, 244, 28, 1)',
		borderWidth: 0.5,
		textAlign: 'center',
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 5,
		paddingHorizontal: 22,
		borderRadius: 4,
	},
	text: {
		fontSize: 16,
		lineHeight: 21,
		fontFamily: typography.primary.medium,
		letterSpacing: 0.25,
	},
});

export default CompartmentTankVerify;
