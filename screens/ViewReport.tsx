import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { AppStackScreenProps, ReportData, StationInfo, ViewReportData } from '../utils/types';
import { load } from '../utils/storage';
import { MainLayout } from '../components/MainLayout';
import { format } from 'date-fns';
import { typography } from '../theme/typography';
import { useFocusEffect } from '@react-navigation/native';

const ViewReport = ({ navigation, route }: AppStackScreenProps<'ViewReport'>) => {
  const [stationInfo, setStationInfo] = useState<StationInfo>();
  const [reportData, setReportData] = useState<ViewReportData>();

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    const reportData = (await load('reportData')) as ReportData[];
    const stationInfoData = (await load('stationInfo')) as StationInfo;

    if (reportData && stationInfoData) {
      setReportData({
        date: reportData.filter((r) => r.reportId === route.params.reportId)[0].date,
        reportId: route.params.reportId,
        report: reportData.filter((r) => r.reportId === route.params.reportId)[0].report,
        stationName: stationInfo?.name!,
        stationLocation: stationInfo?.address!,
        companyLocation: stationInfo?.companyAddress!,
        companyName: stationInfo?.companyName!
      });

      setStationInfo(stationInfoData);
    }
  };
  return (
    <MainLayout stationName={stationInfo?.name}>
      <View
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            fontFamily: typography.primary.medium,
            fontSize: 14
          }}
        >
          {reportData?.stationName}
        </Text>
        <Text
          style={{
            fontFamily: typography.primary.medium,
            fontSize: 14
          }}
        >
          {reportData?.stationLocation}
        </Text>
        <Text
          style={{
            fontFamily: typography.primary.medium,
            fontSize: 14
          }}
        >
          {reportData?.date.toString()}
        </Text>

        <View
          style={{
            width: '90%',
            display: 'flex',
            alignItems: 'center',
            marginTop: 20,
            borderRadius: 20,
            paddingHorizontal: 50,
            paddingVertical: 20,
            backgroundColor: '#fff'
          }}
        >
          {reportData?.report.map((item) => (
            <View
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <Text>{item.tankId}</Text>
              <Text>{item.tankFuelType}</Text>
              <Text>{item.tankVolume}</Text>
              <Text>{item.compartmentId}</Text>
              <Text>{item.compartmentVolume}</Text>
            </View>
          ))}
        </View>
      </View>
    </MainLayout>
  );
};

export default ViewReport;

const styles = StyleSheet.create({});
