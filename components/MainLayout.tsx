import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { FC, ReactNode } from 'react';
import { Image } from 'expo-image';
import FeatherIcons from '@expo/vector-icons/Feather';
import { typography } from '../theme/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  stationName: string | undefined | 'Station';
  openSettings?: () => void;
};

export const MainLayout: FC<Props> = ({ children, stationName, openSettings }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ ...styles.container, paddingTop: insets.top }}>
      <View style={styles.bar}>
        <Image
          style={styles.image}
          source="https://media.gettyimages.com/id/1314489757/photo/smiling-hispanic-man-against-white-background.jpg?s=2048x2048&w=gi&k=20&c=xK-PIu9PhfkSz7nUpMF6omCHgufUZcyFaRgJURtR3gA="
          contentFit="cover"
          transition={1000}
        />
        <View>
          <Text style={styles.barTitle}>{stationName}</Text>
        </View>
        <View>
          <FeatherIcons
            name="sliders"
            size={20}
            onPress={openSettings}
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
    backgroundColor: '#EAECEC',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  image: {
    display: 'flex',
    width: 40,
    height: 40,
    backgroundColor: '#0553',
    borderRadius: 50
  },
  bar: {
    display: 'flex',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    height: 70
  },
  barTitle: {
    textAlign: 'center',
    fontFamily: typography.primary.medium,
    fontSize: 20,
    width: '100%',
    overflow: 'hidden'
  }
});
