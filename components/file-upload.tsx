import { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import { v4 as uuidv4 } from 'uuid'
import { UploadCloud, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import supabase from '@/lib/supabase'

type FileUploadProps = {
  name: string
  value: string
  endpoint: 'message-file' | 'server-image'
  onChange: (url?: string) => void
}

export default function FileUpload({ name, value, endpoint, onChange }: FileUploadProps) {
  const [supabasePath, setSupabasePath] = useState<string | null>(null)

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
      const { data: pasthData } = supabase.storage.from('images').getPublicUrl(path)
      setSupabasePath(data.path)
      onChange(pasthData.publicUrl)
    }
  }

  const handleDelete = async () => {
    const { data, error } = await supabase.storage.from('images').remove([value])

    if (error) {
      console.error('Error deleting image:', error)
    } else {
      onChange('')
      setSupabasePath('')
    }
  }

  if (value) {
    return (
      <div className="relative h-20 w-20">
        <Image src={value} fill alt={name} className="object-cover rounded-full" />
        <button
          onClick={handleDelete}
          className="absolute top-0 right-0 bg-rose-500 text-white p-1 rounded-full shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center w-full">
      <label
        htmlFor={name}
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-10">
          <UploadCloud className="w-8 h-8 mb-4 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        </div>
        <Input
          id={name}
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e)}
          className="hidden"
        />
      </label>
    </div>
  )
}
