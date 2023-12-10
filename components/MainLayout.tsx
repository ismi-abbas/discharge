import { StyleSheet, Text, View } from "react-native";
import React, { FC, ReactNode } from "react";
import { Image } from "expo-image";
import FeatherIcons from "@expo/vector-icons/Feather";
import { typography } from "../theme/typography";

type Props = {
  children: ReactNode;
};

export const MainLayout: FC<Props> = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <Image
          style={styles.image}
          source="https://media.gettyimages.com/id/1314489757/photo/smiling-hispanic-man-against-white-background.jpg?s=2048x2048&w=gi&k=20&c=xK-PIu9PhfkSz7nUpMF6omCHgufUZcyFaRgJURtR3gA="
          contentFit="cover"
          transition={1000}
        />
        <View>
          <Text style={styles.barTitle}>Station A</Text>
        </View>
        <View>
          <FeatherIcons
            name="sliders"
            size={20}
          />
        </View>
      </View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAECEC",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 30
  },
  image: {
    display: "flex",
    width: 40,
    height: 40,
    backgroundColor: "#0553",
    borderRadius: 50
  },
  bar: {
    display: "flex",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    height: 70
  },
  barTitle: {
    fontFamily: typography.primary.medium,
    fontSize: 22
  }
});
