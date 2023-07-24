import { FC, memo, useEffect, useState } from 'react'
import moment from 'moment'
import styles from './Item.module.scss'
import { BookmarkInfoType } from 'types/home'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { deleteBookmark } from 'redux/slices/app'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { DELETE_BOOKMARK_CONTENT } from 'domains/Home/actions'
import Skeleton from 'react-loading-skeleton';

type BookmarkProps = {
  info: BookmarkInfoType
  onViewDetail: (bookmark: BookmarkInfoType) => void
}

const Bookmark: FC<BookmarkProps> = ({ info, onViewDetail }) => {
  const { bookmark, index } = info
  const dispatch = useAppDispatch()
  let html = null
  const [imageLoading, setImageLoading] = useState<boolean>(true)
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

  const handleLoadingImage = () => {
    setImageLoading(false)
  }

  if (bookmark.contentType == 'IMAGE') {
    html = <div className={styles.content}>
      <div className={styles.title}>{bookmark.metadata.title}</div>
      <div className={styles.imageTypeContainer}>
        {imageLoading &&
          <div className={styles.imageSkeleton}>
            <Skeleton width="100%" height={118}/>
          </div>
        }
        <img
          src={bookmark.url}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src="/images/falback-img.svg";
          }}
          onLoad={handleLoadingImage}
        />
      </div>
    </div>
  } else if (bookmark.contentType == 'AUDIO') {
    html = <div className={styles.audioTypeContainer}>
      <img src={getDataTypeIcon()} className={styles.dataTypeIcon} alt="data type icon" />
      <span className={styles.title}>{bookmark.metadata.title}</span>
    </div>
  } else if (bookmark.contentType == 'VIDEO' && bookmark.importSource == 'TELEGRAM_FILE') {
    html = <div className={styles.videoTypeContainer}>
      <img src={getDataTypeIcon()} className={styles.dataTypeIcon} alt="data type icon" />
      <span className={styles.title}>{bookmark.metadata.title}</span>
    </div>
  } else if (bookmark.contentType == 'TEXT' && bookmark.importSource == 'TELEGRAM_FILE') {
    html = <div className={styles.noteTypeContainer}>
      <img src={getDataTypeIcon()} className={styles.dataTypeIcon} alt="data type icon" />
      <div className={styles.content}>
      <div className={styles.title}>Note</div>
        <div className={styles.description}>{bookmark.detailData.content || 'Note from Telegram'}</div>
      </div>
    </div>
  } else {
    html = <div className={styles.content}>
      <div className={styles.title}>{bookmark.metadata.title}</div>
      <div className={styles.description}>
        {bookmark.metadata.description || bookmark.detailData.content}
      </div>
    </div>
  }

  // useEffect(() => {
  //   if (data) {
  //     dispatch(deleteBookmark(index))
  //   }
  // }, [data])

  const handleDelete = () => {
    if (loading) {
      return
    }
    removeBookmark({ variables: { bookmarkContentId: list[index].id } })
    dispatch(deleteBookmark(index))
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.bookmark}
      >
        <div className={styles.header}>
          <span
            className={styles.itemSource}
            onClick={() => {
              onViewDetail(info)
            }}
          >
            {!!bookmark.source && <span>{bookmark.source}</span>}
          </span>
          <span className={styles.deleteIcon} onClick={handleDelete}>
            {/*{loading && (
              <img src="/images/loading.svg" alt="loading icon" className={styles.deleteLoadingIcon}/>
            )}*/}
            Delete
          </span>
        </div>
        <div
          className={styles.body}
          onClick={() => {
            onViewDetail(info)
          }}
        >
          {html}
        </div>
      </div>
    </div>
  )
}

export default memo(Bookmark)
