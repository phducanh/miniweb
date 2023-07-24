import Error from 'components/Error'
import type { NextPage } from 'next'

const Custom404: NextPage = () => {
  return <Error title="Oh this link does not work any more" description="Generate a new link, and come back here!" />
}

export default Custom404
