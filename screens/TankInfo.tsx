import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { AppStackScreenProps } from '../MainNavigator';
import { MainLayout } from '../components/MainLayout';
import DUMMY_DATA from '../dummyData.json';
import { typography } from '../theme/typography';
import FeatherIcons from '@expo/vector-icons/Feather';

const TankInfo = ({ navigation }: AppStackScreenProps<'TankInfo'>) => {
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

export default TankInfo;
