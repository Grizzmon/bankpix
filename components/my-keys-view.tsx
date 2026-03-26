'use client'

import { Copy, Check, KeyRound, Hash, Mail, Phone, Shuffle, ArrowLeft, Plus } from 'lucide-react'
import { useState } from 'react'
import { type PixKey, getKeyTypeLabel } from '@/lib/store'

interface MyKeysViewProps {
  keys: PixKey[]
  onBack: () => void
  onCreateKey: () => void
}

const keyIcons: Record<PixKey['type'], React.ComponentType<{ className?: string }>> = {
  cpf: Hash,
  email: Mail,
  celular: Phone,
  aleatorio: Shuffle,
}

const keyColors: Record<PixKey['type'], string> = {
  cpf: 'bg-blue-500/10 text-blue-500',
  email: 'bg-purple-500/10 text-purple-500',
  celular: 'bg-green-500/10 text-green-500',
  aleatorio: 'bg-orange-500/10 text-orange-500',
}

export function MyKeysView({ keys, onBack, onCreateKey }: MyKeysViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (key: PixKey) => {
    try {
      await navigator.clipboard.writeText(key.value)
      setCopiedId(key.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Minhas Chaves</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas chaves Pix cadastradas
            </p>
          </div>
        </div>
        {keys.length > 0 && (
          <button
            onClick={onCreateKey}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Chave
          </button>
        )}
      </div>

      {keys.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 md:p-12 text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted mx-auto mb-6">
            <KeyRound className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Nenhuma chave cadastrada
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            Voce ainda nao possui chaves Pix. Crie sua primeira chave para comecar a receber transferencias.
          </p>
          <button
            onClick={onCreateKey}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            <Plus className="w-5 h-5" />
            Criar primeira chave
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Total de chaves: <span className="font-bold text-foreground">{keys.length}</span>
              </p>
              <button
                onClick={onCreateKey}
                className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nova
              </button>
            </div>
          </div>

          {/* Keys List */}
          <div className="space-y-3">
            {keys.map((key) => {
              const IconComponent = keyIcons[key.type]
              const colorClass = keyColors[key.type]
              const isCopied = copiedId === key.id

              return (
                <div
                  key={key.id}
                  className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl shrink-0 ${colorClass}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
                              {getKeyTypeLabel(key.type)}
                            </span>
                          </div>
                          <p className="font-semibold text-foreground mb-1">{key.name}</p>
                          <p className="font-mono text-sm text-muted-foreground break-all">
                            {key.value}
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-2">
                            Criada em {formatDate(key.createdAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy(key)}
                          className={`p-3 rounded-xl transition-all shrink-0 ${
                            isCopied
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary'
                          }`}
                          aria-label={isCopied ? 'Copiado' : 'Copiar chave'}
                        >
                          {isCopied ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
