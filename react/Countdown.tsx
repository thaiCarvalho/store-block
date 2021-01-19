import React, { useState } from 'react'
import { TimeSplit } from './typings/global'
import  { tick, getTwoDaysFromNow }  from  './utils/time'
import { useCssHandles } from "vtex.css-handles"
import { useQuery } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'
import productReleaseDate from './queries/productReleaseDate.graphql'

interface CountdownProps {  
  targetDate: string
}

const CSS_HANDLES = ["countdown"]
const DEFAULT_TARGET_DATE = getTwoDaysFromNow()

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({  }) => {
  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00',
  })


  const handles = useCssHandles(CSS_HANDLES)
  const { product } = useProduct () 

  const {data, loading, error} = useQuery (productReleaseDate, { 
    variables: { 
      slug: product?.linkText 
    },
    ssr: false 
  })

  if (!product) {
    return null
  }

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <span>Error!</span>
      </div>
    )
  }

  tick(data?.product?.release || DEFAULT_TARGET_DATE, setTime)

  return (
    <div className={`${handles.countdown} db tc`}>
      {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate: {
      title: 'Final date',
      description: 'Final date use in the countdown',
      type: 'string',
      default: null
    }
  },
}

export default Countdown
