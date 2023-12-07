import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { AppStackScreenProps } from '../MainNavigator';
import { typography } from '../theme/typography';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { compartmentToTank, tankData } from '../utils/constant';
import FeatherIcons from '@expo/vector-icons/Feather';
import { ReportData } from './Home';
import { useRoute } from '@react-navigation/native';

const DischargeReport = ({ navigation }: AppStackScreenProps<'DischargeReport'>) => {
	const [finalReportData, setFinalReportData] = useState(compartmentToTank);
	const [reportListData, setReportListData] = useState<ReportData[]>();

	useEffect(() => {
		getAllData();
	}, []);

	const getAllData = async () => {
		try {
			const data = await AsyncStorage.getItem('mergedData');
			const reportListData = await AsyncStorage.getItem('reportData');
			setFinalReportData(JSON.parse(data || ''));
			setReportListData(JSON.parse(reportListData || ''));
			console.log(data);
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: 'Loading data failed',
				text2: 'Please try again',
			});
		}
	};

	const verifyAll = async () => {
		const currentId = 'Report ' + finalReportData?.length.toString();
		const newReport = {
			id: currentId,
			date: new Date(),
			report: finalReportData,
		};
		// Add the new report to the current report list
		const updatedReportList = [...(reportListData || []), newReport];
		setReportListData(updatedReportList);
		try {
			await AsyncStorage.setItem('reportData', JSON.stringify(updatedReportList));
			Toast.show({
				type: 'success',
				text1: 'Data verified',
				text2: 'All data has been saved and verified successfully',
				position: 'bottom',
				visibilityTime: 2000,
			});
			setTimeout(() => {
				navigation.navigate('Home');
			}, 2000);
			console.log(updatedReportList);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<MainLayout>
			<View style={styles.dischargeBox}>
				<View style={styles.titleBox}>
					<Pressable
						onPress={() => {
							navigation.navigate('Home');
						}}
						style={{
							backgroundColor: 'rgba(215, 215, 215, 0.8)',
							padding: 2,
							borderRadius: 5,
							position: 'absolute',
							top: 0,
							right: 0,
							zIndex: 10,
						}}>
						<FeatherIcons name="x" size={20} />
					</Pressable>
					<View>
						<Text style={styles.titleBoxText}>New Discharge</Text>
						<Text
							style={{
								marginTop: 20,
								fontFamily: typography.primary.bold,
								fontSize: 20,
							}}>
							Discharge Report
						</Text>
					</View>
				</View>

				<View style={{ marginTop: 5, borderWidth: 0.5 }}>
					<ScrollView horizontal>
						{finalReportData?.map(column => (
							<View key={column.id}>
								<View style={styles.box}>
									<Text style={styles.header}>{column.tankId}</Text>
								</View>
								<View style={styles.box}>
									<Text style={styles.columnText}>{column.tankFuelType}</Text>
								</View>
								<View
									style={{
										marginTop: 40,
										...styles.box,
									}}>
									<Text style={styles.columnText}>{column.tankVolume.concat('L')}</Text>
								</View>
								<View
									style={{
										marginTop: 40,
										...styles.box,
									}}>
									<Text style={styles.columnText}>{column.mergedVolume.concat('L')}</Text>
								</View>
							</View>
						))}
					</ScrollView>
					<View
						style={{
							position: 'absolute',
							width: 293,
							height: 240,
							zIndex: -10,
							borderRightWidth: 0.5,
							borderLeftWidth: 0.5,
							// backgroundColor: 'rgba(0, 188, 215, 1)',
						}}>
						<Text
							style={{
								fontSize: 14,
								fontFamily: typography.primary.bold,
								textAlign: 'center',
								color: 'black',
								top: '37%',
							}}>
							Delivery Order
						</Text>
						<Text
							style={{
								fontSize: 14,
								fontFamily: typography.primary.bold,
								textAlign: 'center',
								color: 'black',
								top: '62%',
							}}>
							Final Volume at Tank
						</Text>
					</View>
				</View>
			</View>

			<View
				style={{
					marginTop: 10,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
					width: '85%',
					gap: 10,
					paddingLeft: 20,
				}}>
				<Pressable onPress={verifyAll}>
					<Text style={{ ...styles.text, backgroundColor: 'rgba(208, 208, 208, 1)' }}>Verify and Close Report</Text>
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
		width: '85%',
	},
	titleBox: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	box: {
		justifyContent: 'center',
		width: 100,
		borderWidth: 0.5,
		height: 40,
		backgroundColor: '#fff',
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
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 5,
		paddingHorizontal: 22,
		borderRadius: 4,
	},
	text: {
		fontSize: 20,
		lineHeight: 21,
		fontFamily: typography.primary.normal,
		letterSpacing: 0.25,
		padding: 5,
		borderRadius: 5,
	},
	columnText: {
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
	itemBox: {
		borderTopWidth: 0.5,
		borderBottomWidth: 0.5,
		borderRightWidth: 0.5,
		borderLeftWidth: 0.5,
		height: 40,
		width: 80,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default DischargeReport;
