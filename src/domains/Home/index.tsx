import styles from './Home.module.scss'
import React, { useState } from 'react'
import { BookmarkInfoType } from 'types/home'
import UndoBookmark from './UndoBookmark'
import BookmarkList from './BookmarkList'
import BookmarkDetail from './BookmarkDetail'
import Notification from './Notification'
import "react-loading-skeleton/dist/skeleton.css";

const Home = () => {
  const [currentBookmark, setCurrentBookmark] = useState<BookmarkInfoType>()

  const handleViewDetail = (bookmark: BookmarkInfoType) => {
    setCurrentBookmark(bookmark)
  }

  const handleBackToList = () => {
    setCurrentBookmark(undefined)
  }

  return (
    <div className={styles.container}>
      <BookmarkList isActive={!currentBookmark} onViewDetail={handleViewDetail} />
      {!!currentBookmark && <BookmarkDetail info={currentBookmark} onBack={handleBackToList} />}
      <UndoBookmark />
      <Notification />
    </div>
  )
}

export default Home
