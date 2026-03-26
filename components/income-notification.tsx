'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, X } from 'lucide-react'
import { formatBRL } from '@/lib/store'

interface IncomeNotificationProps {
  amount: number
  sender: string
  isVisible: boolean
  onClose: () => void
}

export function IncomeNotification({ amount, sender, isVisible, onClose }: IncomeNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      // Play notification sound
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQAHWrTr28NuAAhHoOP06r91AARBmt/8++yJBQM9m+H+/fCQCQU6mN/+/O+ODgc0kt78+uyKEAoyj9f69+iHFQ8viNT48+WCGBQrhM/38eSAGxcngcvy8uN/HRojfsXw8OF9IBwiez/w7+B7IyQhe8Pu7t94JiQhe8Pt7d52KCUge8Ts7N11KiYfe8Pr69x0LCcee8Lq6tp0LigdesHp6dl0MCkceMDo6Nh0Mikbd7/n59d0NCoad77m5tZ0NisbdrzkAAAA')
        audio.volume = 0.3
        audio.play().catch(() => {})
      } catch {
        // Audio not supported
      }
      
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
    }
  }, [isVisible, onClose])

  if (!isVisible && !isAnimating) return null

  return (
    <div 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md transition-all duration-500 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-full'
      }`}
    >
      <div className="bg-emerald-500 rounded-2xl shadow-2xl shadow-emerald-500/30 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-lg">
                Voce recebeu {formatBRL(amount)}
              </p>
              <p className="text-emerald-100 text-sm mt-0.5">
                Transferencia de {sender}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Fechar notificacao"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-white/20">
          <div 
            className="h-full bg-white/40 animate-shrink-width"
            style={{ animationDuration: '5s' }}
          />
        </div>
      </div>
    </div>
  )
}
