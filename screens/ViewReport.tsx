import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppStackScreenProps, ReportData, StationInfo } from '../utils/types';
import { load } from '../utils/storage';
import { MainLayout } from '../components/MainLayout';

const ViewReport = ({ navigation, route }: AppStackScreenProps<'ViewReport'>) => {
  const [stationInfo, setStationInfo] = useState<StationInfo>();

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    const reportData = (await load('reportData')) as ReportData[];
    const stationInfoData = (await load('stationInfo')) as StationInfo;

    setStationInfo(stationInfoData);
  };
  return (
    <MainLayout stationName={stationInfo?.name}>
      <Text>ViewReport</Text>
    </MainLayout>
  );
};

export default ViewReport;

const styles = StyleSheet.create({});
