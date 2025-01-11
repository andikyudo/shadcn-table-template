'use client'

import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">
            Enter your email to access your dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
