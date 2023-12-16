import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { typography } from '../theme/typography';
import FeatherIcons from '@expo/vector-icons/Feather';
import Toast from 'react-native-toast-message';
import TankInfoTable from '../components/TankInfoTable';
import { AppStackScreenProps, DropdownList, InitialSetupInfo, StationInfo, TankData } from '../utils/types';
import { load, save } from '../utils/storage';
import { useIsFocused } from '@react-navigation/native';

const TankInfo = ({ navigation }: AppStackScreenProps<'TankInfo'>) => {
  const isFocus = useIsFocused();

  const [tableData, setTableData] = useState<TankData[]>();
  const [editable, setEditable] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [stationInfo, setStationInfo] = useState<StationInfo>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchData = async () => {
      try {
        const previousTankData = (await load('tankData')) as TankData[];
        const stationInfo = (await load('stationInfo')) as StationInfo;
        const initialTankInfo = (await load('initialSetup')) as InitialSetupInfo;

        if (previousTankData && previousTankData.length === initialTankInfo.data.length) {
          setTableData(previousTankData);
        } else {
          setTableData(initialTankInfo.data);
        }

        if (stationInfo) {
          setStationInfo(stationInfo);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [isFocus]);

  const saveData = async () => {
    try {
      await save('tankData', tableData);

      Toast.show({
        type: 'success',
        text1: 'Data Saved',
        text2: 'Tank details has been saved 👍🏻',
        position: 'bottom',
        visibilityTime: 2000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error saving data',
        text2: 'Please try again',
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  const verifyAll = () => {
    const verified = tableData?.every((tank) => tank.volume !== '' && tank.volume !== '0' && tank.fuelType !== '');

    if (verified) {
      setIsVerified(true);

      Toast.show({
        type: 'success',
        text1: 'Data Verified',
        text2: 'All data has been verified',
        position: 'bottom',
        visibilityTime: 2000,
      });

      setTimeout(() => {
        navigation.navigate('CompartmentTankVerify');
      }, 2000);
    } else {
      setIsVerified(false);

      Toast.show({
        type: 'error',
        text1: 'Invalid data',
        text2: 'Please fill in all the columns',
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  const handleCompartmentSelect = (item: DropdownList, tankId: string) => {
    const compartment = tableData?.find((data) => data.tankId === tankId);
    if (!compartment) {
      return;
    }
    const updatedData = tableData?.map((data) =>
      data.tankId === tankId
        ? {
            ...data,
            fuelType: item.value,
          }
        : data
    );
    setTableData(updatedData);
  };

  const handleVolumeChange = (id: number, value: string) => {
    const updatedTankData = tableData?.map((tank) => (tank.id === id ? { ...tank, volume: value } : tank));

    const tankWithUpdatedVolume = updatedTankData?.find((tank) => tank.id === id);

    if (!tankWithUpdatedVolume) {
      return;
    }

    if (parseInt(tankWithUpdatedVolume.volume) > parseInt(tankWithUpdatedVolume.maxVolume)) {
      Toast.show({
        type: 'error',
        text1: 'Max volume exceeded',
        text2: `Volume exceeds max volume for tank ${tankWithUpdatedVolume.tankId}. Max ${tankWithUpdatedVolume.maxVolume}`,
        position: 'bottom',
        visibilityTime: 3000,
      });
    }

    setTableData(updatedTankData);
  };

  return (
    <MainLayout stationName={stationInfo?.name}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <View style={{ width: '95%' }}>
            <Pressable
              onPress={() => navigation.navigate('Home')}
              style={{
                backgroundColor: 'rgba(215, 215, 215, 0.8)',
                padding: 2,
                borderRadius: 5,
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 20,
              }}
            >
              <FeatherIcons name="x" size={20} />
            </Pressable>
            <Text style={styles.titleBoxText}>New Discharge</Text>
            <Text
              style={{
                marginTop: 20,
                fontFamily: typography.primary.light,
                fontSize: 17,
              }}
            >
              Please Key In Your Station Tank Latest Details, Tank(T)
            </Text>

            <TankInfoTable
              tableData={tableData ?? []}
              editable={editable}
              handleCompartmentSelect={handleCompartmentSelect}
              handleVolumeChange={handleVolumeChange}
            />
            <Text
              style={{
                marginTop: 5,
                marginBottom: 2,
                fontFamily: typography.primary.light,
                fontSize: 12,
              }}
            >
              *Scroll to the right for more info
            </Text>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginTop: 10,
              }}
            >
              <Pressable
                onPress={() => setEditable(!editable)}
                style={{
                  ...styles.button,
                  backgroundColor: !editable ? 'rgba(4, 113, 232, 1)' : 'gray',
                }}
              >
                <Text style={{ ...styles.buttonText, color: 'white' }}>Edit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '95%',
          gap: 10,
          paddingLeft: 20,
        }}
      >
        <Pressable
          aria-disabled={isVerified}
          onPress={saveData}
          style={{ ...styles.button, backgroundColor: 'rgba(4, 113, 232, 1)' }}
        >
          <Text style={{ ...styles.buttonText, color: 'white' }}>Save</Text>
        </Pressable>
        <Pressable
          onPress={verifyAll}
          style={{
            ...styles.button,
            backgroundColor: 'rgba(215, 215, 215, 0.8)',
          }}
        >
          <Text style={styles.text}>Verify</Text>
        </Pressable>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  box: {
    fontFamily: typography.primary.semibold,
    width: 100,
    height: 40,
    borderWidth: 0.5,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
  },
  text: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
  },
});

export default TankInfo;
