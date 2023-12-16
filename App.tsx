import 'react-native-gesture-handler';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { customFontsToLoad } from './theme/typography';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './MainNavigator';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ViewStyle } from 'react-native';

export default function App() {
  const [areFontsLoaded] = useFonts(customFontsToLoad);

  if (!areFontsLoaded) return null;

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={container}>
        <NavigationContainer>
          <MainNavigator />
          <Toast />
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const container: ViewStyle = {
  flex: 1,
};
