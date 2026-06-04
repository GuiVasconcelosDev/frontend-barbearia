import { useState, useEffect } from 'react'
import { AuthLayout } from '@components/layouts/AuthLayout'
import { LoginForm } from '@components/auth/LoginForm'
import { SignupForm } from '@components/auth/SignupForm'
import { useAuthStore } from '@store/authStore'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

export function LoginPage() {
  const [isSignupMode, setIsSignupMode] = useState(false)
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/painel')
    }
  }, [isAuthenticated, navigate])

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {isSignupMode ? (
          <SignupForm
            key="signup"
            onSwitchToLogin={() => setIsSignupMode(false)}
          />
        ) : (
          <LoginForm
            key="login"
            onSwitchToSignup={() => setIsSignupMode(true)}
          />
        )}
      </AnimatePresence>
    </AuthLayout>
  )
}
