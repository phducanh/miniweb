import styles from './BookmarkDetail.module.scss'
import { BookmarkInfoType } from 'types/home'
import { FC, useRef, useState, useEffect } from 'react'
import moment from 'moment'
import { CONTENT_TYPES } from '../constants'
import Info from './Info'
import { useClickOutside } from 'hooks/clickOutSide'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { deleteBookmark } from 'redux/slices/app'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { DELETE_BOOKMARK_CONTENT } from 'domains/Home/actions'

type BookmarkDetailProps = {
  info: BookmarkInfoType
  onBack: () => void
}

const BookmarkDetail: FC<BookmarkDetailProps> = ({ onBack, info }) => {
  const { index, bookmark } = info
  const [isShowDelete, setIsShowDelete] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  useClickOutside(menuRef, () => {
    setIsShowDelete(false)
  })

  const router = useRouter();
  const token = router.query.token;
  const list = useAppSelector((state) => state.app.data?.list) || []
  const [removeBookmark, { data, loading, error }] = useMutation(
    DELETE_BOOKMARK_CONTENT, {
      context: {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      },
    }
  )

  const getDataTypeIcon = () => {
    switch (bookmark.contentType) {
      case 'TEXT': {
        return '/images/input-text.png'
      }
      case 'AUDIO': {
        return '/images/input-radio.svg'
      }
      case 'DOCUMENT': {
        return '/images/input-file.png'
      }
      case 'IMAGE': {
        return '/images/input-image.png'
      }
      case 'VIDEO': {
        return '/images/input-video.svg'
      }
    }
  }

  const getSourceIcon = () => {
    switch (bookmark.contentType) {
      case 'AUDIO': {
        return <img src="/images/audio.svg" alt="icon source" className={styles.audioIcon} />
      }
      case 'DOCUMENT': {
        return <img src="/images/document.png" alt="icon source" className={styles.documentIcon} />
      }
      case 'VIDEO': {
        return <img src="/images/audio.png" alt="icon source" className={styles.audioIcon} />
      }
    }
  }

  const getAccessDescription = () => {
    switch (bookmark.contentType) {
      case 'AUDIO': {
        return <div className={styles.accessText}>Access your audio here</div>
      }
      case 'DOCUMENT': {
        return (
          <div className={styles.accessInfo}>
            <div className={styles.fileName}>{bookmark.metadata.title}</div>
            <div className={styles.fileSize}>24KB</div>
          </div>
        )
      }
      case 'VIDEO': {
        return <div className={styles.accessText}>Access your video here</div>
      }
    }
  }

  const handleShowDelete = () => {
    setIsShowDelete(true)
  }

  const handleDelete = () => {
    if (loading) {
      return
    }
    removeBookmark({ variables: { bookmarkContentId: list[index].id } })
    dispatch(deleteBookmark(index))
    onBack()
  }

  // useEffect(() => {
  //   if (data) {
  //     dispatch(deleteBookmark(index))
  //     onBack()
  //   }
  // }, [data])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerCover}>
          <img src="/images/back.png" alt="back icon" className={styles.headerIcon} onClick={onBack} />
          <img src="/images/menu.png" alt="menu icon" className={styles.headerIcon} onClick={handleShowDelete} />
          {isShowDelete && (
            <div ref={menuRef} className={styles.deleteContainer} onClick={handleDelete}>
              <span className={styles.deleteText}>Remove from saves</span>
              <img src="/images/small-delete.svg" alt="delete icon" className={styles.deleteIcon} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.detailContent}>
          <div className={styles.detailContentHeader}>
            {bookmark.importSource !== 'URL' && (
              <img src={getDataTypeIcon()} className={styles.dataTypeIcon} alt="data type icon" />
            )}
            {(bookmark.importSource !== 'URL' && bookmark.contentType === 'TEXT') ? (
              <h1 className={styles.title}>Note</h1>
            ) : (
              <h1 className={styles.title}>{bookmark.metadata.title}</h1>
            )}
          </div>
          {bookmark.importSource === 'URL' && (
            <div className={styles.description}>
              {bookmark.metadata.description || bookmark.detailData.content}
            </div>
          )}
          {bookmark.importSource === 'URL' && (
            <div className={styles.sourceUrl}>
              <div className={styles.url}>{bookmark.url}</div>
              <a href={bookmark.url} target="_blank">
                <img className={styles.accessIcon} src="/images/access.svg" alt="access icon" />
              </a>
            </div>
          )}
          <div className={styles.infoHeader}>
            <div className={styles.sourceAndDate}>
              {bookmark.importSource === 'TELEGRAM_FILE' && (
                <div>
                  Telegram
                  <span className={styles.dot}>•</span>
                </div>
              )}
              {moment(bookmark.createdAt).format('MMMM DD, YYYY')}
            </div>
            <div className={styles.contentType}>{CONTENT_TYPES[bookmark.contentType].label}</div>
          </div>
          {bookmark.importSource !== 'URL' &&
            (bookmark.contentType === 'AUDIO' ||
              bookmark.contentType === 'DOCUMENT' ||
              bookmark.contentType === 'VIDEO') && (
              <div className={styles.sourceUpload}>
                {getSourceIcon()}
                {getAccessDescription()}
                <a href={bookmark.url} target="_blank">
                  <img className={styles.accessIcon} src="/images/access.svg" alt="access icon" />
                </a>
              </div>
            )}
          {bookmark.contentType === 'IMAGE' && (
            <div className={styles.infoContainer}>
              <img
                src={bookmark.url}
                className={styles.image}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src="/images/falback-img.svg";
                }}
              />
              <Info info={bookmark.detailData.description} editType='EditImageDescription' bookmarkIndex={index}/>
            </div>
          )}
          {bookmark.contentType === 'AUDIO' && !bookmark.detailData.keynotes && (
            <div className={styles.infoContainer}>
              <Info info={bookmark.detailData.transcription} />
            </div>
          )}
          {bookmark.importSource !== 'URL' && bookmark.contentType === 'TEXT' && (
            <div className={styles.infoContainer}>
              <Info info={bookmark.detailData.content} />
            </div>
          )}
          <div className={styles.infoContainer}>
            {(
              bookmark.contentType === 'TEXT' ||
              bookmark.contentType === 'VIDEO' ||
              bookmark.contentType === 'AUDIO'
            ) && (
              bookmark.detailData.keynotes
            ) && (
              <div>
                <div className={styles.keyPoint}>Key points</div>
                <Info info={bookmark.detailData.keynotes} editType='EditKeynotes' bookmarkIndex={index}/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookmarkDetail
