'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { LoginScreen } from '@/components/login-screen'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardView } from '@/components/dashboard-view'
import { CreateKeyView } from '@/components/create-key-view'
import { MyKeysView } from '@/components/my-keys-view'
import { WithdrawalView } from '@/components/withdrawal-view'
import { IncomeNotification } from '@/components/income-notification'
import { type PixKey, type Transaction } from '@/lib/store'

type View = 'dashboard' | 'create-key' | 'my-keys' | 'withdrawal'

const INCOME_TIMER_MS = 480000 // 8 minutes in milliseconds
const INCOME_AMOUNT = 30 // R$ 30.00

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [balance, setBalance] = useState(0) // Starting balance R$ 0.00
  const [income, setIncome] = useState(0) // Track total income
  const [keys, setKeys] = useState<PixKey[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentView, setCurrentView] = useState<View>('dashboard')
  
  // Notification state
  const [showNotification, setShowNotification] = useState(false)
  const incomeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hasReceivedIncomeRef = useRef(false)

  // Set up income timer when user logs in
  useEffect(() => {
    if (isLoggedIn && !hasReceivedIncomeRef.current) {
      incomeTimerRef.current = setTimeout(() => {
        // Add income to balance
        setBalance(prev => prev + INCOME_AMOUNT)
        setIncome(prev => prev + INCOME_AMOUNT)
        setShowNotification(true)
        hasReceivedIncomeRef.current = true
      }, INCOME_TIMER_MS)
    }

    return () => {
      if (incomeTimerRef.current) {
        clearTimeout(incomeTimerRef.current)
      }
    }
  }, [isLoggedIn])

  const handleLogin = useCallback((name: string, phone: string) => {
    setUserName(name)
    setUserPhone(phone)
    setIsLoggedIn(true)
    // Reset income tracking on new login
    hasReceivedIncomeRef.current = false
    setIncome(0)
    setBalance(0)
  }, [])

  const handleLogout = useCallback(() => {
    // Clear income timer
    if (incomeTimerRef.current) {
      clearTimeout(incomeTimerRef.current)
    }
    setIsLoggedIn(false)
    setUserName('')
    setUserPhone('')
    setCurrentView('dashboard')
    setKeys([])
    setTransactions([])
    setBalance(0)
    setIncome(0)
    hasReceivedIncomeRef.current = false
  }, [])

  const handleKeyCreated = useCallback((key: PixKey) => {
    setKeys(prev => [key, ...prev])
  }, [])

  const handleWithdrawal = useCallback((transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev])
    setBalance(prev => prev - transaction.amount)
  }, [])

  const handleNavigate = useCallback((view: View) => {
    setCurrentView(view)
  }, [])

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Income Notification */}
      <IncomeNotification
        amount={INCOME_AMOUNT}
        sender="82****19"
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />

      <AppSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        userName={userName}
        userPhone={userPhone}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              userName={userName}
              balance={balance}
              income={income}
              keys={keys}
              transactions={transactions}
              onNavigate={handleNavigate}
            />
          )}
          {currentView === 'create-key' && (
            <CreateKeyView 
              onKeyCreated={handleKeyCreated} 
              onBack={() => setCurrentView('dashboard')}
            />
          )}
          {currentView === 'my-keys' && (
            <MyKeysView 
              keys={keys} 
              onBack={() => setCurrentView('dashboard')}
              onCreateKey={() => setCurrentView('create-key')}
            />
          )}
          {currentView === 'withdrawal' && (
            <WithdrawalView 
              balance={balance} 
              onWithdrawal={handleWithdrawal}
              onBack={() => setCurrentView('dashboard')}
            />
          )}
        </div>
      </main>
    </div>
  )
}
