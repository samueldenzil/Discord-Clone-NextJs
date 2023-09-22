type AuthLayoutProps = {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-full max-h-full bg-login-bg bg-cover bg-no-repeat">
      <div className="flex h-full flex-col justify-center">{children}</div>
    </div>
  )
}
