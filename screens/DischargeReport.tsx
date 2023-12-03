import { View, Text } from 'react-native';
import React from 'react';
import { AppStackScreenProps } from '../MainNavigator';
import { MainLayout } from '../components/MainLayout';

type Props = {};

const DischargeReport = (props: AppStackScreenProps<'DischargeReport'>) => {
	return (
		<MainLayout>
			<Text>DischargeReport</Text>
		</MainLayout>
	);
};

export default DischargeReport;
