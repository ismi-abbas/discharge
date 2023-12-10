import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MainLayout } from '../components/MainLayout';
import FeatherIcons from '@expo/vector-icons/Feather';
import { typography } from '../theme/typography';
import { compartmentData } from '../utils/constant';
import CompartmentInfoTable from '../components/CompartmentInfoTable';
import Toast from 'react-native-toast-message';
import { load, save } from '../utils/storage';
import { AppStackScreenProps, CompartmentData, DropdownList, StationInfo } from '../utils/types';

const CompartmentInfo = ({ navigation }: AppStackScreenProps<'CompartmentInfo'>) => {
  const [stationInfo, setStationInfo] = useState<StationInfo>();
  const [editable, setEditable] = useState(false);
  const [isSaved, setSaved] = useState(false);
  const [tableData, setTableData] = useState<CompartmentData[] | undefined>(compartmentData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await load('compartmentData')) as CompartmentData[];
        const stationInfo = (await load('stationInfo')) as StationInfo;

        setTableData(data);
        setStationInfo(stationInfo);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const saveData = async () => {
    try {
      await save('compartmentData', tableData);

      setSaved(true);

      Toast.show({
        type: 'success',
        text1: 'Data Saved',
        text2: 'Tank details has been saved 👍🏻',
        position: 'bottom',
        visibilityTime: 2000
      });
      console.log(tableData);
    } catch (error) {}
  };

  const handleCompartment = (action: string) => {
    if (action === 'add') {
      const id = (tableData?.length || 0) + 1;

      const newCompartment: CompartmentData = {
        compartmentId: 'C' + id.toString(),
        fuelType: '',
        id: (tableData?.length || 0) + 1,
        volume: '0'
      };
      const updatedTableData = [...(tableData || []), newCompartment];
      setTableData(updatedTableData);

      Toast.show({
        type: 'success',
        text1: 'Add Compartment',
        text2: 'New compartment added',
        position: 'bottom'
      });
    } else if (action === 'remove') {
      if (tableData && tableData.length > 0) {
        const updatedTableData = tableData.slice(0, -1);
        setTableData(updatedTableData);

        Toast.show({
          type: 'success',
          text1: 'Remove Compartment',
          text2: `Compartment has been removed`,
          position: 'bottom'
        });
      }
    }
  };

  const verifyAll = () => {
    const verified = tableData?.every((data) => data.fuelType !== '' && data.volume !== '');

    if (verified) {
      Toast.show({
        type: 'success',
        text1: 'Data Verified',
        text2: 'Tank details has been saved 👍🏻',
        position: 'bottom',
        visibilityTime: 2000
      });
      setTimeout(() => {
        navigation.navigate('TankInfo');
      }, 1500);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Data Error',
        text2: 'Please fill up all columns',
        position: 'bottom',
        visibilityTime: 2000
      });
    }
  };

  const handleFuelTypeChange = (rowIndex: number, col: string, value: string) => {
    const updatedData = tableData?.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          [col]: value
        };
      }
      return row;
    });

    setTableData(updatedData);
  };

  const handleVolumeChange = (id: number, value: string) => {
    const updatedData = tableData?.map((compartment) =>
      compartment.id === id ? { ...compartment, volume: value } : compartment
    );

    setTableData(updatedData);
  };

  const handleCompartmentSelect = (item: DropdownList, compartmentId: string) => {
    const compartment = tableData?.find((data) => data.compartmentId === compartmentId);
    if (!compartment) {
      return;
    }
    const updatedData = tableData?.map((data) =>
      data.compartmentId == compartmentId
        ? {
            ...data,
            fuelType: item.value
          }
        : data
    );
    setTableData(updatedData!);
  };

  const date = new Date();

  return (
    <MainLayout stationName={stationInfo?.name}>
      <View style={styles.dischargeBox}>
        <View style={styles.titleBox}>
          <View>
            <Text style={styles.titleBoxText}>New Discharge</Text>
            <Text
              style={{
                fontFamily: typography.primary.semibold,
                fontSize: 17
              }}
            >
              {stationInfo?.name}
            </Text>
            <Text
              style={{
                fontFamily: typography.primary.light,
                fontSize: 14
              }}
            >
              {stationInfo?.address}
            </Text>
            <View
              style={{
                marginTop: 10
              }}
            >
              <Text
                style={{
                  fontFamily: typography.primary.semibold,
                  fontSize: 17
                }}
              >
                {stationInfo?.companyName}
              </Text>
              <Text
                style={{
                  fontFamily: typography.primary.light,
                  fontSize: 14
                }}
              >
                {stationInfo?.companyAddress}
              </Text>
            </View>
            <Text
              style={{
                marginTop: 10,
                fontFamily: typography.primary.normal,
                fontSize: 12
              }}
            >
              Date: {date.toDateString()}
            </Text>
          </View>

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
        </View>
      </View>

      <View
        style={{
          marginTop: 10,
          padding: 20,
          display: 'flex',
          borderRadius: 10,
          backgroundColor: '#fff',
          width: '90%'
        }}
      >
        <Text
          style={{
            fontFamily: typography.primary.bold,
            width: '90%',
            fontSize: 15,
            textTransform: 'capitalize'
          }}
        >
          Please key in truck delivery details compartment(C)
        </Text>

        <CompartmentInfoTable
          setTableData={setTableData}
          editable={editable}
          tableData={tableData}
          handleFuelTypeChange={handleFuelTypeChange}
          handleVolumeChange={handleVolumeChange}
          handleCompartmentSelect={handleCompartmentSelect}
        />

        <View
          style={{
            display: 'flex',
            marginTop: 20,
            alignItems: 'flex-start',
            width: '85%'
          }}
        >
          <View style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
            <Pressable
              disabled={editable}
              onPress={() => handleCompartment('add')}
              style={{
                ...styles.compartmentButton,
                backgroundColor: !editable ? 'rgba(4, 113, 232, 1)' : 'gray'
              }}
            >
              <Text style={{ ...styles.buttonText, color: 'white' }}>Add</Text>
            </Pressable>
            <Pressable
              disabled={editable}
              onPress={() => handleCompartment('remove')}
              style={{
                ...styles.compartmentButton,
                backgroundColor: !editable ? 'rgba(4, 113, 232, 1)' : 'gray'
              }}
            >
              <Text style={{ ...styles.buttonText, color: 'white' }}>Remove</Text>
            </Pressable>
          </View>

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
                setSaved(false);
              }}
              style={{
                ...styles.button,
                backgroundColor: !editable ? 'rgba(4, 113, 232, 1)' : 'gray'
              }}
            >
              <Text style={{ ...styles.buttonText, color: 'white' }}>Edit</Text>
            </Pressable>

            {isSaved ? (
              <Pressable
                onPress={verifyAll}
                style={{
                  ...styles.button,
                  backgroundColor: 'rgba(215, 215, 215, 0.8)'
                }}
              >
                <Text style={styles.buttonText}>Verify</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={saveData}
                style={{
                  ...styles.button,
                  backgroundColor: 'rgba(215, 215, 215, 0.8)'
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </MainLayout>
  );
};

export default CompartmentInfo;

const styles = StyleSheet.create({
  dischargeBox: {
    padding: 20,
    display: 'flex',
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    width: '90%'
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
    fontFamily: typography.primary.semibold,
    flex: 1,
    width: 100,
    height: 40,
    backgroundColor: 'rgba(64, 175, 247, 0.69)',
    borderWidth: 0.5,
    textAlign: 'center'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4
  },
  compartmentButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 4
  },
  buttonText: {
    fontSize: 12,
    fontFamily: typography.primary.medium
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: typography.primary.medium,
    letterSpacing: 0.25
  }
});
