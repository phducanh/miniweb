import { BookmarkContent, ContentType } from 'types/home'
import { LIMIT_ITEM_PER_REQUEST } from './constants'
import moment from 'moment'
import { gql } from '@apollo/client'

const contentTypeData: ContentType[] = ['AUDIO', 'DOCUMENT', 'IMAGE', 'TEXT', 'VIDEO']

type GetBookmarkListRequestParams = {
  from_id: string
  contentType?: ContentType
}

export const GET_BOOKMARK_LIST = gql`
  query BookmarkContents($fromId: String, $contentType: ContentType) {
    bookmarkContents(
      bookmarkFilter: { contentType: $contentType }
      pagination: { limit: 10, fromId: $fromId }
      order: { orderField: "created_at", orderType: DESC }
    ) {
      id
      contentType
      url
      metadata {
        title
        description
      }
      importSource
      createdAt
      detailData
    }
  }
`

export const DELETE_BOOKMARK_CONTENT = gql`
  mutation DeleteBookmarkContent($bookmarkContentId: String!) {
    deleteBookmarkContent(
      bookmarkContentId: $bookmarkContentId,
      validUndoTime: 5
    )
  }
`

export const UNDO_DELETE_BOOKMARK = gql`
  mutation UndoDeleteBookmarkContent($bookmarkContentId: String!) {
    undoDeleteBookmarkContent(bookmarkContentId: $bookmarkContentId)
  }
`

export const UPDATE_KEYNOTE = gql`
  mutation UpdateKeyNotes($bookmarkContentId: String!, $keynotes: String!) {
    updateKeyNotes(bookmarkContentId: $bookmarkContentId, keynotes: $keynotes)
  }
`

export const UPDATE_IMAGE_DESCRIPTION = gql`
  mutation UpdateImageDescription($bookmarkContentId: String!, $description: String!) {
    updateImageDescription(bookmarkContentId: $bookmarkContentId, description: $description)
  }
`
