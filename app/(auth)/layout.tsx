type AuthLayoutProps = {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="max-h-full h-full bg-login-bg bg-no-repeat bg-cover">
      <div className="h-full flex flex-col justify-center">{children}</div>
    </div>
  )
}
