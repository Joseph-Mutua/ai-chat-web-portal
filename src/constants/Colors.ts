/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const Theme = {
  brand: {
    black: '#000000',
    white: '#FFFFFF',
    flashWhite: '#EBEBEB',
    grey: '#827F85',
    line: 'rgba(130, 127, 133, 0.4)',
    coolGrey: '#F4F5FA',
    coolBlue: '#e9edffc5',
    highlightGrey: '#cccfdb',
    green: '#006C67',
    emeraldGreen: '#50C878',
    eventBlue: '#1f8be2',
    purple: {
      50: '#F6F1FA',
      100: '#F6F0F9',
      200: '#EDE2FF',
      300: '#7B7B9B',
      500: '#531CB3',
      900: '#2F2F4B',
    },
    purple02: '#531CB333',
    red: '#BE1E2D',
    lightYellow: '#FCF5D2',
    goldenStar: '#FFD700',
    yellow: '#EBDA12',
    darkYellow: '#BA8E23',
    orange: '#F29559',
    lightGrey: '#F5F5F6',
    raspberryPink: '#D81B60',
    coralOrange: '#FF7043',
    tealGreen: '#009688',
    limeGreen: '#D4E157',
    periwinkleBlue: '#5C6BC0',
    redSalsa: '#E53935',
    sunflowerYellow: '#FFCA28',
    amber: '#FFB300',
    mediumGreen: '#4CAF50',
    deepCyan: '#0097A7',
    paleCornflowerBlue: '#A5B7E1',
    amethystPurple: '#9C4FBB',
    rosePink: '#F06292',
    charcoalBlue: '#2F2F4B',
    darkGray: '#757575',
    darkGrey400: '#707070',
    lightGreen: '#94E8B4',
    pink: '#F16192',
    orangeGradients: ['#FFE0AF', '#FAC8C8', '#CCF9FF'],
    thistle: '#D8BFD8',
    buttercup: '#f59e0b',

    greenGradient: '#E9F7F6',
    ghostWhite: '#F7F8FA',
    defaultNoteBackground: '#F4F5F9',

    borderGrey: '#D7DBE6',

    // New color picker colors
    lightTealCyan: '#CCE1E0',
    lightLavenderBlue: '#E4E9FE',
    lightCreamYellow: '#FFF8E5',
    lightMintGreen: '#DAF6E8',
    lightLavenderPink: '#F2DFEF',
    lightLavenderPurple: '#E5DDF3',
    lightSkyBlue: '#D8E6FC',
    lightGreyBlue: '#EEF1F3',
    lightPeach: '#FEE7CB',
    lightBlueGrey: '#E1E3E7',
    lightRosePink: '#FDF0ED',

    lavender: '#a2a3b9',

    //stroke colors
    periwinkleBlueStroke: '#7990F8',
    goldenSunburst: '#F6C547',
    mintGreen: '#46CF8B',
    orchidPurple: '#BC5EAD',
    royalLavender: '#7E57C2',
    brightAzure: '#4285F4',
    mistySteel: '#B0BEC5',
    amberOrange: '#FB8C00',
    slateGray: '#6D7889',
    blossomPink: '#F48FB1',
  } as const,

  // Redesign colours - todo After redesign clean up all colors and remove this comment.
  colors: {
    // Random colours
    label: '#6B6B6B',
    link: '#576BFA',
    inputPlaceholder: '#A0A0A0',
    lightBorder: '#E2E2E2',
    lightLine: '#DADADA',

    // Main Colours
    primary: '#006C67',
    primary80: '#006C67CC', // 80% opacity
    primary50: '#006C6780', // 50% opacity
    primary30: '#006C674D', // 30% opacity

    secondary: '#531CB3',
    secondary80: '#531CB3CC', // 80% opacity
    secondary50: '#531CB380', // 50% opacity
    secondary30: '#531CB34D', // 30% opacity

    error: '#BE1E2D',

    background: '#F4F5FA',
    grey: '#827F85',
    text: '#1E1E1E',

    // Drop shadow
    shadow: '#E0E3EB29', // 16% opacity

    // Secondary Colours
    primaryLight: '#E9F7F6',
    secondaryLighter: '#F6F0F9',
    greyLight: '#EBEBEB',
    darkBlue: '#2F2F4B',
    gold: '#FCCF1D',
    white: '#FFFFFF',
    black: '#000000',
    black30: '#0000004D',
    goldLight: '#FEF2C3',
    secondaryMedium: '#CEB8F2',
    secondaryLight: '#EDE2FF',
  },
}

export const Colors = {
  light: {
    text: Theme.brand.black,
    background: Theme.brand.white,
    tint: Theme.brand.grey,
    activeTint: Theme.brand.black,
    icon: Theme.brand.black,
    tabIconDefault: Theme.brand.black,
    tabIconSelected: Theme.brand.black,
  },
  dark: {
    text: Theme.brand.white,
    background: Theme.brand.black,
    tint: Theme.brand.grey,
    activeTint: Theme.brand.white,
    icon: Theme.brand.white,
    tabIconDefault: Theme.brand.white,
    tabIconSelected: Theme.brand.white,
  },
} as const
