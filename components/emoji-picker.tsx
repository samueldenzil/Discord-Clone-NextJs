'use client'

import { Smile } from 'lucide-react'
import data from '@emoji-mart/data/sets/14/apple.json'
import Picker from '@emoji-mart/react'
import { useTheme } from 'next-themes'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type EmojiPickerProps = {
  onChange: (value: string) => void
}

export default function EmojiPicker({ onChange }: EmojiPickerProps) {
  const { resolvedTheme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="mb-16 border-none bg-transparent shadow-none drop-shadow-none"
      >
        <Picker
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          set="apple"
          theme={resolvedTheme}
        />
      </PopoverContent>
    </Popover>
  )
}
