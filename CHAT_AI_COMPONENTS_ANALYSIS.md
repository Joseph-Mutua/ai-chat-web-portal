# Chat-AI Components Analysis for Desktop Web Portal

## Overview
This document analyzes components in `src/components/chat-ai/` to determine which can be reused or adapted for the desktop web implementation.

---

## Components Analysis

### ✅ **FULLY REUSABLE (Logic/Concept Only)**

#### 1. **AssistantBubbleControls.tsx**
**Status**: ✅ **Reusable Logic, Needs Web Adaptation**
- **Current**: React Native component with Ionicons, Popover, clipboard functionality
- **Reusable Parts**:
  - Copy message/conversation logic
  - Thumbs up/down state management
  - Export document generation logic
  - Voice/speech functionality concept
- **Adaptation Needed**:
  - Replace `Ionicons` with web SVG icons
  - Replace `react-native-popover-view` with web popover (e.g., Radix UI, Headless UI)
  - Replace `expo-clipboard` with `navigator.clipboard`
  - Replace `expo-router` navigation with Next.js router
- **Priority**: **HIGH** - Already partially implemented in `message-bubble.tsx` but missing full functionality

#### 2. **SourceCard.tsx**
**Status**: ✅ **Reusable Logic, Needs Web Adaptation**
- **Current**: React Native component for displaying citation sources
- **Reusable Parts**:
  - Source display logic
  - Link handling
  - Logo/image rendering
- **Adaptation Needed**:
  - Replace React Native `View`, `Image`, `PressableOpacity` with HTML/Next.js equivalents
  - Replace `Linking.openURL` with standard anchor tags or `window.open`
  - Replace `Typography` component with web typography
- **Priority**: **MEDIUM** - Can enhance citations display in message bubbles

---

### ⚠️ **PARTIALLY REUSABLE (Core Logic, UI Needs Rewrite)**

#### 3. **ChatInputControls.tsx**
**Status**: ⚠️ **Partially Reusable**
- **Current**: React Native component with microphone/send button, gradient backgrounds
- **Reusable Parts**:
  - Speech-to-text hook logic (`useSpeechToText`)
  - Send/mic button toggle logic
  - Loading state handling
- **Already Implemented**: Basic send/mic functionality exists in `chat-input.tsx` and `chat-entry.tsx`
- **Adaptation Needed**:
  - Replace `LinearGradient` from expo with CSS gradients (already done)
  - Replace `TouchableOpacity` with web buttons
  - Integrate speech-to-text API for web (Web Speech API)
- **Priority**: **MEDIUM** - Enhance existing implementation

#### 4. **AttachmentPreview.tsx**
**Status**: ⚠️ **Partially Reusable**
- **Current**: React Native component for previewing attachments before sending
- **Reusable Parts**:
  - File type detection logic
  - File icon mapping
  - Remove attachment functionality
- **Adaptation Needed**:
  - Rewrite UI with HTML/React web components
  - Replace React Native `Image`, `Pressable` with web equivalents
  - Adapt file preview rendering for web
- **Priority**: **MEDIUM** - Needed for attachment feature

#### 5. **AttachmentModal.tsx**
**Status**: ⚠️ **Partially Reusable**
- **Current**: React Native modal for selecting attachments (camera, gallery, documents)
- **Reusable Parts**:
  - File picker logic
  - File validation logic (`validateAIInputDocFiles`)
  - Attachment type handling
- **Adaptation Needed**:
  - Replace `@react-native-documents/picker` with web file input
  - Replace `expo-image-picker` with web file input API
  - Rewrite modal UI with web modal component
  - Replace `react-native-gesture-handler` with web drag handlers
- **Priority**: **HIGH** - Core feature for attachments

#### 6. **ChatReportModal.tsx**
**Status**: ⚠️ **Partially Reusable**
- **Current**: React Native modal for reporting inappropriate messages
- **Reusable Parts**:
  - Report options/options list
  - API call logic (`useChatReportMessage`)
  - Form submission logic
- **Adaptation Needed**:
  - Rewrite modal UI with web modal
  - Replace React Native form components with web form elements
  - Replace gesture handlers with web equivalents
- **Priority**: **LOW** - Nice to have feature

---

### ❌ **NOT REUSABLE (Mobile-Specific)**

