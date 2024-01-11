import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppStackScreenProps, ReportData, StationInfo, ViewReportData } from '../utils/types';
import { load } from '../utils/storage';
import { MainLayout } from '../components/MainLayout';
import { typography } from '../theme/typography';
import { useIsFocused } from '@react-navigation/native';

const ViewReport = ({ route }: AppStackScreenProps<'ViewReport'>) => {
  const isFocus = useIsFocused();

  const [stationInfo, setStationInfo] = useState<StationInfo>();
  const [reportData, setReportData] = useState<ViewReportData>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchData = async () => {
      const reportData = (await load('reportData')) as ReportData[];
      const stationInfoData = (await load('stationInfo')) as StationInfo;

      if (reportData && stationInfoData) {
        const report = reportData.filter((r) => r.reportId === route.params.reportId)[0];

        setReportData({
          date: report.date,
          reportId: route.params.reportId,
          report: report.report,
          stationName: stationInfoData?.name,
          stationLocation: stationInfoData?.address,
          companyLocation: stationInfoData?.companyAddress,
          companyName: stationInfoData?.companyName,
          totalDeliverdVolume: route.params.reportData.totalDelivered,
        });
      }

      setStationInfo(stationInfoData);
    };

    fetchData();
  }, [isFocus]);

  return (
    <MainLayout stationName={stationInfo?.name}>
      <View
        style={{
          display: 'flex',
          width: '100%',
        }}
      >
        <View style={styles.infoBox}>
          <Text
            style={{
              fontSize: 24,
              textAlign: 'center',
              fontFamily: typography.primary.semibold,
            }}
          >
            Report Details
          </Text>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 16 }}>Station Name: {reportData?.stationName}</Text>
            <Text style={{ fontSize: 16 }}>Station Location: {reportData?.stationLocation}</Text>
            <Text style={{ fontSize: 16 }}>Company Name: {reportData?.companyName}</Text>
            <Text style={{ fontSize: 16 }}>Company Name: {reportData?.companyLocation}</Text>
          </View>
        </View>
        <View style={styles.infoBox}>
          <View style={{ marginTop: 20 }}>
            <View style={{ borderWidth: 0.5 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {reportData?.report.map((column) => (
                  <View key={column.id}>
                    <View style={styles.box}>
                      <Text style={styles.header}>{column.tankId}</Text>
                    </View>
                    <View style={styles.box}>
                      <Text style={styles.columnText}>{column.tankFuelType}</Text>
                    </View>
                    <View style={{ ...styles.box, marginTop: 40 }}>
                      <Text style={styles.columnText}>{column.compartmentId}</Text>
                    </View>
                    <View
                      style={{
                        ...styles.box,
                      }}
                    >
                      <Text style={styles.columnText}>
                        {parseInt(column.compartmentVolume) > 0
                          ? column.compartmentVolume.concat('L')
                          : '0'.concat('L')}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginTop: 40,
                        ...styles.box,
                      }}
                    >
                      <Text style={styles.columnText}>{column.mergedVolume.concat('L')}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: 240,
                zIndex: -10,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: typography.primary.bold,
                  textAlign: 'center',
                  color: 'black',
                  top: '38%',
                }}
              >
                Delivery Order
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: typography.primary.bold,
                  textAlign: 'center',
                  color: 'black',
                  top: '79%',
                }}
              >
                Final Volume at Tank
              </Text>
            </View>
          </View>
        </View>
      </View>
    </MainLayout>
  );
};

export default ViewReport;

const styles = StyleSheet.create({
  infoBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '95%',
    minWidth: '95%',
    marginTop: 20,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  reportDetailText: {
    fontFamily: typography.primary.medium,
  },
  box: {
    justifyContent: 'center',
    width: 110,
    borderWidth: 0.5,
    height: 40,
    backgroundColor: '#fff',
  },
  columnText: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
    textAlign: 'center',
    color: 'black',
  },
  header: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
    textAlign: 'center',
    color: 'black',
  },
});
