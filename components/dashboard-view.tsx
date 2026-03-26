'use client'

import { Eye, EyeOff, TrendingUp, CreditCard, ArrowUpRight, ArrowDownLeft, Plus, KeyRound, Banknote } from 'lucide-react'
import { useState } from 'react'
import { formatBRL, formatMZN, convertToMZN, type PixKey, type Transaction } from '@/lib/store'

interface DashboardViewProps {
  userName: string
  balance: number
  income?: number
  keys: PixKey[]
  transactions: Transaction[]
  onNavigate: (view: 'create-key' | 'my-keys' | 'withdrawal') => void
}

export function DashboardView({ userName, balance, income = 0, keys, transactions, onNavigate }: DashboardViewProps) {
  const [showBalance, setShowBalance] = useState(true)
  const firstName = userName.split(' ')[0]
  const mznBalance = convertToMZN(balance)

  const totalWithdrawals = transactions.reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Ola, {firstName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo ao seu painel financeiro
        </p>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-card border border-primary/20 p-6 md:p-8">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-24 -translate-x-24" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo disponivel</p>
                <p className="text-xs text-muted-foreground/70">Conta principal</p>
              </div>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 rounded-lg bg-card/50 hover:bg-card transition-colors"
              aria-label={showBalance ? 'Ocultar saldo' : 'Mostrar saldo'}
            >
              {showBalance ? (
                <Eye className="w-5 h-5 text-muted-foreground" />
              ) : (
                <EyeOff className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>

          <div className="space-y-4">
            {/* BRL Balance */}
            <div>
              <p className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                {showBalance ? formatBRL(balance) : 'R$ ******'}
              </p>
            </div>

            {/* MZN Conversion */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm">
                Equivale a{' '}
                <span className="font-semibold text-foreground">
                  {showBalance ? formatMZN(mznBalance) : 'MZN ******'}
                </span>
              </span>
            </div>

            {/* Exchange Rate */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Taxa de conversao: 1 BRL = 14 MZN
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('create-key')}
          className="flex items-center gap-3 p-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-foreground/20">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-semibold text-sm">Nova Chave</span>
        </button>

        <button
          onClick={() => onNavigate('withdrawal')}
          className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-200"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <Banknote className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold text-sm text-foreground">Levantar</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <ArrowDownLeft className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Entradas</span>
          </div>
          <p className="text-xl font-bold text-foreground">{showBalance ? formatBRL(income) : '****'}</p>
        </div>

        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10">
              <ArrowUpRight className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-sm text-muted-foreground">Saidas</span>
          </div>
          <p className="text-xl font-bold text-foreground">{showBalance ? formatBRL(totalWithdrawals) : '****'}</p>
        </div>
      </div>

      {/* Keys Summary */}
      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Minhas Chaves Pix</h3>
          {keys.length > 0 && (
            <button
              onClick={() => onNavigate('my-keys')}
              className="text-sm text-primary hover:underline"
            >
              Ver todas
            </button>
          )}
        </div>
        {keys.length === 0 ? (
          <div className="text-center py-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mx-auto mb-3">
              <KeyRound className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Voce ainda nao possui chaves cadastradas
            </p>
            <button
              onClick={() => onNavigate('create-key')}
              className="text-sm text-primary font-medium hover:underline"
            >
              Criar primeira chave
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Voce possui <span className="font-semibold text-foreground">{keys.length}</span>{' '}
              {keys.length === 1 ? 'chave cadastrada' : 'chaves cadastradas'}
            </p>
            <div className="flex flex-wrap gap-2">
              {keys.slice(0, 4).map((key) => (
                <span
                  key={key.id}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary"
                >
                  {key.type.toUpperCase()}
                </span>
              ))}
              {keys.length > 4 && (
                <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground">
                  +{keys.length - 4} mais
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Transacoes Recentes</h3>
          <div className="space-y-3">
            {transactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10">
                    <ArrowUpRight className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Levantamento</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.method === 'mpesa' ? 'M-Pesa' : 'e-Mola'} - {new Date(tx.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-destructive text-sm">-{formatBRL(tx.amount)}</p>
                  <p className="text-xs text-muted-foreground">{formatMZN(tx.amountMZN)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
