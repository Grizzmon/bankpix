'use client'

import { useState } from 'react'
import { KeyRound, CheckCircle, Hash, Mail, Phone, Shuffle, ArrowLeft, Copy, Check } from 'lucide-react'
import { LoadingOverlay } from './loading-spinner'
import {
  type PixKey,
  generateCPF,
  generateEmail,
  generatePhone,
  generateRandomKey,
  getKeyTypeLabel
} from '@/lib/store'

type KeyType = 'cpf' | 'email' | 'celular' | 'aleatorio'

interface CreateKeyViewProps {
  onKeyCreated: (key: PixKey) => void
  onBack: () => void
}

const keyTypes: { id: KeyType; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
  { id: 'cpf', label: 'CPF', icon: Hash, description: '000.000.000-00' },
  { id: 'email', label: 'E-mail', icon: Mail, description: 'nome@email.com' },
  { id: 'celular', label: 'Celular', icon: Phone, description: '(00) 90000-0000' },
  { id: 'aleatorio', label: 'Aleatoria', icon: Shuffle, description: '32 caracteres' },
]

export function CreateKeyView({ onKeyCreated, onBack }: CreateKeyViewProps) {
  const [name, setName] = useState('')
  const [keyType, setKeyType] = useState<KeyType | ''>('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<{ type: string; value: string } | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (success) {
      try {
        await navigator.clipboard.writeText(success.value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Digite seu nome completo')
      return
    }

    const names = name.trim().split(/\s+/)
    if (names.length < 2) {
      setError('Digite nome e sobrenome')
      return
    }

    if (!keyType) {
      setError('Selecione o tipo de chave')
      return
    }

    setIsLoading(true)

    // Simulate processing (2-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500))

    let keyValue: string
    switch (keyType) {
      case 'cpf':
        keyValue = generateCPF()
        break
      case 'email':
        keyValue = generateEmail(name)
        break
      case 'celular':
        keyValue = generatePhone()
        break
      case 'aleatorio':
        keyValue = generateRandomKey()
        break
      default:
        keyValue = ''
    }

    const newKey: PixKey = {
      id: crypto.randomUUID(),
      name: name.trim(),
      type: keyType,
      value: keyValue,
      createdAt: new Date()
    }

    onKeyCreated(newKey)
    setIsLoading(false)
    setSuccess({ type: getKeyTypeLabel(keyType), value: keyValue })
  }

  const handleDismissSuccess = () => {
    setSuccess(null)
    setName('')
    setKeyType('')
    setCopied(false)
  }

  const handleCreateAnother = () => {
    setSuccess(null)
    setName('')
    setKeyType('')
    setCopied(false)
  }

  return (
    <>
      <LoadingOverlay isVisible={isLoading} text="Gerando sua chave Pix..." />

      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in p-4">
          <div className="w-full max-w-md bg-card rounded-2xl border border-border p-8 shadow-2xl animate-slide-up">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6 animate-pulse-glow">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Chave criada com sucesso!
              </h3>
              <p className="text-muted-foreground mb-6">
                Sua chave {success.type} foi gerada
              </p>
              <div className="w-full p-4 rounded-xl bg-muted/50 border border-border mb-6">
                <p className="text-xs text-muted-foreground mb-2">Sua nova chave:</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-foreground break-all flex-1">{success.value}</p>
                  <button
                    onClick={handleCopy}
                    className={`p-2 rounded-lg transition-all shrink-0 ${
                      copied
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                    }`}
                    aria-label={copied ? 'Copiado' : 'Copiar'}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="w-full space-y-3">
                <button
                  onClick={handleDismissSuccess}
                  className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  Voltar ao Dashboard
                </button>
                <button
                  onClick={handleCreateAnother}
                  className="w-full px-6 py-3 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
                >
                  Criar outra chave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 animate-fade-in">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Criar Chave Pix</h1>
            <p className="text-muted-foreground mt-1">
              Gere uma nova chave para receber transferencias
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="keyName" className="block text-sm font-medium text-foreground mb-2">
                Nome completo
              </label>
              <input
                id="keyName"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                placeholder="Digite seu nome completo"
                className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Key Type Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Tipo de chave
              </label>
              <div className="grid grid-cols-2 gap-3">
                {keyTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setKeyType(type.id)
                      setError('')
                    }}
                    className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      keyType === type.id
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                        : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${keyType === type.id ? 'bg-primary/20' : 'bg-muted'}`}>
                        <type.icon className={`w-5 h-5 ${keyType === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <span className={`font-semibold ${keyType === type.id ? 'text-primary' : 'text-foreground'}`}>
                        {type.label}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{type.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <KeyRound className="w-5 h-5" />
              Gerar Chave
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-muted/30 rounded-xl border border-border p-5">
          <h4 className="font-semibold text-foreground mb-3">Sobre as chaves Pix</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">*</span>
              <span><strong className="text-foreground">CPF:</strong> Formato 000.000.000-00</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">*</span>
              <span><strong className="text-foreground">E-mail:</strong> Gerado a partir do seu nome</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">*</span>
              <span><strong className="text-foreground">Celular:</strong> Formato (DDD) 9XXXX-XXXX</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">*</span>
              <span><strong className="text-foreground">Aleatoria:</strong> String de 32 caracteres</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
