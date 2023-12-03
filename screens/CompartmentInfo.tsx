import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { AppStackScreenProps } from '../MainNavigator';
import { MainLayout } from '../components/MainLayout';
import FeatherIcons from '@expo/vector-icons/Feather';
import { typography } from '../theme/typography';
import DUMMY_DATA from '../dummyData.json';

const CompartmentInfo = ({ navigation }: AppStackScreenProps<'CompartmentInfo'>) => {
	const [editable, setEditable] = useState(false);
	const [gridValues, setGridValues] = useState([
		[
			{ value: 'C1', isVerified: true },
			{ value: 'C2', isVerified: true },
			{ value: 'C3', isVerified: true },
			{ value: 'C4', isVerified: true },
			{ value: 'C5', isVerified: true },
		],
		[
			{ value: '', isVerified: false },
			{ value: '', isVerified: false },
			{ value: '', isVerified: false },
			{ value: '', isVerified: false },
			{ value: '', isVerified: false },
		],
		[
			{ value: '', isVerified: false },
			{ value: '', isVerified: false },
			{ value: '', isVerified: false },
			{ value: '', isVerified: false },
			{ value: '', isVerified: false },
		],
	]);
	const [isVerified, setIsVerified] = useState(false);

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

	const verifyAll = () => {
		const verified =
			gridValues[1].every(column => column.value.trim() !== '') &&
			gridValues[2].every(column => column.value.trim() !== '');

		if (verified) {
			setIsVerified(true);
			navigation.navigate('TankInfo');
		} else {
			setIsVerified(false);
		}
	};

	const date = new Date();

	return (
		<MainLayout>
			<View style={styles.dischargeBox}>
				<View style={styles.titleBox}>
					<View>
						<Text style={styles.titleBoxText}>New Discharge</Text>
						<Text
							style={{
								fontFamily: typography.primary.semibold,
								fontSize: 25,
							}}>
							{DUMMY_DATA.stations[0].name}
						</Text>
						<Text
							style={{
								fontFamily: typography.primary.light,
								fontSize: 14,
							}}>
							{DUMMY_DATA.stations[0].address}
						</Text>
						<View
							style={{
								marginTop: 10,
							}}>
							<Text
								style={{
									fontFamily: typography.primary.semibold,
									fontSize: 17,
								}}>
								{DUMMY_DATA.stations[0].companyName}
							</Text>
							<Text
								style={{
									fontFamily: typography.primary.light,
									fontSize: 14,
								}}>
								{DUMMY_DATA.stations[0].companyAddress}
							</Text>
						</View>
						<Text
							style={{
								marginTop: 10,
								fontFamily: typography.primary.normal,
								fontSize: 12,
							}}>
							Date: {date.toDateString()}
						</Text>
					</View>

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
				</View>
			</View>

			<View
				style={{
					marginTop: 10,
					width: '85%',
				}}>
				<Text
					style={{
						fontFamily: typography.primary.bold,
						width: '85%',
						fontSize: 15,
						textTransform: 'capitalize',
					}}>
					Please key in truck delivery details compartment(C)
				</Text>
				<View style={{ marginTop: 20 }}>
					{gridValues.map((row, rowIndex) => (
						<View key={rowIndex} style={styles.row}>
							{row.map((col, colIndex) => (
								<TextInput
									editable={editable && rowIndex !== 0}
									key={colIndex}
									style={{
										color: rowIndex !== 0 ? (editable ? 'gray' : 'black') : 'black',
										backgroundColor: !col.isVerified && rowIndex !== 0 ? 'red' : 'rgba(3, 244, 28, 1)',
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
			</View>
			<View
				style={{
					display: 'flex',
					marginTop: 20,
					alignItems: 'flex-start',
					width: '85%',
				}}>
				{!isVerified ? <Text>Please fill up all columns</Text> : <View></View>}
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: 10,
						marginTop: 4,
					}}>
					<Pressable
						onPress={() => setEditable(!editable)}
						style={{ ...styles.button, backgroundColor: !editable ? 'rgba(4, 113, 232, 1)' : 'gray' }}>
						<Text style={{ ...styles.text, color: 'white' }}>Edit</Text>
					</Pressable>

					<Pressable onPress={verifyAll} style={{ ...styles.button, backgroundColor: 'rgba(215, 215, 215, 0.8)' }}>
						<Text style={styles.text}>Verify</Text>
					</Pressable>
				</View>
			</View>
		</MainLayout>
	);
};

export default CompartmentInfo;

const styles = StyleSheet.create({
	dischargeBox: {
		padding: 20,
		display: 'flex',
		marginTop: 20,
		borderRadius: 10,
		backgroundColor: '#fff',
		height: 220,
		width: '85%',
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
