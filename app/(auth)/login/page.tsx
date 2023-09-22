'use client'

import AuthForm from '@/components/auth/auth-form'

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="rounded-md bg-[#313338] p-8 shadow-md">
        <div className="flex cursor-default flex-col space-y-2 text-center">
          <h3 className="text-xl font-medium text-gray-200">Welcome Back</h3>
          <p className="text-sm text-gray-400">We&apos;re so excited to see you again!</p>
        </div>

        <AuthForm />
      </div>
    </div>
  )
}
