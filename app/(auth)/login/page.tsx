'use client'

import AuthForm from '@/components/auth/auth-form'

export default function Home() {
  return (
    <div className="mx-auto max-w-lg w-full">
      <div className="p-8 bg-[#313338] rounded-md shadow-md">
        <div className="flex space-y-2 flex-col text-center cursor-default">
          <h3 className="text-gray-200 font-medium text-xl">Welcome Back</h3>
          <p className="text-gray-400 text-sm">We&apos;re so excited to see you again!</p>
        </div>

        <AuthForm />
      </div>
    </div>
  )
}
