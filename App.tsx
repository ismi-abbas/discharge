import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { customFontsToLoad } from './theme/typography';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './MainNavigator';
import Toast from 'react-native-toast-message';

export default function App() {
	let [areFontsLoaded] = useFonts(customFontsToLoad);

	if (!areFontsLoaded) return null;

	return (
		<NavigationContainer>
			<SafeAreaProvider>
				<MainNavigator />
				<Toast />
			</SafeAreaProvider>
		</NavigationContainer>
	);
}
