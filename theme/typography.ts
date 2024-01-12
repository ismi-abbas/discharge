import {
  Inter_100Thin as InterThin,
  Inter_200ExtraLight as InterExtraLight,
  Inter_300Light as InterLight,
  Inter_400Regular as InterRegular,
  Inter_500Medium as InterMedium,
  Inter_600SemiBold as InterSemiBold,
  Inter_700Bold as InterBold,
  Inter_800ExtraBold as InterExtraBold,
  Inter_900Black as InterBlack,
} from '@expo-google-fonts/inter';
import { Platform } from 'react-native';

export const customFontsToLoad = {
  InterBlack,
  InterThin,
  InterExtraLight,
  InterLight,
  InterRegular,
  InterMedium,
  InterSemiBold,
  InterBold,
  InterExtraBold,
};

const fonts = {
  Inter: {
    black: 'InterBlack',
    thin: 'InterThin',
    extraLight: 'InterExtraLight',
    light: 'InterLight',
    normal: 'InterRegular',
    medium: 'InterMedium',
    semibold: 'InterSemiBold',
    bold: 'InterBold',
    extraBold: 'InterExtraBold',
  },
  helveticaNeue: {
    thin: 'HelveticaNeue-Thin',
    light: 'HelveticaNeue-Light',
    normal: 'Helvetica Neue',
    medium: 'HelveticaNeue-Medium',
  },
  courier: {
    normal: 'Courier',
  },
  sansSerif: {
    thin: 'sans-serif-thin',
    light: 'sans-serif-light',
    normal: 'sans-serif',
    medium: 'sans-serif-medium',
  },
  monospace: {
    normal: 'monospace',
  },
};

export const typography = {
  fonts,
  primary: fonts.Inter,
  secondary: Platform.select({
    ios: fonts.helveticaNeue,
    android: fonts.sansSerif,
  }),
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
};
