import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppStackScreenProps } from '../MainNavigator';
import { MainLayout } from '../components/MainLayout';
import { typography } from '../theme/typography';
import FeatherIcons from '@expo/vector-icons/Feather';
import { tankData } from '../utils/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const TankValuePreset = ({ navigation }: AppStackScreenProps<'TankValuePreset'>) => {
	const [gridValues, setGridValues] = useState(tankData);
	const [editable, setEditable] = useState(false);
	const [isVerified, setIsVerified] = useState(false);
	const [isSaved, setSaved] = useState(false);

	useEffect(() => {
		getGridData();
	}, []);

	const getGridData = async () => {
		try {
			const data = await AsyncStorage.getItem('tankData');
			if (data) {
				setGridValues(JSON.parse(data || ''));
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleInputChange = (row: any, col: any, value: string) => {
		const field = gridValues[row][col];
		if (value.trim() !== '' && value !== '0') {
			field.isVerified = true;
		} else {
			field.isVerified = false;
		}
		if (row !== 0) {
			const newGridValues = [...gridValues];
			newGridValues[row][col].value = value;
			setGridValues(newGridValues);
		}
	};

	const saveData = async () => {
		AsyncStorage.setItem('tankData', JSON.stringify(gridValues));
		Toast.show({
			type: 'success',
			text1: 'Data Saved',
			text2: 'Tank details has been saved 👍🏻',
			position: 'bottom',
			visibilityTime: 2000,
		});
	};

	const verifyAll = () => {
		console.log(gridValues);
		const verified =
			gridValues[1].every(column => column.value.trim() !== '') &&
			gridValues[2].every(column => column.value.trim() !== '');

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
				navigation.navigate('CompartmentTankVerify');
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
					<View>
						<Pressable
							onPress={() => navigation.navigate('Home')}
							style={{
								backgroundColor: 'rgba(215, 215, 215, 0.8)',
								padding: 2,
								borderRadius: 5,
								position: 'absolute',
								top: 0,
								right: 0,
								zIndex: 20,
							}}>
							<FeatherIcons name="x" size={20} />
						</Pressable>
						<Text style={styles.titleBoxText}>Tank Preset Value</Text>
						<Text
							style={{
								marginTop: 20,
								fontFamily: typography.primary.light,
								fontSize: 17,
							}}>
							Please Key In Your Station Tank Preset Value, Tank(T)
						</Text>

						<View style={{ marginTop: 20 }}>
							{gridValues.map((row, rowIndex) => (
								<View key={rowIndex} style={styles.row}>
									{row.slice(0, 5).map((col, colIndex) => (
										<TextInput
											editable={editable && rowIndex > 1}
											key={colIndex}
											style={{
												color: rowIndex > 1 ? (editable ? 'gray' : 'black') : 'black',
												backgroundColor: !col.isVerified && rowIndex > 1 ? 'red' : 'rgba(3, 244, 28, 1)',
												...styles.box,
											}}
											value={gridValues[rowIndex][colIndex].value}
											onChangeText={value => handleInputChange(rowIndex, colIndex, value)}
											keyboardType={`${rowIndex == 2 ? 'numeric' : 'default'}`}
										/>
									))}
								</View>
							))}
						</View>

						<View style={{ marginTop: 20 }}>
							{gridValues.map((row, rowIndex) => (
								<View key={rowIndex} style={styles.row}>
									{row.slice(5, 9).map((col, colIndex) => (
										<TextInput
											editable={editable && rowIndex > 1}
											key={colIndex}
											style={{
												color: rowIndex > 1 ? (editable ? 'gray' : 'black') : 'black',
												backgroundColor: !col.isVerified && rowIndex > 1 ? 'red' : 'rgba(3, 244, 28, 1)',
												...styles.box,
											}}
											value={gridValues[rowIndex][colIndex + 5].value}
											onChangeText={value => handleInputChange(rowIndex, colIndex + 5, value)}
											keyboardType={`${rowIndex == 2 ? 'numeric' : 'default'}`}
										/>
									))}
								</View>
							))}
						</View>
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
		height: 500,
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
		fontFamily: typography.primary.semibold,
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

export default TankValuePreset;
