import { View, Text, StyleSheet, Platform } from 'react-native';
import React, { useState } from 'react';
import { typography } from '../theme/typography';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import { petrolType } from '../utils/constant';
import { CompartmentData, DropdownList } from '../utils/types';

type Props = {
  tableData: CompartmentData[] | undefined;
  editable: boolean;
  setTableData: (data: CompartmentData[]) => void;
  handleFuelTypeChange: Function;
  handleVolumeChange: Function;
  handleCompartmentSelect: Function;
};

const CompartmentInfoTable = ({ tableData, editable, handleVolumeChange, handleCompartmentSelect }: Props) => {
  const [dropdownList, setDropDownList] = useState<DropdownList[]>(petrolType);

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        {tableData?.map((column) => (
          <View key={column.id}>
            <View style={styles.box}>
              <Text style={styles.header}>{column.compartmentId}</Text>
            </View>

            <Dropdown
              disable={!editable}
              style={{ ...styles.dropdown, backgroundColor: editable ? '#ededed' : 'white' }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={dropdownList}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={column.fuelType}
              onChange={(item) => handleCompartmentSelect(item, column.compartmentId)}
            />

            <View style={{ ...styles.box, backgroundColor: editable ? '#ededed' : 'white' }}>
              <TextInput
                editable={editable}
                style={{ ...styles.input, color: 'black' }}
                value={column.volume}
                onChangeText={(volume) => handleVolumeChange(column.id, volume)}
                keyboardType={Platform.OS == 'android' ? 'numeric' : 'number-pad'}
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
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: 'black',
    display: 'flex',
    flexDirection: 'column',
  },
  box: {
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
    fontSize: 12,
    fontFamily: typography.primary.bold,
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
  },
  iconStyle: {
    display: 'none',
  },
});

export default CompartmentInfoTable;
