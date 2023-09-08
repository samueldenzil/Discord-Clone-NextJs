'use client'

import { useParams, useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { ChannelType } from '@prisma/client'
import queryString from 'query-string'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import FileUpload from '@/components/file-upload'
import axios from 'axios'
import { useModalStore } from '@/hooks/use-modal-store'
import { url } from 'inspector'

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Channel name is required.',
    })
    .refine((name) => name !== 'general', { message: 'Channel name cannot be "general"' }),
  type: z.nativeEnum(ChannelType),
})

export default function CreateChannelModal() {
  const { isOpen, onClose, type } = useModalStore()
  const router = useRouter()
  const params = useParams()

  const isModalOpen = isOpen && type === 'createChannel'

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: ChannelType.TEXT,
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: `/api/channels/`,
        query: {
          serverId: params?.serverId,
        },
      })
      await axios.post(url, values)

      form.reset()
      router.refresh()
      onClose()
    } catch (error: any) {
      console.error('Error uploading Server form: ' + error)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl font-bold">Create Channel</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter channel name"
                        disabled={isLoading}
                        autoComplete="off"
                        className="bg-zinc-300/50 border-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Channel type
                    </FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 text-black capitalize outline-none border-0 ring-offset-0 focus:ring-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select a channel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((channelType) => (
                          <SelectItem key={channelType} value={channelType} className="capitalize">
                            {channelType.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button type="submit" variant="primary">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
