import { memo, useCallback, useEffect, useRef } from 'react'
import styles from './UndoBookmark.module.scss'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { useClickOutside } from 'hooks/clickOutSide'
import { cancelUndoBookmark, undoBookmark } from 'redux/slices/app'
import { TIME_TO_CANCEL_UNDO_BOOKMARK } from '../constants'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { UNDO_DELETE_BOOKMARK } from 'domains/Home/actions'

const UndoBookmark = () => {
  const deletedBookmark = useAppSelector((state) => state.app.deletedBookmark)
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const router = useRouter();
  const token = router.query.token;
  const [undoRemoveBookmark, { data, loading, error }] = useMutation(
    UNDO_DELETE_BOOKMARK, {
    context: {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    },
  })
  const list = useAppSelector((state) => state.app.data?.list) || []

  const handleClose = useCallback(
    deletedBookmark
      ? () => {
          dispatch(cancelUndoBookmark())
        }
      : undefined,
    [deletedBookmark, dispatch],
  )

  useClickOutside(ref, handleClose)

  useEffect(() => {
    if (deletedBookmark) {
      const timer = setTimeout(() => {
        dispatch(cancelUndoBookmark())
      }, TIME_TO_CANCEL_UNDO_BOOKMARK)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [deletedBookmark])

  const handleUndo = () => {
    undoRemoveBookmark(
      { variables: { bookmarkContentId: deletedBookmark.bookmark.id } }
    )
    dispatch(undoBookmark())
  }

  return deletedBookmark ? (
    <div className={styles.container} ref={ref}>
      <div className={styles.text}>Item deleted</div>
      <span onClick={handleUndo} className={styles.undoArea}>
        <img src="/images/undo.png" alt="undo icon" className={styles.undoIcon} />
        <span className={styles.undoText}>
          Undo
        </span>
      </span>
    </div>
  ) : null
}

export default memo(UndoBookmark)
