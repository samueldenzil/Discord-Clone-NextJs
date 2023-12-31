import { useEffect, useState, useCallback } from 'react'
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import AuthInput from './auth-input'

type VARIENT = 'LOGIN' | 'REGISTER'

export default function AuthForm() {
  const session = useSession()
  const router = useRouter()
  const [varient, setVarient] = useState<VARIENT>('LOGIN')

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session.status === 'authenticated') {
      router.push('/')
    }
  }, [session.status, router])

  const toggleVarient = useCallback(() => {
    if (varient === 'LOGIN') {
      setVarient('REGISTER')
    } else {
      setVarient('LOGIN')
    }
  }, [varient])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)
    if (varient === 'REGISTER') {
      axios
        .post('/api/register', data)
        .then(() =>
          signIn('credentials', {
            ...data,
            redirect: false,
          })
        )
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials!')
          }

          if (callback?.ok) {
            toast.success('Successful')
            router.push('/')
          }
        })
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => setIsLoading(false))
    }

    if (varient === 'LOGIN') {
      signIn('credentials', { ...data, redirect: false })
        .then((res) => {
          if (res?.error) {
            toast.error('Invalid credentials')
          }
          if (!res?.error && res?.ok) {
            router.push('/')
            toast.success('Successful')
          }
        })
        .finally(() => setIsLoading(false))
    }
  }

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {varient === 'REGISTER' && (
          <AuthInput
            id="name"
            label="Username"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
        )}

        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          register={register}
          errors={errors}
          disabled={isLoading}
        />
        <AuthInput
          id="password"
          label="Password"
          type="password"
          register={register}
          errors={errors}
          disabled={isLoading}
        />
        <Button type="submit" variant="primary" className="w-full">
          {varient === 'LOGIN' ? 'Log In' : 'Continue'}
        </Button>
      </form>

      <div className="mt-3 flex gap-2 text-sm">
        {varient === 'LOGIN' && <div className="text-[#949ba4]">Need an account?</div>}
        <div
          className="cursor-pointer text-[#00a8fc] hover:underline"
          onClick={() => toggleVarient()}
        >
          {varient === 'LOGIN' ? 'Register' : 'Already have an account?'}
        </div>
      </div>
    </div>
  )
}
