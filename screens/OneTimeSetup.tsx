import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { typography } from '../theme/typography';
import { petrolType, tankDefaultData } from '../utils/constant';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import { load, save } from '../utils/storage';
import DUMMY_DATA from '../dummyData.json';
import { AppStackScreenProps, DropdownList, InitialSetupInfo, StationInfo, TankData } from '../utils/types';
import { useIsFocused } from '@react-navigation/native';

const OneTimeSetup = ({ navigation, route }: AppStackScreenProps<'OneTimeSetup'>) => {
  const isFocus = useIsFocused();
  const fromScreen = route.params?.fromScreen ?? false;

  const [tableData, setTableData] = useState<TankData[]>(tankDefaultData);
  const [editable, setEditable] = useState(false);
  const [initialSetup, setInitialSetup] = useState<InitialSetupInfo>({
    done: false,
    data: [],
  });
  const [stationInfo, setStationInfo] = useState<StationInfo>({
    stationId: '',
    name: '',
    address: '',
    companyAddress: '',
    companyName: '',
  });

  useEffect(() => {
    fetchData();
  }, [isFocus]);

  const fetchData = async () => {
    try {
      const initialSetupData = (await load('initialSetup')) as InitialSetupInfo;
      const stationInfoData = (await load('stationInfo')) as StationInfo;

      if (initialSetupData) {
        setInitialSetup(initialSetupData);
        setTableData(initialSetupData.data);

        if (!fromScreen) {
          navigation.navigate('Home');
        }
      } else {
        console.log('Not yet finished initial setup');
      }

      if (stationInfoData) {
        setStationInfo(stationInfoData);
      } else {
        setStationInfo(DUMMY_DATA.stations[0]);
      }
    } catch (error) {
      console.log('Fetch Data Error: ', error);
    }
  };

  const handleFuelTypeChange = (item: DropdownList, tankId: string) => {
    const updatedData = tableData?.map((data) =>
      data.tankId === tankId
        ? {
            ...data,
            fuelType: item.value,
          }
        : data
    );
    setTableData(updatedData || []);
  };

  const handleVolumeChange = (id: number, field: string, value: string) => {
    const updatedTankData = tableData.map((tank) => (tank.id === id ? { ...tank, [field]: value } : tank));
    setTableData(updatedTankData);
  };

  const handleCompartment = (action: string) => {
    if (action === 'add') {
      addTank();
    } else if (action === 'remove') {
      removeTank();
    }
  };

  const addTank = () => {
    const id = (tableData?.length || 0) + 1;
    const newTank: TankData = {
      tankId: 'T' + id.toString(),
      fuelType: '',
      id: id,
      volume: '0',
      maxVolume: '0',
    };
    const updatedTableData = [...(tableData || []), newTank];
    setTableData(updatedTableData);

    showToast('success', 'Add Tank', 'New tank added');
  };

  const removeTank = () => {
    if (tableData && tableData.length > 0) {
      const updatedTableData = tableData.slice(0, -1);
      setTableData(updatedTableData);

      showToast('success', 'Remove Tank', 'Tank has been removed');
    }
  };

  const saveDetails = async ({ data }: { data: TankData[] }) => {
    setInitialSetup({
      done: true,
      data: data,
    });

    console.log(data);

    showToast('success', 'Data save', 'Data saved successfully', 2000);
  };

  const verifyData = async () => {
    const verified = initialSetup.data.every((d) => d.volume !== '' && d.fuelType !== '');
    const stationInfoVerified =
      stationInfo.address !== '' &&
      stationInfo.companyAddress !== '' &&
      stationInfo.companyName !== '' &&
      stationInfo.name !== '';

    setInitialSetup({ ...initialSetup, done: true });

    if (verified && stationInfoVerified) {
      try {
        await save('initialSetup', initialSetup);
        await save('stationInfo', stationInfo);
        navigation.navigate('Home');
      } catch (error) {
        showToast('error', 'Error saving data', 'Error saving preset data');
      }
    } else {
      showToast('error', 'Incomplete data', 'Please fill all the columns with initial setup data', 2000);
    }
  };

  const showToast = (type: string, text1: string, text2: string, visibilityTime?: number) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      position: 'bottom',
      visibilityTime: visibilityTime || 3000,
    });
  };

  return (
    <MainLayout stationName={stationInfo.name}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wrapper}>
          <KeyboardAvoidingView>
            <View style={styles.dischargeBox}>
              <View style={styles.titleBox}>
                <View>
                  <Text style={styles.titleBoxText}>Tank Preset</Text>
                  <View style={{ borderWidth: editable ? 0.5 : 0, padding: editable ? 2 : 0, borderRadius: 10 }}>
                    <View style={{ marginTop: 2 }}>
                      <TextInput
                        keyboardType="default"
                        editable={editable}
                        style={{
                          fontFamily: typography.primary.semibold,
                          fontSize: 17,
                          color: editable ? 'gray' : 'black',
                        }}
                        value={stationInfo?.name}
                        onChangeText={(name) => setStationInfo({ ...stationInfo, name: name })}
                      />

                      <TextInput
                        keyboardType="default"
                        editable={editable}
                        style={{
                          fontFamily: typography.primary.light,
                          fontSize: 14,
                          color: editable ? 'gray' : 'black',
                        }}
                        value={stationInfo?.address}
                        onChangeText={(address) => setStationInfo({ ...stationInfo, address: address })}
                      />

                      <View>
                        <TextInput
                          keyboardType="default"
                          editable={editable}
                          style={{
                            fontFamily: typography.primary.semibold,
                            fontSize: 16,
                            color: editable ? 'gray' : 'black',
                          }}
                          value={stationInfo.companyName}
                          onChangeText={(companyName) => setStationInfo({ ...stationInfo, companyName: companyName })}
                        />

                        <TextInput
                          keyboardType="default"
                          editable={editable}
                          style={{
                            fontFamily: typography.primary.light,
                            fontSize: 14,
                            color: editable ? 'gray' : 'black',
                          }}
                          value={stationInfo.companyAddress}
                          onChangeText={(companyAddress) =>
                            setStationInfo({ ...stationInfo, companyAddress: companyAddress })
                          }
                        />
                      </View>
                    </View>

                    <Text style={{ marginTop: 10, fontFamily: typography.primary.normal, fontSize: 12 }}>
                      Date: {new Date().toDateString()}
                    </Text>
                  </View>

                  <Text
                    style={{
                      marginTop: 20,
                      fontFamily: typography.primary.light,
                      fontSize: 17,
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
                            style={styles.dropdown}
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

                          {/* <View style={styles.tableBox}>
                        <TextInput
                          keyboardType={Platform.OS == 'android' ? 'numeric' : 'number-pad'}
                          editable={editable}
                          style={styles.input}
                          value={column.volume}
                          onChangeText={(volume) => handleVolumeChange(column.id, 'volume', volume)}
                        />
                      </View> */}

                          <View style={styles.tableBox}>
                            <View
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <TextInput
                                keyboardType={Platform.OS == 'android' ? 'numeric' : 'number-pad'}
                                editable={editable}
                                style={styles.input}
                                value={column.maxVolume}
                                onChangeText={(maxVolume) => handleVolumeChange(column.id, 'maxVolume', maxVolume)}
                              />
                              <Text>L</Text>
                            </View>
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
                      fontSize: 12,
                    }}
                  >
                    {' '}
                    *Scroll to the right for more info. 3rd row is the max volume for tank.
                  </Text>
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  marginTop: 20,
                  alignItems: 'flex-start',
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
                    onPress={() => setEditable(!editable)}
                    style={{
                      ...styles.compartmentButton,
                      backgroundColor: !editable ? 'rgba(4, 113, 232, 1)' : 'gray',
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
                        backgroundColor: !editable ? 'rgba(4, 113, 232, 1)' : 'gray',
                      }}
                    >
                      <Text style={{ ...styles.buttonText, color: 'white' }}>Add</Text>
                    </Pressable>
                    <Pressable
                      disabled={editable}
                      onPress={() => handleCompartment('remove')}
                      style={{
                        ...styles.compartmentButton,
                        backgroundColor: !editable ? 'rgba(4, 113, 232, 1)' : 'gray',
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
                gap: 10,
                paddingLeft: 20,
              }}
            >
              <Pressable
                onPress={() => saveDetails({ data: tableData })}
                style={{
                  ...styles.button,
                  backgroundColor: 'rgba(4, 113, 232, 1)',
                }}
              >
                <Text style={{ ...styles.buttonText, color: 'white' }}>Save</Text>
              </Pressable>
              <Pressable
                onPress={verifyData}
                style={{
                  ...styles.button,
                  backgroundColor: 'rgba(215, 215, 215, 0.8)',
                }}
              >
                <Text style={styles.buttonText}>Verify</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  dischargeBox: {
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
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
    justifyContent: 'space-evenly',
  },
  box: {
    fontFamily: typography.primary.semibold,
    flex: 1,
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
  container: {
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: 'black',
    display: 'flex',
    flexDirection: 'column',
  },
  tableBox: {
    justifyContent: 'center',
    width: 70,
    borderWidth: 0.5,
    height: 40,
    backgroundColor: '#fff',
  },
  input: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
    textAlign: 'center',
    color: 'black',
  },
  header: {
    fontSize: 14,
    fontFamily: typography.primary.semibold,
    textAlign: 'center',
    color: 'black',
  },
  dropdown: {
    height: 40,
    borderWidth: 0.5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
  },
  iconStyle: {
    display: 'none',
  },
  compartmentButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
  },
});

export default OneTimeSetup;
