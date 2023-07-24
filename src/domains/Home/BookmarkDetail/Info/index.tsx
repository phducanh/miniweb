import { FC, useState, useRef, useEffect } from 'react'
import styles from './Info.module.scss'
import useAutosizeTextArea from './useAutosizeTextArea'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { changeKeynote, changeImageDescription, addNotification } from 'redux/slices/app'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { UPDATE_KEYNOTE, UPDATE_IMAGE_DESCRIPTION } from 'domains/Home/actions'

type InfoProps = {
  info: string
  editType?: string
  bookmarkIndex?: number
}

enum InfoMode {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
}

const Info: FC<InfoProps> = ({ info, editType, bookmarkIndex }) => {
  const [mode, setMode] = useState<InfoMode>(InfoMode.VIEW);
  const [infoDisplay, setInfoDislay] = useState<string>(info);
  const [updateInfo, setUpdateInfo] = useState<string>();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch()
  useAutosizeTextArea(textAreaRef.current, updateInfo);

  const router = useRouter();
  const token = router.query.token;
  const list = useAppSelector((state) => state.app.data?.list) || []
  const [updateKeynote, {}] = useMutation(
    UPDATE_KEYNOTE, {
      context: {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      },
    }
  )
  const [updateImageDescription, {}] = useMutation(
    UPDATE_IMAGE_DESCRIPTION, {
      context: {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      },
    }
  )


  const changeEditMode = () => {
    if (mode == InfoMode.VIEW) {
      setMode(InfoMode.EDIT)
      setUpdateInfo(infoDisplay)
      // setTimeout(() => {
      //   textAreaRef.current.focus();
      //   textAreaRef.current.setSelectionRange(9999, 9999);
      // }, 200);
      const fakeInput = document.createElement('input')
      fakeInput.setAttribute('type', 'text')
      fakeInput.style.position = 'absolute'
      fakeInput.style.opacity = '0'
      fakeInput.style.height = '0'
      fakeInput.style.fontSize = '16px' // disable auto zoom

      // you may need to append to another element depending on the browser's auto
      // zoom/scroll behavior
      document.body.prepend(fakeInput)

      // focus so that subsequent async focus will work
      fakeInput.focus()

      setTimeout(() => {

        // now we can focus on the target input
        textAreaRef.current.focus()

        // cleanup
        fakeInput.remove()

      }, 200)
    }
  }

  useEffect(() => {
    textAreaRef.current.onfocus = () => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    };
  });

  const saveContent = () => {
    setMode(InfoMode.VIEW)
    if (updateInfo === infoDisplay) {
      return
    }
    if (editType === 'EditKeynotes') {
      updateKeynote({ variables: { bookmarkContentId: list[bookmarkIndex].id, keynotes: updateInfo } })
      dispatch(changeKeynote({index: bookmarkIndex, updateInfo}))
    } else if (editType == 'EditImageDescription') {
      updateImageDescription({ variables: { bookmarkContentId: list[bookmarkIndex].id, description: updateInfo } })
      dispatch(changeImageDescription({index: bookmarkIndex, updateInfo}))
    }
    dispatch(addNotification({message: 'Edit saved', timeout: 2000}))
    setInfoDislay(updateInfo)
  }

  return (
    <div className={styles.container}>
      <div className={styles.infoDetail}>
        {mode === InfoMode.VIEW && (
          <div>{infoDisplay}</div>
        )}
        <textarea
          value={updateInfo}
          onChange={e => setUpdateInfo(e.target.value)}
          className={`${styles.editInput} ${mode == InfoMode.VIEW && 'hidden'}`}
          ref={textAreaRef}
        />
      </div>
      {editType && (
        <div className={styles.infoButton}>
          {mode === InfoMode.VIEW ? (
            <span className={styles.editIcon} onClick={changeEditMode}>
              Edit
            </span>
          ):(
            <span className={`${styles.editIcon} ${styles.saveIcon}`} onClick={saveContent}>
              Save
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default Info
