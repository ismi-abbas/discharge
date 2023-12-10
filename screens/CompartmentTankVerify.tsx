import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { AppStackScreenProps } from '../MainNavigator';
import { typography } from '../theme/typography';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { compartmentData, compartmentToTank, tankData } from '../utils/constant';
import FeatherIcons from '@expo/vector-icons/Feather';
import CompartmentVSTankTable, { MergeData } from '../components/CompartmentVSTankTable';
import { TankData } from '../components/TankInfoTable';

const CompartmentTankVerify = ({ navigation }: AppStackScreenProps<'CompartmentTankVerify'>) => {
  const [tankTableData, setTankTableData] = useState<TankData[]>([]);
  const [compartmentTableData, setCompartmentTableData] = useState(compartmentData);
  const [mergedData, setMergedData] = useState<MergeData[]>(compartmentToTank);

  const [editable, setEditable] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const data = await AsyncStorage.multiGet(['tankData', 'mergedData', 'compartmentData']);

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
                compartmentVolume: ''
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

  const calculateTotal = (compartmentVolume: string, tankVolume: string): string => {
    const compartment = parseInt(compartmentVolume) || 0;
    const tank = parseInt(tankVolume) || 0;
    return (compartment + tank).toString();
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
      console.log(mergedData);
    } catch (error) {}
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
    <MainLayout>
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
              setMergedData={setMergedData}
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
    height: 550,
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
    // fontFamily: typography.primary.semibold,
    flex: 1,
    width: 'auto',
    height: 40,
    // backgroundColor: 'rgba(3, 244, 28, 1)',
    borderWidth: 0.5,
    textAlign: 'center'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 22,
    borderRadius: 4
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: typography.primary.medium,
    letterSpacing: 0.25
  }
});

export default CompartmentTankVerify;
