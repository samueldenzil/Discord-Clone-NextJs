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
      <label htmlFor={id} className="text-xs font-bold uppercase text-[#b5bac1]">
        {label} <span className="pl-1 text-[10px] text-rose-500">*</span>
      </label>
      <Input
        id={id}
        type={type}
        autoComplete={id}
        disabled={disabled}
        {...register(id, { required })}
        className={cn(
          'form-input block w-full rounded-sm border-0 border-none bg-[#1e1f22] py-1.5 text-sm leading-6 text-gray-200 shadow-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0',
          errors[id] && 'focus:ring-rose-500',
          disabled && 'cursor-default opacity-50'
        )}
      />
    </div>
  )
}
