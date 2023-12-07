import { View, TouchableOpacity, Text, SectionList, StyleSheet, ScrollView, Pressable } from 'react-native';
import FeatherIcons from '@expo/vector-icons/Feather';
import DUMMYDATA from '../dummyData.json';
import { typography } from '../theme/typography';
import { AppStackScreenProps } from '../MainNavigator';
import { MainLayout } from '../components/MainLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FuelData } from '../types';
import { MergeData } from '../components/CompartmentVSTankTable';
import { useRoute } from '@react-navigation/native';

export type ReportData = {
	date: Date;
	report: MergeData[];
};

export interface ResultItem {
	date: Date;
	totalTankVolume: number;
	totalCompartmentVolume: number;
	status: string;
}

export const Home = ({ navigation }: AppStackScreenProps<'Home'>) => {
	const [dummyData, setDummyData] = useState<FuelData>(DUMMYDATA);
	const [reportData, setReportData] = useState<ReportData[]>();
	const [listData, setListData] = useState<ResultItem[]>();

	const fetchReportData = async () => {
		try {
			const data = await AsyncStorage.getItem('reportData');
			if (data) {
				setReportData(JSON.parse(data || ''));
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			await loadDummyData();
			await fetchReportData();
		};

		if (reportData) {
			const totalsByDate = reportData.reduce((result, array) => {
				const date = array.date;

				const { totalTankVolume, totalCompartmentVolume } = array.report.reduce(
					(accumulator, tank) => {
						accumulator.totalTankVolume += parseInt(tank.tankVolume) || 0;
						accumulator.totalCompartmentVolume += parseInt(tank.compartmentVolume) || 0;
						return accumulator;
					},
					{ totalTankVolume: 0, totalCompartmentVolume: 0 },
				);

				result.push({
					date,
					totalTankVolume,
					totalCompartmentVolume,
					status: 'normal',
				});

				console.log(result);

				return result;
			}, [] as ResultItem[]);

			setListData(totalsByDate);
		}

		fetchData();
	}, []);

	const loadDummyData = async () => {
		try {
			const data = await AsyncStorage.getItem('dummyData');
			if (data) {
				setDummyData(JSON.parse(data!));
			}
		} catch (err) {
			console.log('===============> error here', err);
		}
	};

	return (
		<MainLayout>
			<TouchableOpacity onPress={() => navigation.navigate('CompartmentInfo')} style={styles.newItemBox}>
				<View>
					<Text style={styles.newItemText}>New Discharge</Text>
				</View>
				<View>
					<FeatherIcons name="chevron-down" size={25} />
				</View>
			</TouchableOpacity>

			<View style={styles.sortingTab}>
				<View style={styles.sortingTabItem}>
					<FeatherIcons name="chevron-up" size={20} />
					<Text
						style={{
							fontSize: 15,
						}}>
						Sort By
					</Text>
				</View>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
					}}>
					<Text
						style={{
							fontSize: 15,
						}}>
						Last 25h
					</Text>
					<FeatherIcons name="chevron-down" size={20} />
				</View>
			</View>

			<SectionList
				style={styles.sectionListBox}
				showsVerticalScrollIndicator={false}
				sections={[{ data: listData ? listData : [] }]}
				renderItem={({ item }) => (
					<View style={styles.dischargeBoxItem}>
						<View
							style={{
								...styles.statusIcon,
								backgroundColor: `${item.status === 'normal' ? 'rgba(0, 186, 78, 1)' : 'rgba(255, 216, 45, 1)'}`,
							}}>
							<FeatherIcons name="dollar-sign" size={30} color="white" />
						</View>
						<View>
							<Text style={styles.textSemiBold}>{item.date.toString().split('T')[0]}</Text>
							<Text>{item.totalTankVolume}L</Text>
						</View>
						<View>
							<Text style={styles.textSemiBold}>{item.totalCompartmentVolume}L</Text>
							<Text style={styles.amountIndicatorText}>+{item.totalCompartmentVolume + item.totalTankVolume}L</Text>
						</View>
					</View>
				)}
			/>
		</MainLayout>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#EAECEC',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: 30,
	},
	text: {
		fontFamily: typography.primary.normal,
	},
	image: {
		display: 'flex',
		width: 50,
		height: 50,
		backgroundColor: '#0553',
		borderRadius: 50,
	},
	bar: {
		display: 'flex',
		backgroundColor: '#fff',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: 20,
		height: 90,
	},
	barTitle: {
		fontFamily: typography.primary.medium,
		fontSize: 25,
	},
	newItemBox: {
		width: '90%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 20,
		backgroundColor: '#fff',
		borderRadius: 10,
		height: 200,
	},
	newItemText: {
		fontFamily: typography.primary.semibold,
		fontSize: 25,
	},
	dischargeRecordBox: {
		width: '90%',
	},
	dischargeBoxItem: {
		backgroundColor: '#fff',
		borderRadius: 10,
		paddingHorizontal: 20,
		paddingVertical: 20,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	statusIcon: {
		backgroundColor: 'rgba(255, 216, 45, 1);',
		borderRadius: 50,
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
	textSemiBold: {
		fontFamily: typography.primary.semibold,
	},
	amountIndicatorText: {
		color: 'rgb(0, 186, 78)',
	},
	sectionListBox: {
		width: '90%',
	},
	sortingTab: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 15,
		paddingHorizontal: 10,
		width: '90%',
	},
	sortingTabItem: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
});
