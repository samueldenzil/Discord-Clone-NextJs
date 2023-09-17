'use client'

import queryString from 'query-string'
import { useInfiniteQuery } from '@tanstack/react-query'

import { useSocket } from '@/components/providers/socket-provider'

type ChatQueryProps = {
  apiUrl: string
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
  queryKey: string
}

export const useChatQuery = ({ apiUrl, paramKey, paramValue, queryKey }: ChatQueryProps) => {
  const { isConnected } = useSocket()

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = queryString.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    )

    const res = await fetch(url)
    return res.json()
  }

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    })

  return { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status }
}
