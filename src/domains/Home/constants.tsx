import { BookmarkContent, ContentType, ImportSource } from 'types/home'

export const CONTENT_TYPES: Record<'ALL' | ContentType, { value: 'ALL' | ContentType; label: string }> = {
  ALL: { value: 'ALL', label: 'All' },
  TEXT: { value: 'TEXT', label: 'Text' },
  IMAGE: { value: 'IMAGE', label: 'Image' },
  VIDEO: { value: 'VIDEO', label: 'Video' },
  AUDIO: { value: 'AUDIO', label: 'Audio' },
  DOCUMENT: { value: 'DOCUMENT', label: 'Document' },
}

export const UPLOAD_SOURCE: Record<ImportSource, string> = {
  TELEGRAM_FILE: 'Telegram',
  MESSENGER_FILE: 'Messenger',
  URL: 'Url',
}

export const LIMIT_ITEM_PER_REQUEST = 10

export const TIME_TO_CANCEL_UNDO_BOOKMARK = 2000
