import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MainLayout } from '../components/MainLayout';
import { typography } from '../theme/typography';
import { load } from '../utils/storage';
import { AppStackScreenProps, ReportData, StationInfo, ViewReportData } from '../utils/types';

const ViewReport = ({ route }: AppStackScreenProps<'ViewReport'>) => {
  const isFocus = useIsFocused();

  const [stationInfo, setStationInfo] = useState<StationInfo>();
  const [reportData, setReportData] = useState<ViewReportData>();

  const calculateUlage = (maxVolume: string, addedVolume: string) => {
    // max value - latest dipped volume
    const ulage = parseInt(maxVolume, 10) - parseInt(addedVolume, 10);
    const final = ulage ? ulage : 0;
    console.log(maxVolume, addedVolume, final);
    return final.toString();
  };

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
          flex: 1,
          width: '100%',
          marginBottom: 20,
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
          <ScrollView style={{ height: '65%' }}>
            <View style={{ borderWidth: 0.5 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {reportData?.report.map((column) => (
                  <View key={column.id}>
                    {/* ======================= */}
                    <View style={styles.box}>
                      <Text style={styles.header}>{column.tankId}</Text>
                    </View>
                    <View style={styles.box}>
                      <Text style={styles.columnText}>{column.tankFuelType}</Text>
                    </View>
                    <View style={styles.box}>
                      <Text style={styles.columnText}>{column.tankVolume.concat('L')}</Text>
                    </View>
                    <View style={styles.box}>
                      <Text style={{ ...styles.columnText, fontStyle: 'italic' }}>
                        {column.tankMaxVolume.concat('L')} Max
                      </Text>
                    </View>

                    {column?.compartmentList.map((item, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <View key={index}>
                        <View style={styles.box}>
                          <Text style={styles.header}>{item.compartmentId !== '' ? item.compartmentId : 'Empty'}</Text>
                        </View>
                        <View
                          style={{
                            ...styles.box,
                            backgroundColor:
                              item.fuelType !== ''
                                ? item.fuelType === column.tankFuelType
                                  ? 'white'
                                  : 'red'
                                : 'white',
                          }}
                        >
                          <Text
                            style={{
                              ...styles.columnText,
                              color:
                                item.fuelType !== ''
                                  ? item.fuelType === column.tankFuelType
                                    ? 'black'
                                    : 'white'
                                  : 'black',
                            }}
                          >
                            {item.fuelType}
                          </Text>
                        </View>
                        <View style={styles.box}>
                          <Text style={styles.columnText}>{item.volume}</Text>
                        </View>
                      </View>
                    ))}

                    <View
                      style={{
                        ...styles.box,
                      }}
                    >
                      <Text style={styles.header}>Added Volume</Text>
                    </View>
                    <View
                      style={{
                        ...styles.box,
                      }}
                    >
                      <Text style={styles.columnText}>{column.addedVolume?.concat('L')}</Text>
                    </View>
                    <View
                      style={{
                        ...styles.box,
                      }}
                    >
                      <Text style={styles.columnText}>
                        {calculateUlage(column.tankMaxVolume, column.addedVolume?.toString() || '0')} Ullage
                      </Text>
                    </View>

                    <View
                      style={{
                        ...styles.box,
                      }}
                    >
                      <Text style={styles.header}>Final Volume</Text>
                    </View>
                    <View
                      style={{
                        ...styles.box,
                        backgroundColor:
                          parseInt(column.tankMaxVolume) - parseInt(column.mergedVolume) < 0 ? 'red' : 'white',
                      }}
                    >
                      <Text
                        style={{
                          ...styles.header,
                          color: parseInt(column.tankMaxVolume) - parseInt(column.mergedVolume) < 0 ? 'white' : 'black',
                        }}
                      >
                        {column.mergedVolume.concat('L')} Total
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
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
