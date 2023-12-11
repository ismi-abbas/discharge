import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { typography } from '../theme/typography';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { compartment, compartmentToTank } from '../utils/constant';
import FeatherIcons from '@expo/vector-icons/Feather';
import CompartmentVSTankTable from '../components/CompartmentVSTankTable';
import { AppStackScreenProps, DropdownList, MergeData, StationInfo, TankData } from '../utils/types';
import { load } from '../utils/storage';

const CompartmentTankVerify = ({ navigation }: AppStackScreenProps<'CompartmentTankVerify'>) => {
  const [tankTableData, setTankTableData] = useState<TankData[]>([]);
  const [compartmentTableData, setCompartmentTableData] = useState(compartment);
  const [mergedData, setMergedData] = useState<MergeData[]>(compartmentToTank);
  const [stationInfo, setStationInfo] = useState<StationInfo>();

  const [editable, setEditable] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.multiGet(['tankData', 'mergedData', 'compartmentData']);
        const stationInfo = (await load('stationInfo')) as StationInfo;

        setStationInfo(stationInfo);
        data.forEach(([key, value]) => {
          if (key === 'tankData') {
            let json: TankData[] = JSON.parse(value!);
            setTankTableData(json);

            let tableD: MergeData[] = [];

            json.map((tank) => {
              tableD.push({
                tankId: tank.tankId,
                id: tank.id,
                tankFuelType: tank.fuelType,
                tankVolume: tank.volume,
                compartmentId: '',
                mergedVolume: '',
                compartmenFuelType: '',
                compartmentVolume: '',
                tankMaxVolume: tank.maxVolume
              });
            });

            setMergedData(tableD);
          } else if (key === 'compartmentData') {
            setCompartmentTableData(JSON.parse(value!));
          }
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleCompartmentSelect = (item: DropdownList, tankId: string) => {
    const compartmentId = item.value;

    const compartment = compartmentTableData.find((data) => data.compartmentId === compartmentId);
    if (!compartment) {
      return;
    }

    const compartmentFuelType = compartment.fuelType || '';
    const volume = compartment.volume || '';

    const updatedData = mergedData?.map((data) =>
      data.tankId === tankId
        ? {
            ...data,
            compartmentId: compartmentId,
            compartmentVolume: volume,
            compartmenFuelType: compartmentFuelType,
            mergedVolume: calculateTotal(volume, data.tankVolume)
          }
        : data
    );

    const currentUpdated = updatedData.find((data) => data.tankId === tankId);

    if (parseInt(currentUpdated?.mergedVolume!) > parseInt(currentUpdated?.tankMaxVolume!)) {
      Toast.show({
        type: 'error',
        text1: `Tank ${currentUpdated?.tankId} Max Volume Exceeded`,
        text2: `Max Volume: ${currentUpdated?.tankMaxVolume}L. Please reduce the volume`,
        position: 'bottom'
      });
    }

    setMergedData(updatedData!);
  };

  const calculateTotal = (compartmentVolume: string, tankVolume: string): string => {
    const compartment = parseInt(compartmentVolume) || 0;
    const tank = parseInt(tankVolume) || 0;
    const result = (compartment + tank).toString();
    return result;
  };

  const saveData = async () => {
    try {
      AsyncStorage.setItem('tankData', JSON.stringify(tankTableData));
      AsyncStorage.setItem('compartmentData', JSON.stringify(compartmentTableData));
      AsyncStorage.setItem('mergedData', JSON.stringify(mergedData));
      mergedData.map((item) => {
        item.mergedVolume = calculateTotal(item.tankVolume, item.compartmentVolume);
      });
      Toast.show({
        type: 'success',
        text1: 'Data Saved',
        text2: 'Tank details has been saved 👍🏻',
        position: 'bottom',
        visibilityTime: 2000
      });
    } catch (error) {}
  };

  const resetData = async () => {
    const resetCompartment = mergedData.map((item) => {
      item.compartmentId = '';
      item.compartmentVolume = '';
      item.compartmenFuelType = '';
      item.mergedVolume = '';
      return item;
    });

    setMergedData(resetCompartment);
  };

  const verifyAll = () => {
    const verified = mergedData.every((x) => x.tankId !== '' && x.mergedVolume !== '');

    if (verified) {
      setIsVerified(true);
      Toast.show({
        type: 'success',
        text1: 'Data Verified',
        text2: 'All data has been verified',
        position: 'bottom',
        visibilityTime: 2000
      });
      setTimeout(() => {
        navigation.navigate('DischargeReport');
      }, 2000);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid data',
        text2: 'Please fill in all the columns',
        position: 'bottom',
        visibilityTime: 2000
      });
      setIsVerified(false);
    }
  };

  return (
    <MainLayout stationName={stationInfo?.name}>
      <View style={styles.dischargeBox}>
        <View style={styles.titleBox}>
          <Pressable
            onPress={() => navigation.navigate('Home')}
            style={{
              backgroundColor: 'rgba(215, 215, 215, 0.8)',
              padding: 2,
              borderRadius: 5,
              position: 'absolute',
              top: 0,
              right: 0
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
                fontFamily: typography.primary.semibold,
                fontSize: 17
              }}
            >
              Truck Compartment (C) to Station Tank (T) Petrol Match
            </Text>

            <Text
              style={{
                marginTop: 20,
                fontFamily: typography.primary.light,
                fontSize: 14
              }}
            >
              Please match Compartment (C)to Tank (V)
            </Text>

            <CompartmentVSTankTable
              tankData={tankTableData}
              setTankData={setTankTableData}
              compartmentData={compartmentTableData}
              setCompartmentData={setCompartmentTableData}
              calculateTotal={calculateTotal}
              handleCompartmentSelect={handleCompartmentSelect}
              mergedData={mergedData}
              editable={editable}
            />
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            marginTop: 20,
            alignItems: 'flex-start',
            width: '95%'
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
              marginTop: 4
            }}
          >
            <Pressable
              onPress={() => {
                setEditable(!editable);
              }}
              style={{
                ...styles.button,
                backgroundColor: !editable ? 'rgba(4, 113, 232, 1)' : 'gray'
              }}
            >
              <Text style={{ ...styles.text, color: 'white' }}>Edit</Text>
            </Pressable>

            <Pressable
              onPress={resetData}
              style={{
                ...styles.button,
                backgroundColor: 'rgba(4, 113, 232, 1)'
              }}
            >
              <Text style={{ ...styles.text, color: 'white' }}>Reset</Text>
            </Pressable>
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
          paddingLeft: 20
        }}
      >
        <Pressable
          aria-disabled={isVerified}
          onPress={saveData}
          style={{ ...styles.button, backgroundColor: 'rgba(4, 113, 232, 1)' }}
        >
          <Text style={{ ...styles.text, color: 'white' }}>Save</Text>
        </Pressable>
        <Pressable
          onPress={verifyAll}
          style={{
            ...styles.button,
            backgroundColor: 'rgba(215, 215, 215, 0.8)'
          }}
        >
          <Text style={styles.text}>Verify</Text>
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
  titleBoxText: {
    fontSize: 20,
    fontFamily: typography.primary.semibold
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly'
  },
  box: {
    flex: 1,
    width: 'auto',
    height: 40,
    borderWidth: 0.5,
    textAlign: 'center'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 4
  },
  text: {
    fontSize: 14,
    fontFamily: typography.primary.medium
  }
});

export default CompartmentTankVerify;
