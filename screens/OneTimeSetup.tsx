import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import React, { useEffect, useState } from "react";
import { AppStackScreenProps } from "../MainNavigator";
import { MainLayout } from "../components/MainLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { typography } from "../theme/typography";
import { petrolType, tankData } from "../utils/constant";
import { DropdownList } from "../components/CompartmentVSTankTable";
import { Dropdown } from "react-native-element-dropdown";
import FeatherIcons from "@expo/vector-icons/Feather";
import Toast from "react-native-toast-message";

interface InitialSetupInfo {
  done: boolean;
  data: TankData[];
}

const OneTimeSetup = ({ navigation }: AppStackScreenProps<"OneTimeSetup">) => {
  const [tableData, setTableData] = useState<TankData[]>(tankData);
  const [editable, setEditable] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [initialSetup, setInitialSetup] = useState<InitialSetupInfo>({
    done: false,
    data: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleCompartmentSelect = (item: DropdownList, tankId: string) => {
    const compartment = tableData?.find((data) => data.tankId === tankId);
    console.log(
      "🚀 ~ file: OneTimeSetup.tsx:33 ~ handleCompartmentSelect ~ compartment:",
      compartment
    );
    if (!compartment) {
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

  const fetchData = async () => {
    try {
      const initialSetup = await AsyncStorage.getItem("initialSetup");
      const initialSetupData = await AsyncStorage.getItem("initialSetupData");

      if (initialSetup && initialSetupData) {
        const status = JSON.parse(initialSetup);
        const data = JSON.parse(initialSetupData);

        setInitialSetup({
          done: status,
          data: data
        });

        setTableData(data);
        navigation.navigate("Home");
      } else {
        console.log("No yet finished initial setup");
      }
    } catch (error) {
      console.log("Fetch Data Error: ", error);
    }
  };

  const saveDetails = async ({ data }: { data: any }) => {
    console.log("🚀 ~ file: OneTimeSetup.tsx:74 ~ saveDetails ~ data:", data);
    setInitialSetup({
      done: false,
      data: data
    });

    Toast.show({
      type: "success",
      text1: "Data save",
      text2: "Data saved successfully",
      position: "bottom",
      visibilityTime: 2000
    });
  };

  const verifyData = async () => {
    let verified = initialSetup.data.every(
      (d) => d.volume !== "" && d.fuelType !== ""
    );
    if (verified) {
      console.log(
        "🚀 ~ file: OneTimeSetup.tsx:87 ~ verifyData ~ verified:",
        verified
      );
      try {
        await AsyncStorage.setItem(
          "initialSetup",
          JSON.stringify(initialSetup.done)
        );
        await AsyncStorage.setItem(
          "initialSetupData",
          JSON.stringify(initialSetup.data)
        );

        navigation.navigate("Home");
      } catch (error) {
        console.log(
          "🚀 ~ file: OneTimeSetup.tsx:69 ~ saveDetails ~ error:",
          error
        );
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Incomplete data",
        text2: "Please fill all the columns with initial setup data",
        position: "bottom",
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
              <Pressable
                onPress={() => navigation.navigate("Home")}
                style={{
                  backgroundColor: "rgba(215, 215, 215, 0.8)",
                  padding: 2,
                  borderRadius: 5,
                  position: "absolute",
                  top: 0,
                  right: 0,
                  zIndex: 20
                }}
              >
                <FeatherIcons
                  name="x"
                  size={20}
                />
              </Pressable>
              <Text style={styles.titleBoxText}>One time setup</Text>
              <Text>{initialSetup.done.toString().toLocaleUpperCase()}</Text>

              <Text
                style={{
                  marginTop: 20,
                  fontFamily: typography.primary.light,
                  fontSize: 17
                }}
              >
                Please Key In Your Current Station Tank Details
              </Text>

              <Table
                tableData={tableData}
                editable={editable}
                setTableData={setTableData}
                handleCompartmentSelect={handleCompartmentSelect}
              />
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
              display: "flex",
              marginTop: 20,
              alignItems: "flex-start",
              width: "95%"
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                marginTop: 4
              }}
            >
              <Pressable
                onPress={() => setEditable(!editable)}
                style={{
                  ...styles.button,
                  backgroundColor: !editable ? "rgba(4, 113, 232, 1)" : "gray"
                }}
              >
                <Text style={{ ...styles.text, color: "white" }}>Edit</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "95%",
            gap: 10,
            paddingLeft: 20
          }}
        >
          <Pressable
            onPress={() => saveDetails({ data: tableData })}
            aria-disabled={isVerified}
            style={{
              ...styles.button,
              backgroundColor: "rgba(4, 113, 232, 1)"
            }}
          >
            <Text style={{ ...styles.text, color: "white" }}>Save</Text>
          </Pressable>
          <Pressable
            onPress={verifyData}
            style={{
              ...styles.button,
              backgroundColor: "rgba(215, 215, 215, 0.8)"
            }}
          >
            <Text style={styles.text}>Verify</Text>
          </Pressable>
        </View>
      </View>
    </MainLayout>
  );
};

export type TankData = {
  id: number;
  tankId: string;
  fuelType: string;
  volume: string;
  maxVolume: string;
};

type Props = {
  tableData: TankData[] | undefined;
  setTableData: (data: TankData[]) => void;
  editable: boolean;
  handleCompartmentSelect: Function;
};

const Table = ({
  tableData,
  setTableData,
  editable,
  handleCompartmentSelect
}: Props) => {
  const [tankTableData, setTanktData] = useState(tableData!);

  const handleTypeChange = (id: number, value: string) => {
    const updateTankData = tankTableData.map((tank) =>
      tank.id === id ? { ...tank, fuelType: value } : tank
    );

    setTanktData(updateTankData);
    setTableData(updateTankData);
  };

  const handleVolumeChange = (id: number, value: string) => {
    const updatedTankData = tankTableData.map((tank) =>
      tank.id === id ? { ...tank, volume: value } : tank
    );

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
            <View style={styles.tableBox}>
              <Text style={styles.header}>{column.tankId}</Text>
            </View>
            <Dropdown
              disable={!editable}
              style={{
                ...styles.dropdown,
                backgroundColor: editable ? "yellow" : "white"
              }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={petrolType}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={column.fuelType}
              onChange={(item) => handleCompartmentSelect(item, column.tankId)}
            />
            <View
              style={{
                ...styles.tableBox,
                backgroundColor:
                  parseInt(column.volume) > parseInt(column.maxVolume)
                    ? "red"
                    : "green"
              }}
            >
              <TextInput
                keyboardType="number-pad"
                editable={editable}
                style={{ ...styles.input, color: "white" }}
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
  $container: {
    flex: 1
  },
  dischargeBox: {
    padding: 20,
    display: "flex",
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    height: 500,
    width: "95%"
  },
  titleBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  titleBoxText: {
    fontSize: 20,
    fontFamily: typography.primary.semibold
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly"
  },
  box: {
    fontFamily: typography.primary.semibold,
    flex: 1,
    width: "auto",
    height: 40,
    borderWidth: 0.5,
    textAlign: "center"
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
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
    borderColor: "black",
    display: "flex",
    flexDirection: "column"
  },
  tableBox: {
    justifyContent: "center",
    width: 70,
    borderWidth: 0.5,
    height: 40,
    backgroundColor: "#fff"
  },
  input: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
    textAlign: "center",
    color: "black"
  },
  header: {
    fontSize: 14,
    fontFamily: typography.primary.semibold,
    textAlign: "center",
    color: "black"
  },
  dropdown: {
    height: 40,
    borderWidth: 0.5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
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
    display: "none"
  }
});

export default OneTimeSetup;
