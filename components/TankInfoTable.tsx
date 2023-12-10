import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { typography } from '../theme/typography';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Dropdown } from 'react-native-element-dropdown';
import { petrolType } from '../utils/constant';
import { DropdownList, TankData } from '../utils/types';

type Props = {
  tableData: TankData[] | undefined;
  setTableData: (data: TankData[]) => void;
  editable: boolean;
  handleCompartmentSelect: Function;
};

const TankInfoTable = ({ tableData, setTableData, editable, handleCompartmentSelect }: Props) => {
  const [tankTableData, setTanktData] = useState(tableData!);
  const [dropdownList, setDropDownList] = useState<DropdownList[]>(petrolType);

  const handleTypeChange = (id: number, value: string) => {
    const updateTankData = tankTableData.map((tank) => (tank.id === id ? { ...tank, fuelType: value } : tank));

    setTanktData(updateTankData);
    setTableData(updateTankData);
  };

  const handleVolumeChange = (id: number, value: string) => {
    const updatedTankData = tankTableData.map((tank) => (tank.id === id ? { ...tank, volume: value } : tank));

    const tankWithUpdatedVolume = updatedTankData.find((tank) => tank.id === id)!;
    if (parseInt(tankWithUpdatedVolume.volume) > parseInt(tankWithUpdatedVolume.maxVolume)) {
      Toast.show({
        type: 'error',
        text1: 'Max volume exceeded',
        text2: `Volume exceeds max volume for tank ${tankWithUpdatedVolume.tankId}. Max ${tankWithUpdatedVolume.maxVolume}`,
        position: 'bottom',
        visibilityTime: 3000
      });
    }

    setTanktData(updatedTankData);
    setTableData(updatedTankData);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {tableData?.map((column) => (
          <View key={column.id}>
            <View style={styles.box}>
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
              data={dropdownList}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={column.fuelType}
              onChange={(item) => handleCompartmentSelect(item, column.tankId)}
            />
            <View
              style={{
                ...styles.box,
                backgroundColor: parseInt(column.volume) > parseInt(column.maxVolume) ? 'red' : 'green'
              }}
            >
              <TextInput
                keyboardType="number-pad"
                editable={editable}
                style={{ ...styles.input, color: 'white' }}
                value={column.volume}
                onChangeText={(volume) => handleVolumeChange(column.id, volume)}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    borderWidth: 0.5,
    borderColor: 'black',
    display: 'flex',
    flexDirection: 'column'
  },
  box: {
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
  }
});

export default TankInfoTable;
