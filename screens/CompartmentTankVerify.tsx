import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { typography } from '../theme/typography';
import Toast from 'react-native-toast-message';
import FeatherIcons from '@expo/vector-icons/Feather';
import CompartmentVSTankTable from '../components/CompartmentVSTankTable';
import { AppStackScreenProps, CompartmentData, DropdownList, MergeData, StationInfo, TankData } from '../utils/types';
import { load, save } from '../utils/storage';
import { useIsFocused } from '@react-navigation/native';

const CompartmentTankVerify = ({ navigation }: AppStackScreenProps<'CompartmentTankVerify'>) => {
  const isFocus = useIsFocused();

  const [tankTableData, setTankTableData] = useState<TankData[]>([]);
  const [compartmentTableData, setCompartmentTableData] = useState<CompartmentData[]>([]);
  const [mergedData, setMergedData] = useState<MergeData[]>([]);
  const [stationInfo, setStationInfo] = useState<StationInfo>();
  const [dropdownList, setDropdownList] = useState<DropdownList[]>([]);

  const [editable, setEditable] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stationInfo = (await load('stationInfo')) as StationInfo;
        const tankData = (await load('tankData')) as TankData[];
        const compartmentData = (await load('compartmentData')) as CompartmentData[];

        setCompartmentTableData(compartmentData);
        setTankTableData(tankData);
        setStationInfo(stationInfo);

        let mergedData: MergeData[] = [];

        tankData.map((tank) => {
          mergedData.push({
            tankId: tank.tankId,
            id: tank.id,
            tankFuelType: tank.fuelType,
            tankVolume: tank.volume,
            compartmentId: '',
            mergedVolume: '',
            compartmenFuelType: '',
            compartmentVolume: '',
            tankMaxVolume: tank.maxVolume,
          });
        });

        let newDropdownList: DropdownList[] = compartmentData.map((data) => ({
          label: data.compartmentId,
          value: data.compartmentId,
        }));

        let emptyValue = {
          label: 'Empty',
          value: '',
        };

        newDropdownList.push(emptyValue);

        setDropdownList(newDropdownList);
        setMergedData(mergedData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [isFocus]);

  const handleCompartmentSelect = (item: DropdownList, tankId: string) => {
    const compartmentId = item.value;

    if (compartmentId === '') {
      setMergedData(
        mergedData?.map((data) =>
          data.tankId === tankId
            ? {
                ...data,
                compartmentId: '',
                compartmentVolume: '',
                compartmenFuelType: '',
                mergedVolume: '',
              }
            : data
        )
      );
    }

    const compartment = compartmentTableData.find((data) => data.compartmentId === compartmentId);
    if (!compartment) {
      return;
    }

    const compartmentFuelType = compartment.fuelType || '';
    const volume = compartment.volume || '';

    const updatedData = mergedData.map((data) =>
      data.tankId === tankId
        ? {
            ...data,
            compartmentId: compartmentId,
            compartmentVolume: volume,
            compartmenFuelType: compartmentFuelType,
            mergedVolume: calculateTotal(volume, data.tankVolume),
          }
        : data
    );

    const currentUpdated = updatedData.find((data) => data.tankId === tankId);

    if (parseInt(currentUpdated?.mergedVolume!) > parseInt(currentUpdated?.tankMaxVolume!)) {
      Toast.show({
        type: 'error',
        text1: `Tank ${currentUpdated?.tankId} Max Volume Exceeded`,
        text2: `Max Volume: ${currentUpdated?.tankMaxVolume}L. Please reduce the volume`,
        position: 'bottom',
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
      const updated = mergedData.map((data) => {
        if (data.mergedVolume === '') {
          data.mergedVolume = calculateTotal(data.tankVolume, data.compartmentVolume).toString();
        }
        return data;
      });

      setMergedData(updated);

      await save('tankData', tankTableData);
      await save('compartmentData', compartmentTableData);
      await save('mergedData', mergedData);

      Toast.show({
        type: 'success',
        text1: 'Data Saved',
        text2: 'Tank details has been saved 👍🏻',
        position: 'bottom',
        visibilityTime: 2000,
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
    let verified = mergedData.every(
      (x) => x.tankId !== '' && x.mergedVolume !== '' && parseInt(x.mergedVolume) < parseInt(x.tankMaxVolume)
    );

    if (verified) {
      for (let i = 0; i < mergedData.length; i++) {
        const currentElement = mergedData[i];
        const currentCompartmentName = currentElement.compartmentId;
        const currentTankName = currentElement.tankId;

        for (let j = 0; j < i; j++) {
          const compareElement = mergedData[j];

          const compareCompartmentName = compareElement.compartmentId;

          const compareTankName = compareElement.tankId;

          console.log({
            currentCompartmentName,
            compareCompartmentName,
          });

          if (currentCompartmentName !== '' && compareCompartmentName !== '') {
            if (currentCompartmentName === compareCompartmentName) {
              Toast.show({
                type: 'error',
                text1: 'Same compartmentId found',
                text2: `Found tanks with the same compartment: ${currentTankName} and ${compareTankName}`,
                position: 'bottom',
                visibilityTime: 2000,
              });

              verified = false;

              return;
            } else {
              verified = true;
            }
          }
        }
      }
    }

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
        navigation.navigate('DischargeReport', { reportData: [] });
      }, 2000);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid data',
        text2: 'Please fill in all the columns',
        position: 'bottom',
        visibilityTime: 2000,
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
              right: 0,
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
                fontSize: 17,
              }}
            >
              Truck Compartment (C) to Station Tank (T) Petrol Match
            </Text>

            <Text
              style={{
                marginTop: 20,
                fontFamily: typography.primary.light,
                fontSize: 14,
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
              dropdownList={dropdownList}
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
            width: '95%',
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
              marginTop: 4,
            }}
          >
            <Pressable
              onPress={() => {
                setEditable(!editable);
              }}
              style={{
                ...styles.button,
                backgroundColor: !editable ? 'rgba(4, 113, 232, 1)' : 'gray',
              }}
            >
              <Text style={{ ...styles.text, color: 'white' }}>Edit</Text>
            </Pressable>

            <Pressable
              onPress={resetData}
              style={{
                ...styles.button,
                backgroundColor: 'rgba(4, 113, 232, 1)',
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
          paddingLeft: 20,
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
    flex: 1,
    width: 'auto',
    height: 40,
    borderWidth: 0.5,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  text: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
  },
});

export default CompartmentTankVerify;
