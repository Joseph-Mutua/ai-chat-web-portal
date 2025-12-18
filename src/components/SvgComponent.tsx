import { FC } from 'react'
import { StyleSheet } from 'react-native'
import { SvgProps } from 'react-native-svg'

import { ThemedView } from '@/components/ThemedView'

import Gmail from '@/assets/integrations/gmail.svg'
import GoogleCalendar from '@/assets/integrations/google_calendar.svg'
import GoogleContacts from '@/assets/integrations/google_contacts.svg'
import ICloudMail from '@/assets/integrations/icloud-mail.svg'
import OutlookCalendar from '@/assets/integrations/outlook_calendar.svg'
import OutlookContacts from '@/assets/integrations/outlook_contacts.svg'
import OutlookEmail from '@/assets/integrations/outlook_email.svg'
// Onboarding Svgs
import AppsPhone from '@/assets/onboarding/apps-phone.svg'
import AppleLogo from '@/assets/onboarding/logo-apple.svg'
import GoogleLogo from '@/assets/onboarding/logo-google.svg'
import MessageSent from '@/assets/onboarding/message-sent.svg'
// General Svgs
import alertCircle from '@/assets/svgs/alert-circle.svg'
import AllContacts from '@/assets/svgs/all-contacts.svg'
import AppleStoreIcon from '@/assets/svgs/apple-store-icon.svg'
import ArchiveIcon from '@/assets/svgs/archive-icon.svg'
import AttachAiChat from '@/assets/svgs/attach-ai-chat.svg'
import BookmarkGold from '@/assets/svgs/bookmark-gold.svg'
import BookmarkOutline from '@/assets/svgs/bookmark-outline.svg'
import calendarPlus from '@/assets/svgs/calendar-plus.svg'
import ClockHistory from '@/assets/svgs/clock-history.svg'
import DocumentDoc from '@/assets/svgs/documents-doc.svg'
import DocumentPDF from '@/assets/svgs/documents-pdf.svg'
import calendarIconMenu from '@/assets/svgs/drawer-menu/calendar-icon-menu.svg'
import chatIconMenu from '@/assets/svgs/drawer-menu/chat-icon-menu.svg'
import contacts from '@/assets/svgs/drawer-menu/contacts.svg'
import emailIconMemu from '@/assets/svgs/drawer-menu/email-icon-menu.svg'
import drawerLeftMenu from '@/assets/svgs/drawer-menu/filter-left.svg'
import notesIconMenu from '@/assets/svgs/drawer-menu/notes-icon-menu.svg'
import tasksIconMenu from '@/assets/svgs/drawer-menu/tasks-icon-menu.svg'
// Drawer Menu Svgs Imports
import warpSpeedIconMenu from '@/assets/svgs/drawer-menu/warpspeed-icon-menu.svg'
import EmailFlow from '@/assets/svgs/email-flow.svg'
import FileArrowUp from '@/assets/svgs/file-arrow-up.svg'
import FileTrayIcon from '@/assets/svgs/file-tray-full-outline.svg'
import FlameOutline from '@/assets/svgs/flame-outline.svg'
import forwardArrow from '@/assets/svgs/forward-arrow.svg'
import GooglePlayIcon from '@/assets/svgs/google-play-icon.svg'
import iCloud from '@/assets/svgs/icloud.svg'
import MailIcon from '@/assets/svgs/mail-icon.svg'
import NoChats from '@/assets/svgs/no-chats.svg'
import NoTasks from '@/assets/svgs/no-tasks-image.svg'
import NewGroupSvg from '@/assets/svgs/people-outline.svg'
import NewContactSvg from '@/assets/svgs/person-add-outline.svg'
import Pin from '@/assets/svgs/pin.svg'
import PlusSquare from '@/assets/svgs/plus-square.svg'
import Redo from '@/assets/svgs/redo.svg'
import ReplyAll from '@/assets/svgs/reply-all.svg'
import ReplyFilled from '@/assets/svgs/reply-filled.svg'
import Reply from '@/assets/svgs/reply.svg'
import SidekickInfoLogo from '@/assets/svgs/sidekick/sidekick-logo.svg'
import LowCreditIcon from '@/assets/svgs/subscriptions/credits-low-graphic.svg'
import UpgCreditIcon from '@/assets/svgs/subscriptions/upgrade-sub-graphic.svg'
import topArrowIcon from '@/assets/svgs/top-arrow-icon.svg'
import activityFilledColour from '@/assets/svgs/tour-svgs/activity-filled-colour.svg'
import alertCircleColour from '@/assets/svgs/tour-svgs/alert-circle-colour.svg'
import appsColour from '@/assets/svgs/tour-svgs/apps-colour.svg'
import attachColour from '@/assets/svgs/tour-svgs/attach-colour.svg'
import bookmarkColour from '@/assets/svgs/tour-svgs/bookmark-colour.svg'
import calendarColour from '@/assets/svgs/tour-svgs/calendar-colour.svg'
import calendar from '@/assets/svgs/tour-svgs/calendar.svg'
import chat from '@/assets/svgs/tour-svgs/chat.svg'
import chatbubbleEllipsesColour from '@/assets/svgs/tour-svgs/chatbubble-ellipses-colour.svg'
import colorsFilterColour from '@/assets/svgs/tour-svgs/color-filter-colour.svg'
import colorWandColour from '@/assets/svgs/tour-svgs/color-wand-colour.svg'
import compassColour from '@/assets/svgs/tour-svgs/compass-colour.svg'
import createColour from '@/assets/svgs/tour-svgs/create-colour.svg'
import cutColour from '@/assets/svgs/tour-svgs/cut-colour.svg'
import documentsColour from '@/assets/svgs/tour-svgs/documents-colour.svg'
import EmailFlowSwipes from '@/assets/svgs/tour-svgs/email-flow-swipes.svg'
import EmailFlowTour from '@/assets/svgs/tour-svgs/email-flow-tour.svg'
import email from '@/assets/svgs/tour-svgs/email.svg'
import flashOutlineColour from '@/assets/svgs/tour-svgs/flash-outline-colour.svg'
import EmailDashboard from '@/assets/svgs/tour-svgs/flying-email.svg'
import footstepsOutlineColour from '@/assets/svgs/tour-svgs/footsteps-outline-colour.svg'
import houseFilledColour from '@/assets/svgs/tour-svgs/home-filled-colour.svg'
import listColour from '@/assets/svgs/tour-svgs/list-colour.svg'
import notes from '@/assets/svgs/tour-svgs/notes.svg'
import peopleCircleColour from '@/assets/svgs/tour-svgs/people-circle-colour.svg'
import searchCircleColour from '@/assets/svgs/tour-svgs/search-circle-colour.svg'
import sendColour from '@/assets/svgs/tour-svgs/send-colour.svg'
import sparklesColour from '@/assets/svgs/tour-svgs/sparkles-colour.svg'
import tasksColour from '@/assets/svgs/tour-svgs/tasks-colour.svg'
import tasks from '@/assets/svgs/tour-svgs/tasks.svg'
import warpSpeedColour from '@/assets/svgs/tour-svgs/warpspeed-icon-colour.svg'
import Unarchive from '@/assets/svgs/unarchive.svg'
import Undo from '@/assets/svgs/undo.svg'
import Unpin from '@/assets/svgs/unpin.svg'
import WarpSpeedAiActive from '@/assets/svgs/warpspeed-ai-active.svg'
import WarpSpeedAiInactive from '@/assets/svgs/warpspeed-ai-inactive.svg'
import WarpSpeedAiWhite from '@/assets/svgs/warpspeed-ai-white.svg'
// Ws Tools Svgs Imports
import AddTagsSvg from '@/assets/svgs/ws-tools/add-tags.svg'
import CopyTextSvg from '@/assets/svgs/ws-tools/copy-text.svg'
import CreateSvg from '@/assets/svgs/ws-tools/create.svg'
import EditTextSvg from '@/assets/svgs/ws-tools/edit-text.svg'
import LinkToSvg from '@/assets/svgs/ws-tools/link-to.svg'
import OpenInNotesSvg from '@/assets/svgs/ws-tools/open-in-notes.svg'
import ProofreadSvg from '@/assets/svgs/ws-tools/proofread.svg'
import QuickResponseSvg from '@/assets/svgs/ws-tools/quick-response.svg'
import RewriteSvg from '@/assets/svgs/ws-tools/rewrite.svg'
import SummariseSvg from '@/assets/svgs/ws-tools/summarise.svg'
import TidyNoteSvg from '@/assets/svgs/ws-tools/tidy-note.svg'
import ToneChangeSvg from '@/assets/svgs/ws-tools/tone-change.svg'

