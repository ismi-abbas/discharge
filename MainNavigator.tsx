import { createStackNavigator } from "@react-navigation/stack";
import CompartmentInfo from "./screens/CompartmentInfo";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Home } from "./screens/Home";
import TankInfo from "./screens/TankInfo";
import CompartmentTankVerify from "./screens/CompartmentTankVerify";
import DischargeReport from "./screens/DischargeReport";
import TankValuePreset from "./screens/TankValuePreset";
import OneTimeSetup from "./screens/OneTimeSetup";

type AppStackParamList = {
  OneTimeSetup: undefined;
  Home: undefined;
  CompartmentInfo: undefined;
  TankInfo: undefined;
  CompartmentTankVerify: undefined;
  DischargeReport: undefined;
  TankValuePreset: undefined;
};

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

const Stack = createStackNavigator<AppStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="OneTimeSetup"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="OneTimeSetup"
        component={OneTimeSetup}
      />
      <Stack.Screen
        name="Home"
        component={Home}
      />
      <Stack.Screen
        name="CompartmentInfo"
        component={CompartmentInfo}
      />
      <Stack.Screen
        name="TankInfo"
        component={TankInfo}
      />
      <Stack.Screen
        name="CompartmentTankVerify"
        component={CompartmentTankVerify}
      />
      <Stack.Screen
        name="DischargeReport"
        component={DischargeReport}
      />
      <Stack.Screen
        name="TankValuePreset"
        component={TankValuePreset}
      />
    </Stack.Navigator>
  );
}
