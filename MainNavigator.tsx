import { createStackNavigator } from '@react-navigation/stack';
import AddDischarge from './screens/AddDischarge';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Home } from './screens/Home';

type AppStackParamList = {
	Home: undefined;
	AddDischarge: undefined;
};

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;

const Stack = createStackNavigator<AppStackParamList>();

export default function MainNavigator() {
	return (
		<Stack.Navigator
			initialRouteName="Home"
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen name="Home" component={Home} />
			<Stack.Screen name="AddDischarge" component={AddDischarge} />
		</Stack.Navigator>
	);
}
