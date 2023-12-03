import { View, TouchableOpacity, Text, SectionList, StyleSheet } from 'react-native';
import FeatherIcons from '@expo/vector-icons/Feather';
import DUMMYDATA from '../dummyData.json';
import { typography } from '../theme/typography';
import { AppStackScreenProps } from '../MainNavigator';
import { MainLayout } from '../components/MainLayout';

export const Home = ({ navigation }: AppStackScreenProps<'Home'>) => {
	return (
		<MainLayout>
			<View style={styles.newItemBox}>
				<View>
					<Text style={styles.newItemText}>New Discharge</Text>
				</View>
				<TouchableOpacity onPress={() => navigation.navigate('CompartmentInfo')}>
					<FeatherIcons name="chevron-down" size={25} />
				</TouchableOpacity>
			</View>

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
				sections={[{ data: DUMMYDATA.discharges }]}
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
							<Text style={styles.textSemiBold}>{item.date}</Text>
							<Text>{item.amount}L</Text>
						</View>
						<View>
							<Text style={styles.textSemiBold}>{item.amountTotal}L</Text>
							<Text style={styles.amountIndicatorText}>+{item.amount}L</Text>
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
		width: '85%',
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
		width: '85%',
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
		width: '85%',
	},
	sortingTab: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 15,
		paddingHorizontal: 10,
		width: '85%',
	},
	sortingTabItem: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
});
