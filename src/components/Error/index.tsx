import { FC } from 'react'
import styles from './Error.module.scss'

type ErrorProps = {
  image?: string
  title?: string
  description?: string
}

const Error: FC<ErrorProps> = ({ image, title, description }) => {
  return (
    <div className={styles.container}>
      <img className={styles.image} src={image || '/images/error.svg'} alt="error image" />
      <div className={styles.title}>{title || 'Something went wrong'}</div>
      <div className={styles.description}>{description || 'Please recheck'}</div>
    </div>
  )
}

export default Error
