import React from 'react'
import { Linking, StyleSheet, Text } from 'react-native'

import { Theme } from '@/constants/Colors'

export const RenderRules = {
  link: (
    node: any,
    children: any,
    _parent: any,
    _styles: any,
    onLinkPress: any
  ) => {
    const url = node.attributes.href

    return (
      <Text
        key={node.key}
        style={styles.link}
        onPress={() => {
          if (onLinkPress) {
            const handled = onLinkPress(url)
            if (!handled) {
              Linking.openURL(url)
            }
          } else {
            Linking.openURL(url)
          }
        }}
      >
        {children}
      </Text>
    )
  },
}

const styles = StyleSheet.create({
  link: {
    backgroundColor: Theme.brand.coolGrey,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginHorizontal: 2,
    borderRadius: 4,
    color: Theme.brand.black,
    textDecorationLine: 'none',
    overflow: 'hidden',
  },
})
