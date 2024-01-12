import FeatherIcons from '@expo/vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import { MainLayout } from '../components/MainLayout';
import { typography } from '../theme/typography';
import { compartmentToTank } from '../utils/constant';
import { load, save } from '../utils/storage';
import { AppStackScreenProps, MergeData, ReportData, StationInfo } from '../utils/types';

const DischargeReport = ({ navigation }: AppStackScreenProps<'DischargeReport'>) => {
  const isFocus = useIsFocused();

  const [finalReportData, setFinalReportData] = useState(compartmentToTank);
  const [reportListData, setReportListData] = useState<ReportData[]>();
  const [stationInfo, setStationInfo] = useState<StationInfo>();

  useEffect(() => {
    const getAllData = async () => {
      try {
        const stationInfoData = (await load('stationInfo')) as StationInfo;
        const completedData = (await load('mergedData')) as MergeData[];
        const reportListData = (await load('reportData')) as ReportData[];

        console.log(completedData);

        setFinalReportData(completedData);
        setReportListData(reportListData);
        setStationInfo(stationInfoData);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Data load',
          text2: 'No previous data found',
        });
      }
    };

    getAllData();
  }, [isFocus]);

  const verifyAll = async () => {
    const newReport: ReportData = {
      reportId: uuid.v4().toString(),
      date: new Date(),
      report: finalReportData,
    };

    const updatedReportList = [...(reportListData || []), newReport];

    setReportListData(updatedReportList);

    try {
      await save('reportData', updatedReportList);

      Toast.show({
        type: 'success',
        text1: 'Data verified',
        text2: 'All data has been saved and verified successfully',
        position: 'bottom',
        visibilityTime: 2000,
      });

      setTimeout(() => {
        navigation.navigate('Home');
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout stationName={stationInfo?.name}>
      <View style={styles.dischargeBox}>
        <View style={styles.titleBox}>
          <Pressable
            onPress={() => {
              navigation.navigate('Home');
            }}
            style={{
              backgroundColor: 'rgba(215, 215, 215, 0.8)',
              padding: 2,
              borderRadius: 5,
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 10,
            }}
          >
            <FeatherIcons name="x" size={20} />
          </Pressable>
          <View>
            <Text style={styles.titleBoxText}>New Discharge</Text>
            <Text
              style={{
                marginTop: 20,
                fontFamily: typography.primary.semibold,
                fontSize: 20,
              }}
            >
              Discharge Report
            </Text>
          </View>
        </View>

        <ScrollView style={{ marginTop: 20, height: 500 }}>
          <View style={{ borderWidth: 0.5 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {finalReportData?.map((column) => (
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
                    <View key={index}>
                      <View style={styles.box}>
                        <Text style={styles.header}>{item.compartmentId !== '' ? item.compartmentId : 'Empty'}</Text>
                      </View>
                      <View
                        style={{
                          ...styles.box,
                          backgroundColor:
                            item.fuelType !== '' ? (item.fuelType === column.tankFuelType ? 'white' : 'red') : 'white',
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
                    <Text style={styles.columnText}>{column.tankVolume.concat('L')}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.box,
                    }}
                  >
                    <Text style={styles.columnText}>{column.tankVolume} Ulage</Text>
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
                    }}
                  >
                    <Text style={styles.header}>{column.mergedVolume.concat('L')} Total</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Delivery order and final volume text */}
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
                top: '37%',
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
                top: '62%',
              }}
            >
              Final Volume at Tank
            </Text>
          </View>
        </ScrollView>
      </View>

      <View
        style={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '85%',
          gap: 10,
          paddingLeft: 20,
        }}
      >
        <Pressable onPress={verifyAll}>
          <Text
            style={{
              ...styles.text,
              backgroundColor: 'rgba(208, 208, 208, 1)',
            }}
          >
            Verify and Close Report
          </Text>
        </Pressable>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  dischargeBox: {
    padding: 20,
    display: 'flex',
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    width: '95%',
  },
  titleBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    justifyContent: 'center',
    width: 110,
    borderWidth: 0.5,
    height: 40,
    backgroundColor: '#fff',
  },
  titleBoxText: {
    fontSize: 20,
    fontFamily: typography.primary.semibold,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 22,
    borderRadius: 4,
  },
  text: {
    fontSize: 20,
    lineHeight: 21,
    fontFamily: typography.primary.normal,
    letterSpacing: 0.25,
    padding: 5,
    borderRadius: 5,
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
  itemBox: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
    height: 40,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DischargeReport;
