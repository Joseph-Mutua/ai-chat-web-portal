import React, { ComponentProps } from 'react'
import {
  Modal,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Switch,
  TextInput,
  TextInputFocusEventData,
  TextStyle,
  ViewStyle,
} from 'react-native'

import { Feather, Ionicons } from '@expo/vector-icons'

import { RelativePathString, router, usePathname } from 'expo-router'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { CustomTextInput } from '@/components/input/CustomTextInput'

import { Theme } from '@/constants/Colors'

import { useUser } from '@/hooks/api'

import { getNewDesignStatus } from '@/utils/newDesign'

import { SvgComponent } from '../SvgComponent'

interface Item {
  name: string
  onPress: () => void
}

export function TopSearchAddBar({
  inputRef,
  searchText,
  placeholderText,
  containerStyle,
  customTextInputContainerStyle,
  iconName,
  iconSize,
  onPressSearch,
  onPressMenu,
  isMenu = true,
  isOption = true,
  options = [],
  isGroupByDate = false,
  searchContainerStyle = {},
  hasRightButton,
  displayUserCircle,
  onPressRightButton,
  onPressCloseButton,
  hasCloseButton,
  onFocus,
  renderCustomOptions,
  showBackIcon = false,
  onBackPress,
}: {
  inputRef?: React.RefObject<TextInput>
  isMenu?: boolean
  isOption?: boolean
  options?: Item[]
  displayUserCircle?: boolean
  hasRightButton?: boolean
  isGroupByDate?: boolean
  searchContainerStyle?: ViewStyle
  searchText: string
  placeholderText?: string
  containerStyle?: ViewStyle
  customTextInputContainerStyle?: StyleProp<TextStyle>
  iconName?: ComponentProps<typeof Ionicons>['name']
  iconSize?: number
  onPressSearch: (text: string) => void
  onPressMenu?: () => void
  onPressRightButton?: () => void
  onPressCloseButton?: () => void
  hasCloseButton?: boolean
  onFocus?:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined
  renderCustomOptions?: () => React.ReactNode
  showBackIcon?: boolean
  onBackPress?: () => void
}) {
  const user = useUser()

  const pathname = usePathname()
  const isNewDesign = getNewDesignStatus(pathname)

  const [visible, setVisible] = React.useState<boolean>(false)

  const toggleVisibility = () => setVisible(!visible)

  const onSearch = (value: string) => {
    onPressSearch(value)
  }

  const renderOptionsButton = () => {
    if (!isOption) return null

    if (isNewDesign) {
      return (
        <Pressable
          onPress={toggleVisibility}
          style={[
            styles.newDesignEllipsis,
            { backgroundColor: Theme.brand.white, alignSelf: 'flex-start' },
          ]}
        >
          <ThemedView style={styles.menuItemMoreHorizontal}>
            <Feather
              name="more-horizontal"
              size={16}
              color={Theme.brand.black}
            />
          </ThemedView>
        </Pressable>
      )
    }

    return (
      <Pressable onPress={toggleVisibility}>
        <Ionicons name="ellipsis-vertical-sharp" size={22} />
      </Pressable>
    )
  }

  const renderBackIcon = () => {
    return (
      <Pressable
        onPress={onBackPress}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back-outline" size={28} color="black" />
      </Pressable>
    )
  }

  const searchBarContent = (
    <ThemedView
      style={[
        styles.topBarContainer,
        isNewDesign && styles.newDesignContainer,
        containerStyle,
        { ...searchContainerStyle },
      ]}
    >
      {isMenu && onPressMenu && !isNewDesign && (
        <Pressable onPress={onPressMenu}>
          <SvgComponent slug="drawer-left-icon" width={32} height={32} />
        </Pressable>
      )}
      <CustomTextInput
        ref={inputRef}
        hideBorder
        value={searchText}
        inputMode="search"
        placeholder={placeholderText ?? 'Search'}
        placeholderTextColor={Theme.brand.grey}
        inputContainerStyle={styles.inputContainerStyle}
        style={[
          styles.textInputStyle,
          isNewDesign && { fontSize: 16 },
          customTextInputContainerStyle,
        ]}
        onFocus={onFocus}
        onChangeText={(value) => onSearch(value)}
        allowFontScaling={false}
      />

      {isNewDesign && (
        <Ionicons
          name="search"
          size={25}
          color={Theme.colors.inputPlaceholder}
        />
      )}

      {hasRightButton && (
        <Pressable onPress={onPressRightButton}>
          <Ionicons name="funnel-outline" size={22} />
        </Pressable>
      )}

      {displayUserCircle && !searchText && (
        <Pressable
          style={styles.userContainer}
          onPress={() => {
            router.push('/calendar/settings' as RelativePathString)
          }}
        >
          <ThemedText type="small" style={styles.userText}>
            {user?.data?.firstName.charAt(0) + user?.data?.lastName.charAt(0)}
          </ThemedText>
        </Pressable>
      )}
      {displayUserCircle && searchText != '' && (
        <Pressable onPress={() => onSearch('')}>
          <ThemedText type="defaultSemiBold" style={{ fontSize: 14 }}>
            Clear
          </ThemedText>
        </Pressable>
      )}
      {hasCloseButton && (
        <Pressable
          onPress={() => {
            onSearch('')
            onPressCloseButton?.()
          }}
        >
          <Ionicons name="close" size={22} />
        </Pressable>
      )}

      {!isNewDesign && isOption && renderOptionsButton()}

      {!isNewDesign && renderCustomOptions?.()}
    </ThemedView>
  )

  if (isNewDesign) {
    return (
      <ThemedView style={styles.newDesignWrapper}>
        {showBackIcon && renderBackIcon()}
        {searchBarContent}
        {renderCustomOptions?.()}
        {isOption && renderOptionsButton()}
        {!!options.length && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={toggleVisibility}
          >
            <Pressable style={styles.overlay} onPress={toggleVisibility}>
              <ThemedView style={[styles.menuContainer, { top: 200 }]}>
                {options.map((item) => {
                  let isGroupByDateOption = item.name === 'Group by Date'
                  return (
                    <Pressable
                      key={item.name}
                      style={[
                        styles.menuItem,
                        isGroupByDateOption && styles.menuItemWithToggle,
                      ]}
                      onPress={() => {
                        if (!isGroupByDateOption) {
                          toggleVisibility()
                        }
                        item.onPress()
                      }}
                    >
                      <ThemedText style={styles.menuItemText}>
                        {item.name}
                      </ThemedText>
                      {isGroupByDateOption && (
                        <Switch
                          value={isGroupByDate}
                          onValueChange={() => item.onPress()}
                          trackColor={{
                            false: Theme.brand.grey,
                            true: Theme.brand.purple[500],
                          }}
                          style={{
                            transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
                          }}
                          thumbColor={Theme.brand.white}
                          ios_backgroundColor={Theme.brand.grey}
                        />
                      )}
                    </Pressable>
                  )
                })}
              </ThemedView>
            </Pressable>
          </Modal>
        )}
      </ThemedView>
    )
  }

  // Old design
  return (
    <>
      {searchBarContent}
      {!!options.length && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={visible}
          onRequestClose={toggleVisibility}
        >
          <Pressable style={styles.overlay} onPress={toggleVisibility}>
            <ThemedView style={styles.menuContainer}>
              {options.map((item) => {
                let isOptionGBD = item.name === 'Group by Date'
                return (
                  <Pressable
                    key={item.name}
                    style={styles.menuItem}
                    onPress={() => {
                      toggleVisibility()
                      item.onPress()
                    }}
                  >
                    <ThemedText style={styles.menuItemText}>
                      {item.name}
                    </ThemedText>
                    {isOptionGBD && (
                      <ThemedView
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <ThemedText
                          style={{
                            fontWeight: 'bold',
                            color:
                              (isGroupByDate && Theme.brand.black) ||
                              Theme.brand.grey,
                          }}
                        >
                          On
                        </ThemedText>
                        <ThemedText
                          style={{
                            fontWeight: 'bold',
                            color:
                              (isGroupByDate && Theme.brand.grey) ||
                              Theme.brand.black,
                          }}
                        >
                          |
                        </ThemedText>
                        <ThemedText
                          style={{
                            fontWeight: 'bold',
                            color:
                              (isGroupByDate && Theme.brand.grey) ||
                              Theme.brand.black,
                          }}
                        >
                          Off
                        </ThemedText>
                      </ThemedView>
                    )}
                  </Pressable>
                )
              })}
            </ThemedView>
          </Pressable>
        </Modal>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  topBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Theme.brand.green,
    borderRadius: 12,
    height: 45,
    paddingHorizontal: 10,
    gap: 8,
  },
  inputContainerStyle: {
    flex: 1,
  },
  textInputStyle: {
    width: '90%',
    height: '70%',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    flex: 1,
    ...(Platform.OS === 'ios' && { paddingTop: '2.5%' }),
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    backgroundColor: Theme.brand.white,
    position: 'absolute',
    top: 120,
    right: 10,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 0,
    shadowColor: Theme.brand.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 200,
  },
  menuItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemWithToggle: {
    paddingRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '400',
    color: Theme.brand.black,
  },
  userContainer: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: Theme.brand.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userText: {
    color: Theme.brand.white,
  },

  newDesignContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: Theme.colors.lightBorder,
    borderRadius: 0,
    backgroundColor: Theme.brand.white,
    marginBottom: 0,
    paddingHorizontal: 16,
    height: 48,
  },
  newDesignEllipsis: {
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newDesignWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
    backgroundColor: Theme.brand.ghostWhite,
  },
  menuItemMoreHorizontal: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.3,
    borderColor: Theme.brand.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.brand.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Theme.brand.white,
    boxShadow: '-3px 7px 13px #F1F7FF',
  },
})
