import { View, Text, StyleSheet, Platform } from 'react-native';
import React, { useState } from 'react';
import { typography } from '../theme/typography';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Dropdown } from 'react-native-element-dropdown';
import { petrolType } from '../utils/constant';
import { DropdownList, TankData } from '../utils/types';

type Props = {
  tableData: TankData[];
  editable: boolean;
  handleCompartmentSelect: Function;
  handleVolumeChange: Function;
};

const TankInfoTable = ({ tableData, editable, handleCompartmentSelect, handleVolumeChange }: Props) => {
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

            <View style={styles.box}>
              <Text style={styles.header}>{column.fuelType}</Text>
            </View>
            <View style={{ ...styles.box, backgroundColor: editable ? '#ededed' : 'white' }}>
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
                  value={column.volume}
                  onChangeText={(volume) => handleVolumeChange(column.id, volume)}
                />
                <Text>L</Text>
              </View>
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
    fontFamily: typography.primary.bold,
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
    fontFamily: typography.primary.semibold,
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: typography.primary.semibold,
  },
  iconStyle: {
    display: 'none',
  },
});

export default TankInfoTable;
