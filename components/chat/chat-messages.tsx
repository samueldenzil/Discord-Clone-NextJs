'use client'

import { Member, Message, User } from '@prisma/client'
import { Divide, Loader2, ServerCrash } from 'lucide-react'

import { useChatQuery } from '@/hooks/use-chat-query'

import ChatWelcome from './chat-welcome'
import { Fragment } from 'react'

type ChatMessagesProps = {
  name: string
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
  type: 'channel' | 'conversation'
}

type MessageWithMemberWithUser = Message & {
  member: Member & {
    user: User
  }
}

export default function ChatMessages({
  apiUrl,
  chatId,
  member,
  name,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}: ChatMessagesProps) {
  const queryKey = `chat:${chatId}`

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useChatQuery({ queryKey, apiUrl, paramKey, paramValue })

  if (status === 'loading') {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 my-4 animate-spin" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading messages...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Something went wrong!</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((messages: MessageWithMemberWithUser) => (
              <div key={messages.id}>{messages.content}</div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
