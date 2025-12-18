import type { InfiniteData } from '@tanstack/react-query'

import React, { useMemo, useRef } from 'react'
import {
  SectionList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

import { Theme } from '@/constants/Colors'

import { groupChatsData } from '@/utils/helpers'

import type { ChatSessionListType, IChatSession } from '@/types'

import { FlatListLoader } from '../emails/EmailsList'
import { CustomTextInput } from '../input/CustomTextInput'

const SearchContainer = ({
  inputRef,
  searchText,
  onSearch,
}: {
  inputRef: React.RefObject<TextInput | null>
  searchText: string
  onSearch: (value: string) => void
}) => {
  return (
    <ThemedView style={styles.searchContainer}>
      <CustomTextInput
        ref={inputRef}
        hideBorder
        value={searchText}
        inputMode="search"
        placeholder={'Search chat'}
        placeholderTextColor={Theme.brand.grey}
        inputContainerStyle={styles.inputContainerStyle}
        style={styles.textInputStyle}
        onChangeText={(value) => onSearch(value)}
      />
      <ThemedView style={styles.divider} />
    </ThemedView>
  )
}

const HeaderView = ({
  searchText,
  onSearch,
  showSearch,
  setShowSearch,
}: {
  searchText: string
  onSearch: (value: string) => void
  showSearch: boolean
  setShowSearch: (value: boolean) => void
}) => {
  const inputRef = useRef<TextInput>(null)
  return (
    <ThemedView>
      <ThemedView
        style={[
          styles.headerContainer,
          !showSearch && styles.headerRightContainer,
        ]}
      >
        {showSearch ? (
          <ThemedView
            style={styles.btnBack}
            onTouchEnd={() => setShowSearch(!showSearch)}
          >
            <Ionicons name="arrow-back-outline" size={24} />
          </ThemedView>
        ) : (
          <ThemedView
            style={styles.btnSearch}
            onTouchEnd={() => {
              setShowSearch(!showSearch)
              setTimeout(() => {
                inputRef.current?.focus()
              }, 400)
            }}
          >
            <Ionicons name="search-outline" size={24} />
          </ThemedView>
        )}
      </ThemedView>
      {showSearch && (
        <SearchContainer
          inputRef={inputRef}
          searchText={searchText}
          onSearch={onSearch}
        />
      )}
    </ThemedView>
  )
}

export const getGroupedNotifications = (
  data: InfiniteData<any, unknown> | undefined
) => {
  const chats =
    data?.pages.flatMap((page: { data: IChatSession[] }) => page.data) ?? []

  return groupChatsData(chats)
}

export const ChatSideMenu = ({
  data,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  onItemMenuPress,
  showSearch,
  setShowSearch,
  searchText,
  setSearchText,
}: {
  data: InfiniteData<any, unknown> | undefined
  isLoading: boolean
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  showSearch: boolean
  setShowSearch: (value: boolean) => void
  onItemMenuPress: (id: string) => void
  searchText: string
  setSearchText: (value: string) => void
}) => {
  const groupedNotifications: ChatSessionListType[] = useMemo(() => {
    if (!isLoading) {
      return getGroupedNotifications(data)
    }

    return []
  }, [data, isLoading])

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  return (
    <ThemedView style={styles.menuItems}>
      <HeaderView
        onSearch={handleSearch}
        searchText={searchText}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
      />
      <SectionList
        sections={groupedNotifications}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({
          item,
        }: {
          item: IChatSession
          section: { title: string }
          index: number
        }) => (
          <TouchableOpacity
            key={`item-${item}`}
            style={styles.menuItem}
            onPress={() => {
              onItemMenuPress(item.id)
            }}
          >
            <ThemedText style={styles.menuText} type="small">
              {item?.name}
            </ThemedText>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <FlatListLoader
            isFooter
            isFetchingNextPage={isFetchingNextPage}
            isItemsLoading={isLoading}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <ThemedText type="small" style={styles.listTitleText}>
            {title}
          </ThemedText>
        )}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage()
        }}
        onEndReachedThreshold={0.1}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <ThemedView style={styles.emptyScreen}>
            <ThemedText type="subtitle">No Chats</ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  emailSelection: {
    marginHorizontal: 24,
    zIndex: 10,
  },
  menuItems: {
    flex: 1,
    padding: 4,
  },
  menuList: {
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuText: {},

  // Header view
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerRightContainer: {
    justifyContent: 'flex-end',
  },
  btnBack: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSearch: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },

  // Search Container
  searchContainer: {
    flexDirection: 'column',
    // flex: 1,
  },
  inputContainerStyle: {
    // flex: 1,
    marginTop: 24,
  },
  textInputStyle: {
    fontSize: 12,
    lineHeight: 16,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Theme.brand.darkGray,
    marginTop: 8,
  },

  // List style
  listTitleText: {
    fontWeight: '500',
    paddingTop: 24,
    paddingBottom: 8,
    color: Theme.brand.black,
    backgroundColor: Theme.brand.white,
  },
  emptyScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { paddingBottom: 140, flexGrow: 1 },
})
