import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppStackScreenProps } from '../MainNavigator';
import { MainLayout } from '../components/MainLayout';
import { typography } from '../theme/typography';
import { petrolType, tankData } from '../utils/constant';
import { DropdownList } from '../components/CompartmentVSTankTable';
import { Dropdown } from 'react-native-element-dropdown';
import FeatherIcons from '@expo/vector-icons/Feather';
import Toast from 'react-native-toast-message';
import { TankData } from '../components/TankInfoTable';
import { load, save } from '../utils/storage';
import DUMMY_DATA from '../dummyData.json';

interface InitialSetupInfo {
  done: boolean;
  data: TankData[];
}

const OneTimeSetup = ({ navigation }: AppStackScreenProps<'OneTimeSetup'>) => {
  const [tableData, setTableData] = useState<TankData[]>(tankData);
  const [editable, setEditable] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [initialSetup, setInitialSetup] = useState<InitialSetupInfo>({
    done: false,
    data: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialSetupData = (await load('initialSetupData')) as InitialSetupInfo;

        if (initialSetupData) {
          setInitialSetup({
            done: initialSetup.done,
            data: initialSetup.data
          });

          setTableData(initialSetup.data);

          navigation.navigate('Home');
        } else {
          console.log('No yet finished initial setup');
        }
      } catch (error) {
        console.log('Fetch Data Error: ', error);
      }
    };

    fetchData();
  }, []);

  const handleFuelTypeChange = (item: DropdownList, tankId: string) => {
    const tank = tableData.find((data) => data.tankId === tankId);
    if (!tank) {
      return;
    }

    const updatedData = tableData?.map((data) =>
      data.tankId == tankId
        ? {
            ...data,
            fuelType: item.value
          }
        : data
    );
    setTableData(updatedData!);
  };

  const handleVolumeChange = (id: number, field: string, value: string) => {
    let updatedTankData;

    if (field === 'volume') {
      updatedTankData = tableData.map((tank) => (tank.id === id ? { ...tank, volume: value } : tank));
    } else {
      updatedTankData = tableData.map((tank) => (tank.id === id ? { ...tank, maxVolume: value } : tank));
    }

    setTableData(updatedTankData);
  };

  const handleCompartment = (action: string) => {
    if (action === 'add') {
      const id = (tableData?.length || 0) + 1;

      const newTank: TankData = {
        tankId: 'T' + id.toString(),
        fuelType: '',
        id: (tableData?.length || 0) + 1,
        volume: '0',
        maxVolume: '0'
      };
      const updatedTableData = [...(tableData || []), newTank];

      setTableData(updatedTableData);

      Toast.show({
        type: 'success',
        text1: 'Add Tank',
        text2: 'New tank added',
        position: 'bottom'
      });
    } else if (action === 'remove') {
      if (tableData && tableData.length > 0) {
        const updatedTableData = tableData.slice(0, -1);

        setTableData(updatedTableData);

        Toast.show({
          type: 'success',
          text1: 'Remove Tank',
          text2: `Tank has been removed`,
          position: 'bottom'
        });
      }
    }
  };

  const saveDetails = async ({ data }: { data: any }) => {
    console.log('🚀 ~ file: OneTimeSetup.tsx:77 ~ saveDetails ~ data:', data);
    setInitialSetup({
      done: false,
      data: data
    });

    Toast.show({
      type: 'success',
      text1: 'Data save',
      text2: 'Data saved successfully',
      position: 'bottom',
      visibilityTime: 2000
    });
  };

  const verifyData = async () => {
    let verified = initialSetup.data.every((d) => d.volume !== '' && d.fuelType !== '');
    if (verified) {
      try {
        await save('initialSetup', initialSetup);
        navigation.navigate('Home');
      } catch (error) {}
    } else {
      Toast.show({
        type: 'error',
        text1: 'Incomplete data',
        text2: 'Please fill all the columns with initial setup data',
        position: 'bottom',
        visibilityTime: 2000
      });
    }
  };

  return (
    <MainLayout>
      <View style={styles.$container}>
        <View style={styles.dischargeBox}>
          <View style={styles.titleBox}>
            <View>
              <Text style={styles.titleBoxText}>One time setup</Text>

              <Text style={{ fontFamily: typography.primary.semibold, fontSize: 25 }}>
                {DUMMY_DATA.stations[0].name}
              </Text>

              <Text style={{ fontFamily: typography.primary.light, fontSize: 14 }}>
                {DUMMY_DATA.stations[0].address}
              </Text>

              <View style={{ marginTop: 10 }}>
                <Text style={{ fontFamily: typography.primary.semibold, fontSize: 17 }}>
                  {DUMMY_DATA.stations[0].companyName}
                </Text>
                <Text style={{ fontFamily: typography.primary.light, fontSize: 14 }}>
                  {DUMMY_DATA.stations[0].companyAddress}
                </Text>
              </View>
              <Text style={{ marginTop: 10, fontFamily: typography.primary.normal, fontSize: 12 }}>
                Date: {new Date().toDateString()}
              </Text>

              <Text
                style={{
                  marginTop: 20,
                  fontFamily: typography.primary.light,
                  fontSize: 17
                }}
              >
                Please Key In Your Current Station Tank Details
              </Text>

              <View style={styles.container}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {tableData?.map((column) => (
                    <View key={column.id}>
                      <View style={styles.tableBox}>
                        <Text style={styles.header}>{column.tankId}</Text>
                      </View>
                      <Dropdown
                        disable={!editable}
                        style={{
                          ...styles.dropdown,
                          backgroundColor: editable ? 'yellow' : 'white'
                        }}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        iconStyle={styles.iconStyle}
                        data={petrolType}
                        labelField="label"
                        valueField="value"
                        placeholder="Select"
                        value={column.fuelType}
                        onChange={(item) => handleFuelTypeChange(item, column.tankId)}
                      />
                      <View style={styles.tableBox}>
                        <TextInput
                          keyboardType="number-pad"
                          editable={editable}
                          style={styles.input}
                          value={column.volume}
                          onChangeText={(volume) => handleVolumeChange(column.id, 'volume', volume)}
                        />
                      </View>

                      <View style={styles.tableBox}>
                        <TextInput
                          keyboardType="number-pad"
                          editable={editable}
                          style={styles.input}
                          value={column.maxVolume}
                          onChangeText={(maxVolume) => handleVolumeChange(column.id, 'maxVolume', maxVolume)}
                        />
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
              <Text
                style={{
                  marginTop: 5,
                  marginBottom: 2,
                  fontFamily: typography.primary.light,
                  fontSize: 12
                }}
              >
                *Scroll to the right for more info
              </Text>
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
                onPress={() => setEditable(!editable)}
                style={{
                  ...styles.compartmentButton,
                  backgroundColor: !editable ? 'rgba(4, 113, 232, 1)' : 'gray'
                }}
              >
                <Text style={{ ...styles.buttonText, color: 'white' }}>Edit</Text>
              </Pressable>

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
            onPress={() => saveDetails({ data: tableData })}
            aria-disabled={isVerified}
            style={{
              ...styles.button,
              backgroundColor: 'rgba(4, 113, 232, 1)'
            }}
          >
            <Text style={{ ...styles.text, color: 'white' }}>Save</Text>
          </Pressable>
          <Pressable
            onPress={verifyData}
            style={{
              ...styles.button,
              backgroundColor: 'rgba(215, 215, 215, 0.8)'
            }}
          >
            <Text style={styles.text}>Verify</Text>
          </Pressable>
        </View>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  $container: {
    flex: 1
  },
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
    fontFamily: typography.primary.semibold,
    flex: 1,
    width: 'auto',
    height: 40,
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
  },
  container: {
    marginTop: 20,
    borderWidth: 0.5,
    borderColor: 'black',
    display: 'flex',
    flexDirection: 'column'
  },
  tableBox: {
    justifyContent: 'center',
    width: 70,
    borderWidth: 0.5,
    height: 40,
    backgroundColor: '#fff'
  },
  input: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
    textAlign: 'center',
    color: 'black'
  },
  header: {
    fontSize: 14,
    fontFamily: typography.primary.semibold,
    textAlign: 'center',
    color: 'black'
  },
  dropdown: {
    height: 40,
    borderWidth: 0.5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderStyle: {
    fontSize: 12,
    fontFamily: typography.primary.bold
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: typography.primary.bold
  },
  iconStyle: {
    display: 'none'
  },
  compartmentButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 12,
    fontFamily: typography.primary.medium
  }
});

export default OneTimeSetup;
