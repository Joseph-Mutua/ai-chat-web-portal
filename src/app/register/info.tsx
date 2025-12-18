import { ImageBackground, Platform, Pressable, StyleSheet } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { type RelativePathString, useRouter } from 'expo-router'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { GradientProgressBar } from '@/components/gradient-progress-bar/GradientProgressBar'
import { ScrollContainer } from '@/components/page/ScrollContainer'

import { Theme } from '@/constants/Colors'

export default function InfoScreen() {
  const router = useRouter()
  const onPressBack = () => {
    router.back()
  }

  const onPressNext = () => {
    router.push('/register/integrations' as RelativePathString)
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollContainer style={styles.scrollContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedView style={styles.topBgImages}>
            <ThemedView style={styles.topLeftBgImage}>
              <ImageBackground
                source={require('@/assets/images/login/login-boxes-background.png')}
                imageStyle={{ width: 120, height: 220 }}
              />
            </ThemedView>
            <ThemedView style={styles.topRightBgImage}>
              <ImageBackground
                source={require('@/assets/images/login/login-circles-background.png')}
                imageStyle={{ width: 96, height: 220 }}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.contentContainer}>
          <ThemedView style={styles.pageContainer}>
            <ThemedText type="header" style={styles.title}>
              Let's get you connected
            </ThemedText>
            <ThemedText
              type="default"
              style={[styles.descriptionText, { marginHorizontal: 32 }]}
            >
              To help warpSpeed turbocharge your productivity, connect as many
              of your favourite apps as possible!
            </ThemedText>
            <ThemedText type="default" style={styles.descriptionText}>
              It's our engineer's mission to make this process a breeze because
              we believe in giving you back your precious time.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.rowContainer}>
            <Pressable onPress={onPressBack}>
              <ThemedView style={styles.circleContainer}>
                <Ionicons name={'chevron-back-outline'} size={40} />
              </ThemedView>
            </Pressable>
            <Pressable onPress={onPressNext}>
              <ThemedView style={styles.circleContainer}>
                <Ionicons name={'chevron-forward-outline'} size={40} />
              </ThemedView>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ScrollContainer>
      <GradientProgressBar progress={80} />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 0,
    flex: 1,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  topBgImages: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  topLeftBgImage: {
    width: 120,
    height: 220,
  },
  topRightBgImage: {
    width: 96,
    height: 220,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
  },
  descriptionText: {
    marginVertical: 10,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  pageContainer: {
    height: '56%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
    paddingTop: 10,
  },
  circleContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.brand.black,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0.8, height: 0.8 },
    shadowRadius: 1,
    elevation: Platform.OS == 'android' ? 10 : 0,
  },
  roundContainer: {
    height: 170,
    width: 170,
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: Theme.brand.black,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0.8, height: 0.8 },
    shadowRadius: 1,
    elevation: Platform.OS == 'android' ? 10 : 0,
    marginBottom: 10,
  },
})
