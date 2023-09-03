import { FieldErrors, FieldValues, UseFormRegister, UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface AuthInputProps {
  id: 'name' | 'email' | 'password'
  label: string
  type?: 'text' | 'email' | 'password'
  required?: boolean
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
  disabled?: boolean
}

export default function AuthInput({
  id,
  label,
  type,
  required,
  register,
  errors,
  disabled,
}: AuthInputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="uppercase text-gray-300 text-xs font-bold">
        {label} <span className="text-rose-500">*</span>
      </label>
      <Input
        id={id}
        type={type}
        autoComplete={id}
        disabled={disabled}
        {...register(id, { required })}
        className={cn(
          `
          form-input
          block
          w-full
          rounded-md
          border-0
          py-1.5
          text-gray-900
          text-sm
          leading-6
          shadow-sm
          ring-1
          ring-inset
          ring-gray-300
          placeholder:text-gray-400
          focus:ring-2
          focus:ring-inset
          focus:ring-sky-600`,
          errors[id] && 'focus:ring-rose-500',
          disabled && 'opacity-50 cursor-default'
        )}
      />
    </div>
  )
}
