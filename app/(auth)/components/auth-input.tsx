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
      <label htmlFor={id} className="uppercase text-[#b5bac1] text-xs font-bold">
        {label} <span className="text-rose-500 text-[10px] pl-1">*</span>
      </label>
      <Input
        id={id}
        type={type}
        autoComplete={id}
        disabled={disabled}
        {...register(id, { required })}
        className={cn(
          'bg-[#1e1f22] form-input block w-full rounded-sm border-none border-0 py-1.5 text-gray-200 text-sm leading-6 shadow-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0',
          errors[id] && 'focus:ring-rose-500',
          disabled && 'opacity-50 cursor-default'
        )}
      />
    </div>
  )
}
