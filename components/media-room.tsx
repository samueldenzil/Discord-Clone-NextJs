'use client'

import '@livekit/components-styles'
import { useEffect, useState } from 'react'
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
} from '@livekit/components-react'
import { Channel } from '@prisma/client'
import { Loader2 } from 'lucide-react'

type MediaRoomProps = {
  chatId: string
  video: boolean
  audio: boolean
  username: string
}

export default function MediaRoom({ chatId, video, audio, username }: MediaRoomProps) {
  const [token, setToken] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${chatId}&username=${username}`)
        const data = await resp.json()
        setToken(data.token)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [chatId, username])

  if (token === '') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}
