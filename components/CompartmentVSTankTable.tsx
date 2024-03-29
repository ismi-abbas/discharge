import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { ScrollView } from 'react-native-gesture-handler';
import { typography } from '../theme/typography';
import { CompartmentData, DropdownList, MergeData, TankData } from '../utils/types';

type Props = {
  tankData: TankData[];
  setTankData: (data: TankData[]) => void;
  compartmentData: CompartmentData[];
  setCompartmentData: (data: CompartmentData[]) => void;
  editable: boolean;
  mergedData: MergeData[] | undefined;
  handleCompartmentSelect: (item: DropdownList, tankId: string, compartmentIndex: number) => void;
  calculateTotal: (compartmentVolume: string, tankVolume: string) => void;
  dropdownList: DropdownList[];
};

const CompartmentVSTankTable = ({
  compartmentData,
  editable,
  mergedData,
  handleCompartmentSelect,
  dropdownList,
}: Props) => {
  if (!mergedData && compartmentData && dropdownList) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        {mergedData?.map((column) => (
          <View key={column.id}>
            {/* Tank ID */}
            <View
              style={{
                ...styles.box,
                backgroundColor: 'rgba(91, 217, 250, 0.8)',
              }}
            >
              <Text style={styles.header}>{column.tankId}</Text>
            </View>
            {/* Tank Petrol Type */}
            <View style={styles.box}>
              <Text style={styles.text}>{column.tankFuelType}</Text>
            </View>
            {/* Tank Volume */}
            <View style={styles.box}>
              <Text style={styles.text}>{column.tankVolume.concat('L')}</Text>
            </View>

            {column.compartmentList.map((compartment, index) => {
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <View key={index}>
                  <Dropdown
                    keyboardAvoiding
                    disable={!editable}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    itemTextStyle={{
                      fontFamily: typography.primary.semibold,
                      fontSize: 14,
                      textAlign: 'center',
                    }}
                    maxHeight={400}
                    iconStyle={styles.iconStyle}
                    data={dropdownList}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={compartment.compartmentId}
                    onChange={(item) => {
                      handleCompartmentSelect(item, column.tankId, index);
                    }}
                  />

                  {/* Compartment Type */}
                  <View
                    style={{
                      ...styles.box,
                      backgroundColor:
                        compartment.fuelType !== ''
                          ? compartment.fuelType === column.tankFuelType
                            ? 'white'
                            : 'red'
                          : 'white',
                    }}
                  >
                    <Text
                      style={{
                        ...styles.text,
                        color:
                          compartment.fuelType !== ''
                            ? compartment.fuelType === column.tankFuelType
                              ? 'black'
                              : 'white'
                            : 'black',
                      }}
                    >
                      {compartment.fuelType}
                    </Text>
                  </View>

                  {/* Compartment Volume */}
                  <View
                    style={{
                      ...styles.box,
                    }}
                  >
                    <Text style={styles.text}>
                      {compartment.volume ? compartment.volume.concat('L') : compartment.volume}
                    </Text>
                  </View>
                </View>
              );
            })}

            <View
              style={{
                ...styles.box,
                marginTop: 40,
              }}
            >
              <Text style={styles.header}>Added Volume</Text>
            </View>

            <View
              style={{
                ...styles.box,
                backgroundColor:
                  column.mergedVolume !== ''
                    ? parseInt(column.mergedVolume) > parseInt(column.tankMaxVolume)
                      ? 'red'
                      : 'white'
                    : 'white',
              }}
            >
              <Text
                style={{
                  ...styles.text,
                  color:
                    column.mergedVolume !== ''
                      ? parseInt(column.mergedVolume) > parseInt(column.tankMaxVolume)
                        ? 'white'
                        : 'black'
                      : 'white',
                }}
              >
                {column.mergedVolume}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Merged Volume Text */}
      <View
        style={{
          position: 'absolute',
          width: 333,
          height: 310,
          zIndex: -10,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: typography.primary.bold,
            textAlign: 'center',
            color: 'black',
            borderColor: 'black',
            top: 850,
          }}
        />
      </View>
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
    width: 110,
    borderWidth: 0.5,
    height: 40,
    backgroundColor: '#fff',
  },
  text: {
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
    textAlign: 'center',
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
});

export default CompartmentVSTankTable;
