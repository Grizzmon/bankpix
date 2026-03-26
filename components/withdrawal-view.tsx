'use client'

import { useState, useRef, useEffect } from 'react'
import { Banknote, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { formatBRL, formatMZN, convertToMZN, type Transaction } from '@/lib/store'

type PaymentMethod = 'mpesa' | 'emola'

interface WithdrawalViewProps {
  balance: number
  onWithdrawal: (transaction: Transaction) => void
  onBack: () => void
}

const paymentMethods = [
  {
    id: 'mpesa' as PaymentMethod,
    name: 'M-Pesa',
    logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%286%29-6gOOChq8URfsdg4HNL4VkUQxa8tzrK.jpeg',
  },
  {
    id: 'emola' as PaymentMethod,
    name: 'e-Mola',
    logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-YkipF5edetC51xgMnWOT8CHXToMSXH.png',
  },
]

export function WithdrawalView({ balance, onWithdrawal, onBack }: WithdrawalViewProps) {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<PaymentMethod | ''>('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState<{ amount: number; method: string } | null>(null)
  const [error, setError] = useState('')
  
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  const numericAmount = parseFloat(amount.replace(',', '.')) || 0
  const convertedAmount = convertToMZN(numericAmount)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9,.]/, '')
    setAmount(value)
    setError('')
  }

  const handlePhoneChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9)
    setPhoneNumber(value)
    setError('')
    
    // When phone reaches 9 digits, start verification
    if (value.length === 9 && !phoneVerified) {
      setIsVerifyingPhone(true)
      
      // Wait 3.5 seconds for verification
      await new Promise(resolve => setTimeout(resolve, 3500))
      
      setIsVerifyingPhone(false)
      setPhoneVerified(true)
      
      // Smooth scroll to submit button after verification
      setTimeout(() => {
        submitButtonRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }, 100)
    }
  }

  // Reset phone verification when method changes
  useEffect(() => {
    setPhoneNumber('')
    setPhoneVerified(false)
  }, [method])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!amount || numericAmount <= 0) {
      setError('Digite um valor valido')
      return
    }

    if (numericAmount > balance) {
      setError('Saldo insuficiente')
      return
    }

    if (!method) {
      setError('Selecione um metodo de levantamento')
      return
    }

    setIsProcessing(true)
    setProgress(0)

    // Animate progress bar over 5 seconds
    const duration = 5000
    const startTime = Date.now()
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(newProgress)
      
      if (elapsed < duration) {
        requestAnimationFrame(updateProgress)
      }
    }
    
    requestAnimationFrame(updateProgress)
    
    await new Promise(resolve => setTimeout(resolve, duration))

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: 'withdrawal',
      amount: numericAmount,
      amountMZN: convertedAmount,
      method: method,
      date: new Date(),
      status: 'completed'
    }

    onWithdrawal(transaction)

    const selectedMethod = paymentMethods.find(m => m.id === method)
    setSuccess({
      amount: convertedAmount,
      method: selectedMethod?.name || ''
    })
    setIsProcessing(false)
  }

  const handleDismissSuccess = () => {
    setSuccess(null)
    setAmount('')
    setMethod('')
    setPhoneNumber('')
    setPhoneVerified(false)
    onBack()
  }

  return (
    <>
      {/* Phone Verification Overlay */}
      {isVerifyingPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col items-center gap-5 p-8 rounded-2xl bg-card border border-border shadow-2xl animate-slide-up w-full max-w-xs mx-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-1">Verificando numero...</h3>
              <p className="text-sm text-muted-foreground">Aguarde um momento</p>
            </div>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in">
          <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-card border border-border shadow-2xl animate-slide-up w-full max-w-sm mx-4">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className="text-primary transition-all duration-100"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">{Math.round(progress)}%</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Processando...</h3>
              <p className="text-muted-foreground text-sm">Aguarde enquanto processamos seu levantamento</p>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in p-4">
          <div className="w-full max-w-md bg-card rounded-2xl border border-border p-8 shadow-2xl animate-slide-up">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6 animate-pulse-glow">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Levantamento Concluido!
              </h3>
              <p className="text-muted-foreground mb-6">
                Seu levantamento foi realizado com sucesso
              </p>
              <div className="w-full p-5 rounded-xl bg-muted/50 border border-border mb-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Valor enviado:</span>
                  <span className="font-bold text-primary text-lg">{formatMZN(success.amount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Metodo:</span>
                  <span className="font-medium text-foreground">{success.method}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Concluido
                  </span>
                </div>
              </div>
              <button
                onClick={handleDismissSuccess}
                className="w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Voltar ao Dashboard
              </button>
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Levantamento</h1>
            <p className="text-muted-foreground mt-1">
              Transfira seu saldo para M-Pesa ou e-Mola
            </p>
          </div>
        </div>

        {/* Balance Info */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Saldo disponivel:</span>
            <span className="font-bold text-foreground text-lg">{formatBRL(balance)}</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
                Valor em Reais (BRL)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  R$
                </span>
                <input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0,00"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-input border border-border text-foreground text-xl font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Conversion Preview */}
              {numericAmount > 0 && (
                <div className="mt-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Voce recebera:</span>
                    <span className="font-bold text-primary text-lg">{formatMZN(convertedAmount)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Metodo de levantamento
              </label>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => {
                      setMethod(pm.id)
                      setError('')
                    }}
                    className={`relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-200 ${
                      method === pm.id
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                        : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
                        <img
                          src={pm.logo}
                          alt={pm.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className={`font-semibold ${method === pm.id ? 'text-primary' : 'text-foreground'}`}>
                        {pm.name}
                      </span>
                    </div>
                    {method === pm.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number Input - appears when method is selected */}
            {method && (
              <div className="animate-fade-in">
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Numero de telefone ({method === 'mpesa' ? 'M-Pesa' : 'e-Mola'})
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    +258
                  </span>
                  <input
                    id="phone"
                    type="text"
                    inputMode="numeric"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Digite seu numero"
                    disabled={phoneVerified}
                    className={`w-full pl-16 pr-4 py-4 rounded-xl bg-input border text-foreground text-lg font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      phoneVerified 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    } disabled:opacity-70`}
                  />
                  {phoneVerified && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {phoneVerified 
                    ? 'Numero verificado com sucesso' 
                    : `Digite os 9 digitos do seu numero (${phoneNumber.length}/9)`
                  }
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <button
              ref={submitButtonRef}
              type="submit"
              disabled={isProcessing || !amount || !method || !phoneVerified}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Banknote className="w-5 h-5" />
              Levantar
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="bg-muted/30 rounded-xl border border-border p-5">
          <h4 className="font-semibold text-foreground mb-3">Informacoes</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">*</span>
              <span>Taxa de conversao: 1 BRL = 14 MZN</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">*</span>
              <span>O valor sera creditado automaticamente na sua conta</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">*</span>
              <span>Processamento leva aproximadamente 5 segundos</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
