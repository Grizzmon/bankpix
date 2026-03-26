// Simple state management for the financial app
export interface PixKey {
  id: string
  name: string
  type: 'cpf' | 'email' | 'celular' | 'aleatorio'
  value: string
  createdAt: Date
}

export interface UserAccount {
  name: string
  phone: string
  password: string
  createdAt: Date
}

export interface UserState {
  isLoggedIn: boolean
  name: string
  phone: string
  balance: number
  keys: PixKey[]
}

export interface Transaction {
  id: string
  type: 'withdrawal'
  amount: number
  amountMZN: number
  method: 'mpesa' | 'emola'
  date: Date
  status: 'completed' | 'pending'
}

// Conversion rate: 1 BRL = 14 MZN
export const BRL_TO_MZN = 14

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatMZN(value: number): string {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN'
  }).format(value)
}

export function convertToMZN(brl: number): number {
  return brl * BRL_TO_MZN
}

// Key generators
export function generateCPF(): string {
  const random = (max: number) => Math.floor(Math.random() * max)
  const n1 = random(10)
  const n2 = random(10)
  const n3 = random(10)
  const n4 = random(10)
  const n5 = random(10)
  const n6 = random(10)
  const n7 = random(10)
  const n8 = random(10)
  const n9 = random(10)
  const d1 = random(10)
  const d2 = random(10)
  
  return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`
}

export function generatePhone(): string {
  const random = (max: number) => Math.floor(Math.random() * max)
  const ddd = 11 + random(79) // DDD between 11-89
  const firstDigit = 9
  const rest = Array.from({ length: 8 }, () => random(10)).join('')
  
  return `(${ddd}) ${firstDigit}${rest.slice(0, 4)}-${rest.slice(4)}`
}

export function generateEmail(name: string): string {
  const cleanName = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z]/g, '')
  
  const domains = ['gmail.com', 'outlook.com', 'yahoo.com.br', 'hotmail.com']
  const domain = domains[Math.floor(Math.random() * domains.length)]
  const random = Math.floor(Math.random() * 1000)
  
  return `${cleanName}${random}@${domain}`
}

export function generateRandomKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const length = 32
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

export function getKeyTypeLabel(type: PixKey['type']): string {
  const labels = {
    cpf: 'CPF',
    email: 'E-mail',
    celular: 'Celular',
    aleatorio: 'Chave Aleatoria'
  }
  return labels[type]
}

export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  
  if (digits.length <= 2) {
    return digits
  } else if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  } else {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 11 && digits[2] === '9'
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 6) {
    return { valid: false, message: 'A senha deve ter pelo menos 6 caracteres' }
  }
  return { valid: true, message: '' }
}
