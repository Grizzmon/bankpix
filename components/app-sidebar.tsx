'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  KeyRound,
  ListOrdered,
  Banknote,
  Menu,
  X,
  LogOut,
  Wallet,
  Phone,
  Plus
} from 'lucide-react'

type View = 'dashboard' | 'create-key' | 'my-keys' | 'withdrawal'

interface AppSidebarProps {
  currentView: View
  onViewChange: (view: View) => void
  userName: string
  userPhone: string
  onLogout: () => void
}

const menuItems = [
  { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'create-key' as View, label: 'Criar Chave', icon: Plus, highlight: true },
  { id: 'my-keys' as View, label: 'Minhas Chaves', icon: KeyRound },
  { id: 'withdrawal' as View, label: 'Levantamento', icon: Banknote },
]

export function AppSidebar({ currentView, onViewChange, userName, userPhone, onLogout }: AppSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const firstName = userName.split(' ')[0]

  const handleNavClick = (view: View) => {
    onViewChange(view)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">PixBank</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <nav
        className={cn(
          'lg:hidden fixed top-16 left-0 right-0 z-40 bg-sidebar border-b border-sidebar-border transform transition-transform duration-300',
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <div className="p-4 space-y-2">
          {/* User info */}
          <div className="px-4 py-3 mb-2 bg-sidebar-accent/50 rounded-xl">
            <p className="font-semibold text-sidebar-foreground">{firstName}</p>
            <div className="flex items-center gap-2 mt-1">
              <Phone className="w-3 h-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{userPhone}</p>
            </div>
          </div>
          
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
                currentView === item.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : item.highlight && currentView !== item.id
                  ? 'bg-primary/10 text-primary hover:bg-primary/20'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-20 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-xl text-sidebar-foreground">PixBank</span>
        </div>

        {/* User Info */}
        <div className="px-4 py-4">
          <div className="px-4 py-4 bg-sidebar-accent/50 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Bem-vindo,</p>
            <p className="font-semibold text-sidebar-foreground">{firstName}</p>
            <div className="flex items-center gap-2 mt-2">
              <Phone className="w-3 h-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{userPhone}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
                currentView === item.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : item.highlight && currentView !== item.id
                  ? 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.highlight && currentView !== item.id && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                  Novo
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}
