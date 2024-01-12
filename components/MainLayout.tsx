import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React, { FC, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography } from '../theme/typography';

type Props = {
  children: ReactNode;
  stationName: string | undefined | 'Station';
  openSettings?: () => void;
};

export const MainLayout: FC<Props> = ({ children, stationName, openSettings }) => {
  const insets = useSafeAreaInsets();
  const { getState } = useNavigation();

  // 0 - OneTimeSetup
  // 1 - Home
  // 2 - CompartmentInfo
  const currentTab = getState().index;

  return (
    <View
      style={{
        ...styles.container,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <StatusBar style="dark" />
      <View style={styles.bar}>
        <Image style={styles.image} source={require('../assets/tabIcon.png')} transition={1000} />
        <View>
          <Text style={styles.barTitle}>{stationName}</Text>
        </View>
        <View>
          {currentTab === 1 || currentTab === 2 ? (
            <Pressable onPress={openSettings}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                }}
              >
                Edit
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAECEC',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {
    display: 'flex',
    width: 40,
    height: 40,
    backgroundColor: '#0553',
    borderRadius: 50,
  },
  bar: {
    display: 'flex',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    height: 70,
  },
  barTitle: {
    textAlign: 'center',
    fontFamily: typography.primary.medium,
    fontSize: 20,
    width: '100%',
    overflow: 'hidden',
  },
});
