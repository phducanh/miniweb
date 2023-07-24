import { memo, useCallback, useEffect, useRef } from 'react'
import styles from './Notification.module.scss'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { useClickOutside } from 'hooks/clickOutSide'
import { removeNotification } from 'redux/slices/app'

const Notification = () => {
  const notification = useAppSelector((state) => state.app.notification)
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  const handleClose = useCallback(
    notification
      ? () => {
          dispatch(removeNotification())
        }
      : undefined,
    [notification, dispatch],
  )

  useClickOutside(ref, handleClose)

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(removeNotification())
      }, notification.timeout)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [notification])

  return notification ? (
    <div className={styles.container} ref={ref}>
      <div className={styles.text}>{notification.message}</div>
    </div>
  ) : null
}

export default memo(Notification)
