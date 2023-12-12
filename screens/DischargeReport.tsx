import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { typography } from '../theme/typography';
import Toast from 'react-native-toast-message';
import { compartmentToTank } from '../utils/constant';
import FeatherIcons from '@expo/vector-icons/Feather';
import { AppStackScreenProps, MergeData, ReportData, StationInfo } from '../utils/types';
import { load, save } from '../utils/storage';
import uuid from 'react-native-uuid';

const DischargeReport = ({ navigation }: AppStackScreenProps<'DischargeReport'>) => {
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
          text2: 'No previous data found'
        });
      }
    };

    getAllData();
  }, []);

  const verifyAll = async () => {
    // const reportExist = reportListData?.find((data) => data.reportId === currentId);

    // if (reportExist) {
    //   return;
    // }

    const newReport: ReportData = {
      reportId: uuid.v4().toString(),
      date: new Date(),
      report: finalReportData
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
        visibilityTime: 2000
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
              zIndex: 10
            }}
          >
            <FeatherIcons
              name="x"
              size={20}
            />
          </Pressable>
          <View>
            <Text style={styles.titleBoxText}>New Discharge</Text>
            <Text
              style={{
                marginTop: 20,
                fontFamily: typography.primary.bold,
                fontSize: 20
              }}
            >
              Discharge Report
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 5, borderWidth: 0.5 }}>
          <ScrollView horizontal>
            {finalReportData?.map((column) => (
              <View key={column.id}>
                <View style={styles.box}>
                  <Text style={styles.header}>{column.tankId}</Text>
                </View>
                <View style={styles.box}>
                  <Text style={styles.columnText}>{column.tankFuelType}</Text>
                </View>
                <View
                  style={{
                    marginTop: 40,
                    ...styles.box
                  }}
                >
                  <Text style={styles.columnText}>
                    {parseInt(column.compartmentVolume) > 0 ? column.compartmentVolume.concat('L') : '0'.concat('L')}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 40,
                    ...styles.box
                  }}
                >
                  <Text style={styles.columnText}>{column.mergedVolume.concat('L')}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: 240,
              zIndex: -10,
              borderRightWidth: 0.5,
              borderLeftWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: typography.primary.bold,
                textAlign: 'center',
                color: 'black',
                top: '37%'
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
                top: '62%'
              }}
            >
              Final Volume at Tank
            </Text>
          </View>
        </View>
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
          paddingLeft: 20
        }}
      >
        <Pressable onPress={verifyAll}>
          <Text
            style={{
              ...styles.text,
              backgroundColor: 'rgba(208, 208, 208, 1)'
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
    width: '95%'
  },
  titleBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  box: {
    justifyContent: 'center',
    width: 100,
    borderWidth: 0.5,
    height: 40,
    backgroundColor: '#fff'
  },
  titleBoxText: {
    fontSize: 20,
    fontFamily: typography.primary.semibold
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 22,
    borderRadius: 4
  },
  text: {
    fontSize: 20,
    lineHeight: 21,
    fontFamily: typography.primary.normal,
    letterSpacing: 0.25,
    padding: 5,
    borderRadius: 5
  },
  columnText: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
    textAlign: 'center',
    color: 'black'
  },
  header: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
    textAlign: 'center',
    color: 'black'
  },
  itemBox: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
    height: 40,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default DischargeReport;
