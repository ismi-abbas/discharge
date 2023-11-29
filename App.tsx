import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { customFontsToLoad } from './theme/typography';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './MainNavigator';

export default function App() {
	let [areFontsLoaded] = useFonts(customFontsToLoad);

	if (!areFontsLoaded) return null;

	return (
		<NavigationContainer>
			<SafeAreaProvider>
				<MainNavigator />
			</SafeAreaProvider>
		</NavigationContainer>
	);
}
