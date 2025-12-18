import Constants from 'expo-constants'

import {
  getRemoteFeatureFlag,
  isRemoteFeatureFlagExists,
} from '@/utils/firebase-remote-config'

export function useFeatureFlag(slug: string): boolean {
  const localFeatureFlags = Constants.expoConfig?.extra?.featureFlags ?? {}

  // Check if local flag exists
  if (typeof localFeatureFlags[slug] !== 'boolean') {
    const availableFlags = Object.keys(localFeatureFlags)
    throw new Error(
      [
        `Feature flag "${slug}" is missing.`,
        `Available flags: ${availableFlags.length ? availableFlags.join(', ') : '(none)'}.`,
        `Check "extra.featureFlags" in app.config.ts.`,
      ].join(' ')
    )
  }

  const localFlagValue = localFeatureFlags[slug]

  // If local flag is false, return false immediately (no need to check remote)
  if (!localFlagValue) {
    return false
  }

  // Check if remote flag actually exists (not just default value)
  const remoteFlagExists = isRemoteFeatureFlagExists(slug)

  // If remote flag does not exist, use local flag only
  if (!remoteFlagExists) {
    return localFlagValue
  }

  // Get remote flag value
  const remoteFlagValue = getRemoteFeatureFlag(slug)

  // Both local and remote must be true for feature to be enabled
  return localFlagValue && remoteFlagValue
}