#### 7. **index.tsx (ChatAI)**
**Status**: ❌ **Not Reusable**
- **Reason**: Main container component, heavily React Native specific
- **Contains**: `KeyboardAvoidingView`, `Animated.FlatList`, mobile navigation patterns
- **Action**: Logic already implemented in `chat-layout.tsx`

#### 8. **ChatAssistantBubble.tsx**
**Status**: ❌ **Not Reusable**
- **Reason**: React Native specific, uses `react-native-markdown-display`
- **Action**: Already replaced with `message-bubble.tsx` using `react-markdown`

#### 9. **ChatHeaderView.tsx**
**Status**: ❌ **Not Reusable**
- **Reason**: Simple React Native header component
- **Action**: Already implemented in `chat-layout.tsx` header

#### 10. **ChatEntryView.tsx**
**Status**: ❌ **Not Reusable**
- **Reason**: React Native entry screen
- **Action**: Already implemented in `chat-entry.tsx`

#### 11. **ChatSideMenu.tsx**
**Status**: ❌ **Not Reusable**
- **Reason**: React Native drawer menu
- **Action**: Already implemented in `conversation-sidebar.tsx`

#### 12. **ChatDisabledView.tsx**
**Status**: ❌ **Not Reusable**
- **Reason**: React Native specific error view
- **Action**: Can create web equivalent if needed

#### 13. **AttachFileButton.tsx**
**Status**: ❌ **Not Reusable**
- **Reason**: Simple React Native button
- **Action**: Already implemented in `chat-input.tsx` and `chat-entry.tsx`

#### 14. **AttachmentOptionsModal.tsx**
**Status**: ⚠️ **Partially Reusable**
- **Reusable Parts**: Options logic
- **Adaptation Needed**: Full UI rewrite for web
- **Priority**: **MEDIUM** - If attachment options are needed

#### 15. **ImageViewerModal.tsx**
**Status**: ⚠️ **Partially Reusable**
- **Reusable Parts**: Image viewing concept
- **Adaptation Needed**: Rewrite with web image viewer/modal
- **Priority**: **LOW** - Can use simple modal with img tag

---

## Recommended Implementation Priority

### **HIGH PRIORITY**
1. **AssistantBubbleControls** - Enhance message bubble controls (copy, download, thumbs)
2. **AttachmentModal** - Core attachment functionality

### **MEDIUM PRIORITY**
3. **AttachmentPreview** - Show attachments before sending
4. **SourceCard** - Enhance citation display
5. **ChatInputControls** - Enhance speech-to-text integration

### **LOW PRIORITY**
6. **ChatReportModal** - Message reporting feature
7. **ImageViewerModal** - Image viewing enhancement
8. **AttachmentOptionsModal** - Advanced attachment options

---

## Key Adaptations Required

### **React Native → Web Replacements**
- `View` → `div`
- `Text` → `p`, `span`, `h1-h6`
- `TouchableOpacity` → `button`
- `Pressable` → `button` or `div` with onClick
- `Image` → Next.js `Image` component
- `Modal` → Web modal (Headless UI, Radix UI, or custom)
- `FlatList` → `div` with map or virtual scrolling library
- `Animated` → CSS transitions or Framer Motion
- `StyleSheet` → Tailwind CSS or CSS modules

### **Expo/React Native Libraries → Web Alternatives**
- `expo-clipboard` → `navigator.clipboard`
- `expo-image-picker` → HTML file input
- `@react-native-documents/picker` → HTML file input
- `expo-speech` → Web Speech API
- `expo-router` → Next.js router
- `react-native-popover-view` → Radix UI Popover or Headless UI
- `react-native-markdown-display` → `react-markdown` (already done)
- `Ionicons` → Heroicons, Lucide React, or custom SVGs

### **Hooks to Check/Adapt**
- `useSpeechToText` - Check if web-compatible or needs web adaptation
- `useAssistantManager` - Check if logic can be extracted for web
- `useChatReportMessage` - Should work if API is the same
- `useDraggableModal` - Replace with web drag handlers

---

## Summary

**Total Components**: 15
- ✅ **Fully Reusable (Logic)**: 2
- ⚠️ **Partially Reusable**: 6
- ❌ **Not Reusable**: 7

**Key Takeaway**: Most components need UI rewrites but contain valuable business logic that can be extracted and reused. Focus on adapting `AssistantBubbleControls` and `AttachmentModal` first as they provide core functionality missing from the current implementation.
