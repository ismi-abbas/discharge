import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { typography } from '../theme/typography';
import Toast, { ToastShowParams } from 'react-native-toast-message';
import FeatherIcons from '@expo/vector-icons/Feather';
import CompartmentVSTankTable from '../components/CompartmentVSTankTable';
import { AppStackScreenProps, CompartmentData, DropdownList, MergeData, StationInfo, TankData } from '../utils/types';
import { load, save } from '../utils/storage';
import { useIsFocused } from '@react-navigation/native';
import { APP_TEXT } from '../utils/constant';

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

        const mergedData: MergeData[] = [];

        tankData.map((tank) => {
          mergedData.push({
            tankId: tank.tankId,
            id: tank.id,
            tankFuelType: tank.fuelType,
            tankVolume: tank.volume,
            compartmentId: '',
            compartmentList: [
              { compartmentId: '', fuelType: '', id: null, volume: '' },
              { compartmentId: '', fuelType: '', id: null, volume: '' },
              { compartmentId: '', fuelType: '', id: null, volume: '' },
              { compartmentId: '', fuelType: '', id: null, volume: '' },
              { compartmentId: '', fuelType: '', id: null, volume: '' },
              { compartmentId: '', fuelType: '', id: null, volume: '' },
            ],
            mergedVolume: '',
            compartmentFuelType: '',
            compartmentVolume: '',
            tankMaxVolume: tank.maxVolume,
          });
        });

        const newDropdownList: DropdownList[] = compartmentData.map((data) => ({
          label: data.compartmentId,
          value: data.compartmentId,
        }));

        const emptyValue = {
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

  const handleCompartmentSelect = (item: DropdownList, tankId: string, compartmentIndex: number) => {
    const compartmentId = item.value;

    if (compartmentId === '') {
      setMergedData(
        mergedData?.map((data) => {
          if (data.tankId === tankId) {
            const indexToUpdate = compartmentIndex;

            data.compartmentList.splice(indexToUpdate, 1, {
              compartmentId,
              fuelType: '',
              id: compartmentIndex,
              volume: '',
            });

            const totalAddedCompartment = data.compartmentList.reduce((acc, currentValue) => {
              const volume = currentValue.volume === '' ? '0' : currentValue.volume;
              return acc + parseInt(volume);
            }, 0);

            return {
              ...data,
              compartmentId: compartmentId,
              compartmentList: data.compartmentList,
              compartmentVolume: volume,
              compartmentFuelType,
              mergedVolume: (totalAddedCompartment + parseInt(data.tankVolume)).toString(),
            };
          }
          return data;
        })
      );
    }

    const compartment = compartmentTableData.find((data) => data.compartmentId === compartmentId);

    if (!compartment) {
      return;
    }

    const compartmentFuelType = compartment.fuelType;
    const volume = !compartmentId ? '' : compartment.volume;

    const updatedData = mergedData.map((data) => {
      if (data.tankId === tankId) {
        const indexToUpdate = compartmentIndex;

        data.compartmentList.splice(indexToUpdate, 1, {
          compartmentId,
          fuelType: compartmentFuelType,
          id: compartmentIndex,
          volume: volume,
        });

        const totalAddedCompartment = data.compartmentList.reduce((acc, currentValue) => {
          const volume = currentValue.volume === '' ? '0' : currentValue.volume;
          return acc + parseInt(volume);
        }, 0);

        return {
          ...data,
          compartmentId: compartmentId,
          compartmentList: data.compartmentList,
          compartmentVolume: volume,
          compartmentFuelType,
          mergedVolume: (totalAddedCompartment + parseInt(data.tankVolume)).toString(),
        };
      }
      return data;
    });

    const currentUpdated = updatedData.find((data) => data.tankId === tankId);

    if (!currentUpdated) {
      return;
    }

    setMergedData(updatedData);
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

      console.log(updated);

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

      setTimeout(() => {
        navigation.navigate('DischargeReport', { reportData: [] });
      }, 2000);
    } catch (error) {}
  };

  const resetData = async () => {
    const resetCompartment = mergedData.map((item) => {
      item.compartmentId = '';
      item.compartmentVolume = '';
      item.compartmentFuelType = '';
      item.mergedVolume = '';
      return item;
    });

    setMergedData(resetCompartment);
  };

  // const verifyAll = () => {
  //   const errors: ToastShowParams[] = [];
  //   let isVerified = true;

  //   for (let i = 0; i < mergedData.length; i++) {
  //     const currentElement = mergedData[i];

  //     // check if values are filled in, not necessary, but need 1 to be filled
  //     if (!currentElement.tankId && !currentElement.mergedVolume) {
  //       errors.push({
  //         type: 'error',
  //         text1: 'Empty values',
  //         text2: `Please fill in at least one value for row ${i + 1}`,
  //         position: 'bottom',
  //       });
  //       isVerified = false;
  //     }

  //     // mergedVolume cannot exceed the maxVolume
  //     if (parseInt(currentElement.mergedVolume) > parseInt(currentElement.tankMaxVolume)) {
  //       errors.push({
  //         type: 'error',
  //         text1: `Exceeded volume for tank ${currentElement.tankId}`,
  //         text2: 'Please reduce the volume',
  //         position: 'bottom',
  //       });
  //       isVerified = false;
  //     }

  //     // if column has chosen the compartmentFuelType, check to make sure it matches the tankFuelType
  //     if (currentElement.compartmentFuelType && currentElement.compartmentFuelType !== currentElement.tankFuelType) {
  //       errors.push({
  //         type: 'error',
  //         text1: `Fuel type mismatch for tank ${currentElement.tankId}`,
  //         text2: 'Please change the fuel type',
  //         position: 'bottom',
  //       });
  //       isVerified = false;
  //     }

  //     const currentCompartmentName = currentElement.compartmentId;
  //     const currentTankName = currentElement.tankId;

  //     for (let j = 0; j < i; j++) {
  //       const compareElement = mergedData[j];
  //       const { compartmentId: compareCompartmentName, tankId: compareTankName } = compareElement;

  //       if (currentCompartmentName !== '' && compareCompartmentName !== '') {
  //         if (currentCompartmentName === compareCompartmentName) {
  //           errors.push({
  //             type: 'error',
  //             text1: 'Same compartmentId found',
  //             text2: `Found tanks with the same compartment: ${currentTankName} and ${compareTankName}`,
  //             position: 'bottom',
  //             visibilityTime: 2000,
  //           });

  //           isVerified = false;
  //         }
  //       }
  //     }

  //     // mergedVolume cannot be empty, at least a value from the tankVolume
  //     if (!currentElement.mergedVolume) {
  //       errors.push({
  //         type: 'error',
  //         text1: `Empty merged volume for tank ${currentElement.tankId}`,
  //         text2: 'Please fill in the merged volume',
  //         position: 'bottom',
  //       });
  //       isVerified = false;
  //     }

  //     if (!isVerified) break;
  //   }

  //   if (isVerified) {
  //     setIsVerified(true);
  //     Toast.show({
  //       type: 'success',
  //       text1: 'Data Verified',
  //       text2: 'All data has been verified',
  //       position: 'bottom',
  //       visibilityTime: 2000,
  //     });

  //     setTimeout(() => {
  //       navigation.navigate('DischargeReport', { reportData: [] });
  //     }, 2000);
  //   } else {
  //     // Display the first error message
  //     Toast.show(errors[0]);
  //     setIsVerified(false);
  //   }
  // };

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
              {APP_TEXT.COMPARTMENT_TANK_VERIFY_TEXT}
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

            <ScrollView
              style={{ height: 400 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
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
            </ScrollView>
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
        {/* <Pressable
          onPress={verifyAll}
          style={{
            ...styles.button,
            backgroundColor: 'rgba(215, 215, 215, 0.8)',
          }}
        >
          <Text style={styles.text}>Verify</Text>
        </Pressable> */}
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
