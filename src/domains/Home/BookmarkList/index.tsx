import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { CONTENT_TYPES, LIMIT_ITEM_PER_REQUEST, UPLOAD_SOURCE } from '../constants'
import { appendData, resetData } from 'redux/slices/app'
import styles from './BookmarkList.module.scss'
import { Virtuoso } from 'react-virtuoso'
import Bookmark from './Bookmark'
import { BookmarkContent, BookmarkInfoType, ContentType } from 'types/home'
import Error from 'components/Error'
import { useQuery } from '@apollo/client'
import { GET_BOOKMARK_LIST } from '../actions'
import { getLocationFromUrl } from 'shared/helpers'
import moment from 'moment'

type BookmarkListProps = {
  isActive: boolean
  onViewDetail: (bookmark: BookmarkInfoType) => void
}

type FilterParams = {
  fromId?: string
  contentType: ContentType | 'ALL'
}

const BookmarkList: FC<BookmarkListProps> = ({ isActive, onViewDetail }) => {
  const [filter, setFilter] = useState<FilterParams>({ contentType: CONTENT_TYPES.ALL.value })
  const list = useAppSelector((state) => state.app.data?.list) || []
  const dispatch = useAppDispatch()
  const isAllData = useRef(false)
  const router = useRouter();
  const token = router.query.token;
  const [errorType, setErrorType] = useState('Nothing here yet')
  const [errorDescription, setErrorDescription] = useState('When you save content, all your bookmarks will appear here!')
  const [firstLoad, setFirstLoad] = useState(true)

  const { error, data, loading } = useQuery(GET_BOOKMARK_LIST, {
    variables: {
      fromId: filter.fromId,
      contentType: filter.contentType === 'ALL' ? undefined : filter.contentType
    },
    context: {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    },
    skip: !token,
    fetchPolicy: 'network-only'
  })

  useEffect(() => {
    if (data) {
      setFirstLoad(false)
    }
    if (data && data.bookmarkContents) {
      if (data.bookmarkContents.length < LIMIT_ITEM_PER_REQUEST) {
        isAllData.current = true
      }
      dispatch(
        appendData({
          fetchedList: data.bookmarkContents.map((item: BookmarkContent) => ({
            ...item,
            source:
              item.importSource === 'URL' && !!item.url
                ? getLocationFromUrl(item.url).hostname
                : UPLOAD_SOURCE[item.importSource],
            metadata: {
              ...item.metadata,
              title: item.metadata.title || CONTENT_TYPES[item.contentType].label,
            },
            detailData: {
              ...item.detailData
            }
          })),
          contentType: filter.contentType,
        }),
      )
    }
  }, [data])

  useEffect(() => {
    if (error) {
      setErrorType('Oh this link does not work any more')
      setErrorDescription('Generate a new link, and come back here!')
      setFirstLoad(false)
    }
  }, [error])

  const handleGetGroupName = (item: BookmarkContent) => {
    if (item.group === 0) return 'Today'
    if (item.group === 1) return 'Yesterday'
    return moment(item.createdAt).format('MMM D')
  }

  const handleLoadMore = () => {
    if (loading || isAllData.current || !list?.length) return
    setFilter({ ...filter, fromId: list[list.length - 1].id })
  }

  return (
    <div className={`${styles.container} ${!isActive && 'hidden'}`}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles.titleUserInfo}>
            <img src="/images/default-avatar.svg" alt="user-avatar" className={styles.titleUserAvatar} />
            Hey,&nbsp;<span className={styles.titleUserName}>SaveDay friend!</span>
          </span>
          <img src="/images/saveday-mark.svg" alt="saveday-logo" className={styles.titleSavedayLogo} />
        </div>
        <div className={styles.tabs}>
          {Object.values(CONTENT_TYPES).map((tab) => (
            <span
              className={`${styles.tab} ${filter.contentType === tab.value ? styles.activeTab : ''}`}
              onClick={() => {
                if (tab.value !== filter.contentType) {
                  isAllData.current = false
                  dispatch(resetData())
                  setFilter({ contentType: tab.value })
                }
              }}
              key={tab.value}
            >
              {tab.label}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.body}>
        {list.length > 0 ? (
          <div className={styles.listItem}>
            <Virtuoso
              style={{ height: '100%' }}
              data={list}
              endReached={handleLoadMore}
              overscan={40}
              computeItemKey={(index) => list[index].id}
              itemContent={(index) => {
                return (
                  <>
                    {(index === 0 || list[index - 1].group !== list[index].group) && (
                      <div className={styles.groupBookmarkWrapper}>
                        <div className={styles.groupBookmark}>{handleGetGroupName(list[index])}</div>
                      </div>
                    )}
                    <Bookmark info={{ bookmark: list[index], index }} onViewDetail={onViewDetail} />
                  </>
                )
              }}
              components={{
                Footer: () => (
                  <div className={styles.footer}>
                    {isAllData.current ? 'End of list. Keep adding!' : error ? 'Something went error' : 'Loading'}
                  </div>
                ),
              }}
            />
          </div>
        ) : (
          <>
            {(loading || firstLoad) ? (
              <div className={styles.loadingContainer}>
                <img src="/images/loading.svg" alt="loading icon" className={styles.loadingIcon}/>
              </div>
            ) : (
              <Error title={errorType} description={errorDescription}/>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BookmarkList
