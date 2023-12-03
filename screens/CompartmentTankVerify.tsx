import { View, Text } from 'react-native';
import React from 'react';
import { MainLayout } from '../components/MainLayout';
import { AppStackScreenProps } from '../MainNavigator';

type Props = {};

const CompartmentTankVerify = (props: AppStackScreenProps<'CompartmentTankVerify'>) => {
	return (
		<MainLayout>
			<Text>CompartmentTankVerify</Text>
		</MainLayout>
	);
};

export default CompartmentTankVerify;
