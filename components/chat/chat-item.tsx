'use client'

import { useEffect, useState } from 'react'
import { Member, MemberRole, User } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import queryString from 'query-string'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react'

import { useModalStore } from '@/hooks/use-modal-store'
import UserAvatar from '@/components/user-avatar'
import ActionTooltip from '../action-tooltip'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type ChatItemProps = {
  id: string
  content: string
  memeber: Member & { user: User }
  timestamp: string
  fileUrl: string | null
  deleted: boolean
  currentMember: Member
  isUpdated: boolean
  socketUrl: string
  socketQuery: Record<string, string>
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
}

const formSchema = z.object({
  content: z.string().min(1),
})

export default function ChatItem({
  id,
  content,
  currentMember,
  deleted,
  fileUrl,
  isUpdated,
  memeber,
  socketQuery,
  socketUrl,
  timestamp,
}: ChatItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const params = useParams()
  const router = useRouter()

  const onMemberClick = () => {
    if (memeber.id === currentMember.id) {
      return
    }

    router.push(`/servers/${params?.serverId}/conversations/${memeber.id}`)
  }

  const { onOpen } = useModalStore()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        e.preventDefault()
        setIsEditing(false)
      }
    }

    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = queryString.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      })

      await axios.patch(url, values)
      form.reset()
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    form.reset({ content: content })
  }, [content, form])

  const fileType = fileUrl?.split('.').pop()

  const isAdmin = memeber.role === MemberRole.ADMIN
  const isModerator = memeber.role === MemberRole.MODERATOR
  const isOwner = memeber.id === currentMember.id
  const canDeleteMessage = !deleted && (isOwner || isAdmin || isModerator)
  const canEditMessage = !deleted && isOwner && !fileUrl
  const isPDF = fileType === 'pdf' && fileUrl
  const isImage = !isPDF && fileType

  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <div onClick={onMemberClick} className="cursor-pointer transition hover:drop-shadow-md">
          <UserAvatar src={memeber.user.image!} />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClick}
                className="cursor-pointer text-sm font-semibold hover:underline"
              >
                {memeber.user.name}
              </p>
              <ActionTooltip label={memeber.role}>{roleIconMap[memeber.role]}</ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{timestamp}</span>
          </div>
          {isImage && (
            <a
              href={fileUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2"
              // className="relative aspect-square rounded-md mt-2 overflow-hidden border flex justify-center items-center bg-secondary"
            >
              <Image src={fileUrl!} alt={content} height={348} width={348} className="rounded-md" />
            </a>
          )}
          {isPDF && (
            <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
              >
                {fileUrl.split('/').pop()}
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted && 'mt-1 text-xs italic text-zinc-500 dark:text-zinc-400'
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="mx-2 text-[10px] text-zinc-500 dark:text-zinc-400">(edited)</span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full items-center gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            placeholder="Edited message"
                            type="text"
                            {...field}
                            autoComplete="off"
                            disabled={isLoading}
                            className="border-0 border-none bg-zinc-200/90 p-2 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" size="sm" variant="primary" disabled={isLoading}>
                  Save
                </Button>
              </form>
              <span className="mt-1 text-[10px] text-zinc-400">
                Press Esc to cancel, Enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 transition group-hover:flex dark:bg-zinc-800">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen('deleteMessage', { apiUrl: `${socketUrl}/${id}`, query: socketQuery })
              }
              className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}
