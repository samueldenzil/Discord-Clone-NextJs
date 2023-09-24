import { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import { v4 as uuidv4 } from 'uuid'
import { FileIcon, UploadCloud, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import supabase from '@/lib/supabase'

type FileUploadProps = {
  name: string
  value: string
  endpoint: 'message-file' | 'server-image'
  onChange: (url?: string) => void
}

export default function FileUpload({ name, value, endpoint, onChange }: FileUploadProps) {
  const fileType = value?.split('.').pop()
  const [supabasePath, setSupabasePath] = useState<string>('')

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      return
    }

    const file = e.target.files[0]

    const path = `${endpoint}/${uuidv4()}-${file.name}`

    const { data, error } = await supabase.storage.from('images').upload(path, file)

    if (error) {
      console.error('Error uploading image:', error)
    } else {
      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(path)
      setSupabasePath(data.path)
      onChange(publicUrlData.publicUrl)
    }
  }

  const handleDelete = async () => {
    const { data, error } = await supabase.storage.from('images').remove([supabasePath])

    if (error) {
      console.error('Error deleting image:', error)
    } else {
      onChange('')
      setSupabasePath('')
    }
  }

  if (value && fileType !== 'pdf') {
    return (
      <div className="relative h-20 w-20">
        <Image src={value} fill alt={name} className="rounded-full object-cover" />
        <button
          onClick={handleDelete}
          className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  if (value && fileType === 'pdf') {
    return (
      <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
        >
          {value.split('/').pop()}
        </a>
        <button
          onClick={handleDelete}
          className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex w-full items-center justify-center">
      <label
        htmlFor={name}
        className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center justify-center px-10 pb-6 pt-5">
          <UploadCloud className="mb-4 h-8 w-8 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        </div>
        <Input
          id={name}
          type="file"
          accept="image/*, application/pdf"
          onChange={(e) => handleUpload(e)}
          className="hidden"
        />
      </label>
    </div>
  )
}
