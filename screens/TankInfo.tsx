import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { AppStackScreenProps } from "../MainNavigator";
import { MainLayout } from "../components/MainLayout";
import { typography } from "../theme/typography";
import FeatherIcons from "@expo/vector-icons/Feather";
import { tankData } from "../utils/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import TankInfoTable, { TankData } from "../components/TankInfoTable";
import { DropdownList } from "../components/CompartmentVSTankTable";

const TankInfo = ({ navigation }: AppStackScreenProps<"TankInfo">) => {
  const [tableData, setTableData] = useState<TankData[]>(tankData);
  const [editable, setEditable] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    getTableData();
  }, []);

  const getTableData = async () => {
    try {
      const tankData = await AsyncStorage.getItem("tankData");
      if (tankData) {
        setTableData(JSON.parse(tankData || ""));
      }
    } catch (error) {}
  };

  const saveData = async () => {
    try {
      AsyncStorage.setItem("tankData", JSON.stringify(tableData));
      Toast.show({
        type: "success",
        text1: "Data Saved",
        text2: "Tank details has been saved 👍🏻",
        position: "bottom",
        visibilityTime: 2000
      });
      console.log(tableData);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error saving data",
        text2: "Please try again",
        position: "bottom",
        visibilityTime: 2000
      });
    }
  };

  const verifyAll = () => {
    const verified = tankData.every(
      (tank) => tank.volume !== "" && tank.fuelType !== ""
    );

    if (verified) {
      setIsVerified(true);
      Toast.show({
        type: "success",
        text1: "Data Verified",
        text2: "All data has been verified",
        position: "bottom",
        visibilityTime: 2000
      });
      setTimeout(() => {
        navigation.navigate("CompartmentTankVerify");
      }, 2000);
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid data",
        text2: "Please fill in all the columns",
        position: "bottom",
        visibilityTime: 2000
      });
      setIsVerified(false);
    }
  };

  const handleCompartmentSelect = (item: DropdownList, tankId: string) => {
    const compartment = tableData?.find((data) => data.tankId === tankId);
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

  return (
    <MainLayout>
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
            <Text style={styles.titleBoxText}>New Discharge</Text>
            <Text
              style={{
                marginTop: 20,
                fontFamily: typography.primary.light,
                fontSize: 17
              }}
            >
              Please Key In Your Station Tank Latest Details, Tank(T)
            </Text>

            <TankInfoTable
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
          aria-disabled={isVerified}
          onPress={saveData}
          style={{ ...styles.button, backgroundColor: "rgba(4, 113, 232, 1)" }}
        >
          <Text style={{ ...styles.text, color: "white" }}>Save</Text>
        </Pressable>
        <Pressable
          onPress={verifyAll}
          style={{
            ...styles.button,
            backgroundColor: "rgba(215, 215, 215, 0.8)"
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
    // backgroundColor: 'rgba(3, 244, 28, 1)',
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
  }
});

export default TankInfo;