const svgConfig: { [key: string]: FC<SvgProps> } = {
  'google_calendar.svg': GoogleCalendar,
  'google_contacts.svg': GoogleContacts,
  'outlook_contacts.svg': OutlookContacts,
  'gmail.svg': Gmail,
  'warpspeed-ai-active': WarpSpeedAiActive,
  'archive-icon': ArchiveIcon,
  'warpspeed-ai-inactive': WarpSpeedAiInactive,
  'warpspeed-ai-white': WarpSpeedAiWhite,
  'file-arrow-up': FileArrowUp,
  'clock-history': ClockHistory,
  'plus-square': PlusSquare,
  'bookmark-gold': BookmarkGold,
  'bookmark-outline': BookmarkOutline,
  'outlook_calendar.svg': OutlookCalendar,
  'outlook_email.svg': OutlookEmail,
  'icloud.svg': iCloud,
  'icloud-mail': ICloudMail,
  'mail-icon': MailIcon,
  'all-contacts': AllContacts,
  'attach-ai-chat': AttachAiChat,
  'documents-doc': DocumentDoc,
  'documents-pdf': DocumentPDF,
  'email-flow': EmailFlow,
  'flame-outline': FlameOutline,
  'reply-filled': ReplyFilled,
  reply: Reply,
  'reply-all': ReplyAll,
  'sidekick-info-logo': SidekickInfoLogo,

  // Onboarding Svgs
  'apps-phone': AppsPhone,
  'message-sent': MessageSent,
  'apple-logo': AppleLogo,
  'google-logo': GoogleLogo,

  // Drawer Menu Svgs
  'warpspeed-icon-menu': warpSpeedIconMenu,
  'tasks-icon-menu': tasksIconMenu,
  'notes-icon-menu': notesIconMenu,
  'email-icon-menu': emailIconMemu,
  'chat-icon-menu': chatIconMenu,
  'calendar-icon-menu': calendarIconMenu,
  'drawer-left-icon': drawerLeftMenu,

  // App Release Icons
  'apple-store-icon': AppleStoreIcon,
  'google-play-icon': GooglePlayIcon,

  // Tour Svgs
  'warpspeed-icon-colour': warpSpeedColour,
  'home-icon-colour': houseFilledColour,
  'activity-icon-colour': activityFilledColour,
  'flash-icon-colour': flashOutlineColour,
  'footsteps-icon-colour': footstepsOutlineColour,
  'compass-icon-colour': compassColour,
  'people-icon-colour': peopleCircleColour,
  'send-icon-colour': sendColour,
  'calendar-icon-colour': calendarColour,
  'colors-icon-colour': colorsFilterColour,
  'list-icon-colour': listColour,
  'chatbubble-ellipses-icon-colour': chatbubbleEllipsesColour,
  'documents-icon-colour': documentsColour,
  'apps-icon-colour': appsColour,
  'create-icon-colour': createColour,
  'search-circle-colour': searchCircleColour,
  'color-wand-colour.svg': colorWandColour,
  'cut-colour': cutColour,
  'alert-circle-colour': alertCircleColour,
  'sparkles-colour': sparklesColour,
  'tasks-colour': tasksColour,
  tasks: tasks,
  'bookmark-colour': bookmarkColour,
  'attach-colour': attachColour,
  'email-dashboard': EmailDashboard,
  'email-flow-tour': EmailFlowTour,
  'email-flow-swipes': EmailFlowSwipes,
  notes: notes,
  chat: chat,
  email: email,
  calendar: calendar,
  contacts: contacts,
  'top-arrow-icon': topArrowIcon,
  'alert-circle': alertCircle,
  'calendar-plus': calendarPlus,
  'low-credit-icon': LowCreditIcon,
  'upg-credit-icon': UpgCreditIcon,
  pin: Pin,
  unarchive: Unarchive,
  unpin: Unpin,
  'file-tray-full-outline': FileTrayIcon,
  'no-tasks-image': NoTasks,

  // Ws Tools Svgs
  'create-icon': CreateSvg,
  'proofread-icon': ProofreadSvg,
  'summarise-icon': SummariseSvg,
  'tidy-note-icon': TidyNoteSvg,
  'rewrite-icon': RewriteSvg,
  'add-tags-icon': AddTagsSvg,
  'copy-text-icon': CopyTextSvg,
  'tone-change-icon': ToneChangeSvg,
  'quick-response-icon': QuickResponseSvg,
  'forward-arrow': forwardArrow,
  'no-chats-found': NoChats,
  'new-contact-icon': NewContactSvg,
  'new-group-icon': NewGroupSvg,
  'edit-text-icon': EditTextSvg,
  'link-to-icon': LinkToSvg,
  'open-in-notes-icon': OpenInNotesSvg,
  undo: Undo,
  redo: Redo,
}

interface SVGProps {
  width?: number
  height?: number
  color?: string
}

export const SvgComponent = ({
  slug,
  ...props
}: { slug: string } & SVGProps) => {
  const Component = svgConfig[slug]

  return Component ? (
    <Component {...props} />
  ) : (
    <ThemedView
      style={[
        styles.placeholder,
        { width: props.width || 48, height: props.height || 48 },
      ]}
    />
  )
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: 'transparent',
  },
})
