export type ContentType = 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT'
export type ImportSource = 'URL' | 'TELEGRAM_FILE' | 'MESSENGER_FILE'

export type BookmarkContent = {
  id: string
  url: string
  source?: string
  createdAt: string
  contentType: ContentType
  importSource: ImportSource
  metadata: ContentMetadata
  detailData: DetailData
  groupIndex?: number
  group?: number
}

export type ContentMetadata = {
  title: string
  description?: string
}

type DetailData = {
  title: string
  content: string
  keynotes: string
  description: string
  transcription: string
}

export type BookmarkInfoType = {
  bookmark: BookmarkContent
  index: number
}

export type DataType = {
  list: BookmarkContent[]
  groups: number[]
  groupCounts: number[]
  contentType: 'ALL' | ContentType
}

export type Notification = {
  type?: string
  message: string
  timeout?: number
}
