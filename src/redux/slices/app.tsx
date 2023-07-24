import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { DataType, BookmarkInfoType, BookmarkContent, Notification } from 'types/home'

type AppState = {
  deletedBookmark?: BookmarkInfoType
  data?: DataType
  notification?: Notification
}

const initialState: AppState = {}

const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    deleteBookmark: (state, action) => {
      const index = action.payload
      const newList = [...state.data.list]
      const newGroups = [...state.data.groups]
      const newGroupCounts = [...state.data.groupCounts]
      const bookmark = newList.splice(index, 1)[0]
      const { groupIndex } = bookmark
      newGroupCounts[groupIndex]--
      if (newGroupCounts[groupIndex] === 0) {
        newGroupCounts.splice(groupIndex, 1)
        newGroups.splice(groupIndex, 1)
      }
      state.data = { ...state.data, list: newList, groups: newGroups, groupCounts: newGroupCounts }
      state.deletedBookmark = { bookmark, index }
    },
    undoBookmark: (state) => {
      const newList = [...state.data.list]
      const newGroups = [...state.data.groups]
      const newGroupCounts = [...state.data.groupCounts]
      const { bookmark, index } = state.deletedBookmark
      const { groupIndex, group } = bookmark
      newList.splice(index, 0, bookmark)
      if (newGroups[groupIndex] !== group) {
        newGroups.splice(groupIndex, 0, group)
        newGroupCounts.splice(groupIndex, 0, 1)
      } else {
        newGroupCounts[groupIndex]++
      }
      state.data = { ...state.data, list: newList, groups: newGroups, groupCounts: newGroupCounts }
      state.deletedBookmark = undefined
    },
    cancelUndoBookmark: (state) => {
      state.deletedBookmark = undefined
    },
    appendData: (state, action) => {
      const { fetchedList = [], contentType } = action.payload
      const newList = [...(contentType === state.data?.contentType ? state.data.list : []), ...fetchedList]
      const newGroups = [...(contentType === state.data?.contentType ? state.data.groups : [])]
      const newGroupCounts = [...(contentType === state.data?.contentType ? state.data.groupCounts : [])]

      fetchedList.forEach((item: BookmarkContent) => {
        const diffDay = moment().startOf('day').diff(moment(item.createdAt).startOf('day'), 'days')
        if (newGroups.length === 0 || newGroups[newGroups.length - 1] !== diffDay) {
          newGroups.push(diffDay)
          newGroupCounts.push(1)
        } else {
          newGroupCounts[newGroupCounts.length - 1]++
        }
        item.groupIndex = newGroups.length - 1
        item.group = diffDay
      })

      state.data = { contentType, list: newList, groups: newGroups, groupCounts: newGroupCounts }
    },
    resetData: (state) => {
      state.data = undefined
    },
    changeKeynote: (state, action) => {
      const { index, updateInfo } = action.payload
      const newList = state.data.list.map(
        (bookmark, i) => {
          if (i === index) {
            let data = {
              ...bookmark,
              detailData: {
                ...bookmark.detailData,
                keynotes: updateInfo
              }
            }
            return data
          }
          return bookmark
        }
      )
      state.data = { ...state.data, list: newList }
    },
    changeImageDescription: (state, action) => {
      const { index, updateInfo } = action.payload
      const newList = state.data.list.map(
        (bookmark, i) => {
          if (i === index) {
            let data = {
              ...bookmark,
              detailData: {
                ...bookmark.detailData,
                description: updateInfo
              }
            }
            return data
          }
          return bookmark
        }
      )
      state.data = { ...state.data, list: newList }
    },
    addNotification: (state, action) => {
      const { message, timeout } = action.payload
      state.notification = {message, timeout}
    },
    removeNotification: (state) => {
      state.notification = undefined
    }
  },
})

const { actions, reducer: appReducer } = appSlice

export const {
  deleteBookmark, undoBookmark, cancelUndoBookmark, appendData, resetData,
  changeKeynote, changeImageDescription, addNotification, removeNotification
} = actions

export default appReducer
