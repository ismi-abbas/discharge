import { ScrollView, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useFonts } from 'expo-font';
import { customFontsToLoad, typography } from './theme/typography';
import FeatherIcons from '@expo/vector-icons/Feather';
import DUMMYDATA from './dummyData.json';

export default function App() {
	let [areFontsLoaded] = useFonts(customFontsToLoad);

	if (!areFontsLoaded) return null;

	return (
		<SafeAreaProvider>
			<HomeScreen />
		</SafeAreaProvider>
	);
}

function HomeScreen() {
	return (
		<View style={styles.container}>
			<View style={styles.bar}>
				<Image
					style={styles.image}
					source="https://media.gettyimages.com/id/1314489757/photo/smiling-hispanic-man-against-white-background.jpg?s=2048x2048&w=gi&k=20&c=xK-PIu9PhfkSz7nUpMF6omCHgufUZcyFaRgJURtR3gA="
					contentFit="cover"
					transition={1000}
				/>
				<View>
					<Text style={styles.barTitle}>Station A</Text>
				</View>
				<View>
					<FeatherIcons name="sliders" size={20} />
				</View>
			</View>

			<View style={styles.newItemBox}>
				<Text style={styles.newItemText}>New Discharge</Text>
			</View>

			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					paddingVertical: 15,
					paddingHorizontal: 10,
					width: '85%',
				}}>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
					}}>
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
				style={{
					width: '85%',
				}}
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
							<Text
								style={{
									fontFamily: typography.primary.semibold,
								}}>
								{item.date}
							</Text>
							<Text>{item.amount}L</Text>
						</View>
						<View>
							<Text
								style={{
									fontFamily: typography.primary.semibold,
								}}>
								{item.amountTotal}L
							</Text>
							<Text
								style={{
									color: 'green',
								}}>
								+{item.amount}L
							</Text>
						</View>
					</View>
				)}
			/>
		</View>
	);
}
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
});
