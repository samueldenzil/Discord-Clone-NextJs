'use client'
import { useParams } from 'next/navigation'

export default function ChannelIdPage() {
  const params = useParams()
  console.log(params)
  return <div>{params?.channelId}</div>
}
