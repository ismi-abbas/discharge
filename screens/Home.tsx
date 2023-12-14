import { View, TouchableOpacity, Text, SectionList, StyleSheet, Pressable } from 'react-native';
import FeatherIcons from '@expo/vector-icons/Feather';
import { typography } from '../theme/typography';
import { MainLayout } from '../components/MainLayout';
import { useEffect, useState } from 'react';
import { load } from '../utils/storage';
import { AppStackScreenProps, ReportData, ResultItem, StationInfo } from '../utils/types';
import { format } from 'date-fns';
import { useIsFocused } from '@react-navigation/native';

export const Home = ({ navigation }: AppStackScreenProps<'Home'>) => {
  const isFocus = useIsFocused();

  const [stationInfo, setStationInfo] = useState<StationInfo>();
  const [listData, setListData] = useState<ResultItem[]>();

  useEffect(() => {
    fetchData();
  }, [isFocus]);

  const fetchData = async () => {
    try {
      const reportData = (await load('reportData')) as ReportData[];
      const stationInfoData = (await load('stationInfo')) as StationInfo;

      if (reportData) {
        let totalCompartmentBefore: number = 0;
        let totalTankVolumeBefore: number = 0;

        const totalsByDate = reportData.reduce((result, array) => {
          const date = array.date;

          const { totalTankVolume, totalAddedCompartmentVolumne } = array.report.reduce(
            (accumulator, tank) => {
              accumulator.totalTankVolume += parseInt(tank.tankVolume) || 0;
              accumulator.totalAddedCompartmentVolumne += parseInt(tank.compartmentVolume) || 0;
              return accumulator;
            },
            { totalTankVolume: 0, totalAddedCompartmentVolumne: 0 }
          );

          totalCompartmentBefore = +totalAddedCompartmentVolumne;
          totalTankVolumeBefore = +totalTankVolume;

          result.push({
            reportId: array.reportId,
            date,
            totalTankVolume,
            totalAddedCompartmentVolumne,
            status: 'normal',
            totalCurrentTankVolume: totalTankVolumeBefore,
          });

          console.log(result);
          return result;
        }, [] as ResultItem[]);

        console.log(totalCompartmentBefore, totalTankVolumeBefore);

        setListData(totalsByDate);
        setListData(totalsByDate);
        setListData(totalsByDate);
      }

      if (stationInfoData) {
        setStationInfo(stationInfoData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout
      stationName={stationInfo?.name!}
      openSettings={() => navigation.navigate('OneTimeSetup', { fromScreen: true })}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CompartmentInfo')}
          style={styles.newItemBox}
        >
          <View>
            <Text style={styles.newItemText}>New Discharge</Text>
          </View>
          <View>
            <FeatherIcons
              name="chevron-down"
              size={25}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.sortingTab}>
          <View style={styles.sortingTabItem}>
            <FeatherIcons
              name="chevron-up"
              size={20}
            />
            <Text
              style={{
                fontSize: 15,
              }}
            >
              Sort By
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 15,
              }}
            >
              Last 25h
            </Text>
            <FeatherIcons
              name="chevron-down"
              size={20}
            />
          </View>
        </View>

        <SectionList
          style={styles.sectionListBox}
          showsVerticalScrollIndicator={false}
          sections={[{ data: listData ? listData : [] }]}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                navigation.navigate('ViewReport', {
                  reportId: item.reportId,
                  reportData: {
                    totalDelivered: item.totalAddedCompartmentVolumne,
                  },
                });
                console.log(item);
              }}
              style={styles.dischargeBoxItem}
            >
              <View
                style={{
                  ...styles.statusIcon,
                  backgroundColor: `${item.status === 'normal' ? 'rgba(0, 186, 78, 1)' : 'rgba(255, 216, 45, 1)'}`,
                }}
              >
                <FeatherIcons
                  name="dollar-sign"
                  size={30}
                  color="white"
                />
              </View>
              <View>
                <Text style={{ ...styles.textSemiBold, fontSize: 15 }}>{format(new Date(item.date), 'dd-MMM-yy')}</Text>
                {/* Total Current Compartment volumne */}
                <Text>{item.totalTankVolume} Litre</Text>
              </View>
              <View>
                {/* Current Tank Volume */}
                <Text style={{ ...styles.textSemiBold, fontSize: 15 }}>{item.totalCurrentTankVolume}L</Text>
                {/* additional total compartment volume */}
                <Text style={styles.amountIndicatorText}>{item.totalAddedCompartmentVolumne}L</Text>
              </View>
            </Pressable>
          )}
        />
      </View>
    </MainLayout>
  );
};
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#EAECEC',
  },
  newItemBox: {
    display: 'flex',
    minWidth: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 200,
  },
  text: {
    fontFamily: typography.primary.normal,
  },
  image: {
    display: 'flex',
    width: 50,
    height: 50,
    backgroundColor: '#0553',
    borderRadius: 50,
  },
  bar: {
    display: 'flex',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    height: 90,
  },
  barTitle: {
    fontFamily: typography.primary.medium,
    fontSize: 25,
  },
  newItemText: {
    fontFamily: typography.primary.semibold,
    fontSize: 25,
  },
  dischargeRecordBox: {
    width: '90%',
  },
  dischargeBoxItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusIcon: {
    backgroundColor: 'rgba(255, 216, 45, 1);',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  textSemiBold: {
    fontFamily: typography.primary.semibold,
  },
  amountIndicatorText: {
    color: 'rgb(0, 186, 78)',
  },
  sectionListBox: {
    width: '95%',
    minWidth: '95%',
  },
  sortingTab: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    minWidth: '90%',
    maxWidth: '90%',
    justifyContent: 'space-between',
  },
  sortingTabItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
