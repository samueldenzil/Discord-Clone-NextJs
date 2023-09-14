'use client'

import axios from 'axios'
import queryString from 'query-string'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { Plus, Smile } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type ChatInputProps = {
  apiUrl: string
  query: Record<string, any>
  name: string
  type: 'channel' | 'conversation'
}

const formSchema = z.object({
  content: z.string().min(1),
})

export default function ChatInput({ apiUrl, query, name, type }: ChatInputProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = queryString.stringifyUrl({
        url: apiUrl,
        query,
      })

      await axios.post(url, values)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6 bg-rose-600">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="absolute top-7 left-8 h-6 w-6 rounded-full p-1 flex justify-center items-center bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    placeholder={`Message ${type === 'conversation' ? name : `#${name}`}`}
                    {...field}
                    autoComplete="off"
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 text-zinc-600 dark:text-zinc-200 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <div className="absolute top-7 right-8">
                    <Smile />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
