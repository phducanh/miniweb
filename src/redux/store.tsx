import { configureStore } from '@reduxjs/toolkit'
import appReducer from './slices/app'

const isDev = process.env.ENV_ARG === 'development' || process.env.ENV_ARG === 'test'

const store = configureStore({
  reducer: {
    app: appReducer,
  },
  devTools: isDev,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // remove warning if request param is non-serializable value (Form Data)
      // https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using
      serializableCheck: false,
    }),
})

export default store

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
