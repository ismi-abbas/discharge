import { createStackNavigator } from '@react-navigation/stack';
import CompartmentInfo from './screens/CompartmentInfo';
import CompartmentTankVerify from './screens/CompartmentTankVerify';
import DischargeReport from './screens/DischargeReport';
import { Home } from './screens/Home';
import OneTimeSetup from './screens/OneTimeSetup';
import TankInfo from './screens/TankInfo';
import ViewReport from './screens/ViewReport';
import { AppStackParamList } from './utils/types';

const Stack = createStackNavigator<AppStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="OneTimeSetup"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="OneTimeSetup" component={OneTimeSetup} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CompartmentInfo" component={CompartmentInfo} />
      <Stack.Screen name="TankInfo" component={TankInfo} />
      <Stack.Screen name="CompartmentTankVerify" component={CompartmentTankVerify} />
      <Stack.Screen name="DischargeReport" component={DischargeReport} initialParams={{ reportData: undefined }} />
      <Stack.Screen name="ViewReport" component={ViewReport} />
    </Stack.Navigator>
  );
}
