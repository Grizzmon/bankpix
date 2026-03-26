'use client'

import { useState } from 'react'
import { Wallet, ArrowRight, Eye, EyeOff, Phone, User, Lock, CheckCircle } from 'lucide-react'
import { LoadingSpinner } from './loading-spinner'
import { formatPhoneInput, validatePhone, validatePassword } from '@/lib/store'

interface LoginScreenProps {
  onLogin: (name: string, phone: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; phone?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'creating' | 'success'>('form')

  const validateName = (value: string): boolean => {
    const names = value.trim().split(/\s+/)
    return names.length >= 2 && names.every(n => n.length >= 2)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value)
    setPhone(formatted)
    setErrors(prev => ({ ...prev, phone: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { name?: string; phone?: string; password?: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Digite seu nome completo'
    } else if (!validateName(name)) {
      newErrors.name = 'Digite pelo menos nome e sobrenome'
    }

    if (!phone.trim()) {
      newErrors.phone = 'Digite seu numero de telefone'
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Digite um numero valido (DDD + 9 digitos)'
    }

    const passwordValidation = validatePassword(password)
    if (!password.trim()) {
      newErrors.password = 'Digite uma senha'
    } else if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setStep('creating')
    setIsLoading(true)

    // Simulate account creation
    await new Promise(resolve => setTimeout(resolve, 2000))

    setStep('success')
    
    // Show success briefly then login
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    onLogin(name.trim(), phone)
  }

  if (step === 'creating') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-6 animate-slide-up">
          <div className="relative">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <div className="absolute -bottom-2 -right-2">
              <LoadingSpinner size="sm" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Criando sua conta...</h2>
            <p className="text-sm text-muted-foreground">Aguarde um momento</p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-6 animate-slide-up">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 animate-pulse-glow">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Conta criada com sucesso!</h2>
            <p className="text-sm text-muted-foreground">Entrando no seu dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 mb-4">
            <Wallet className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">PixBank</h1>
          <p className="text-muted-foreground mt-2">Sua plataforma financeira digital</p>
        </div>

        {/* Registration Card */}
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-card-foreground mb-6 text-center">
            Criar sua conta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setErrors(prev => ({ ...prev, name: undefined }))
                  }}
                  placeholder="Digite seu nome completo"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-destructive animate-slide-up">{errors.name}</p>
              )}
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                Numero de telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 90000-0000"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  autoComplete="tel"
                />
              </div>
              {errors.phone && (
                <p className="mt-2 text-sm text-destructive animate-slide-up">{errors.phone}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors(prev => ({ ...prev, password: undefined }))
                  }}
                  placeholder="Minimo 6 caracteres"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-destructive animate-slide-up">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Criar conta
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Ao criar sua conta, voce concorda com nossos Termos de Uso e Politica de Privacidade
        </p>
      </div>
    </div>
  )
}
