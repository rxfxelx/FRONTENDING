"use client"

import type React from "react"

import { useAuth } from "../contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Bot, Package, Settings, MessageSquare, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navigation = [
    { name: "Meus Produtos", href: "/produtos", icon: Package },
    { name: "Configurações da IA", href: "/configuracoes", icon: Settings },
    { name: "Testar IA", href: "/testar", icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-gray-800">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-white">Pac Lead</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gray-800 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Bot className="h-8 w-8 text-blue-500" />
            <span className="ml-2 text-xl font-bold text-white">Pac Lead</span>
          </div>
          <nav className="mt-8 flex-1 flex flex-col divide-y divide-gray-700 overflow-y-auto">
            <div className="px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-gray-800 shadow lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-700 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-blue-500 lg:hidden" />
              <span className="ml-2 text-xl font-bold text-white lg:hidden">Pac Lead</span>
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:flex lg:flex-shrink-0 lg:h-16 lg:bg-gray-800 lg:shadow">
          <div className="flex-1 px-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-white">Olá, {user?.name}!</h1>
            <button onClick={handleLogout} className="flex items-center text-gray-300 hover:text-white">
              <LogOut className="h-5 w-5 mr-2" />
              Sair
            </button>
          </div>
        </div>

        <main className="flex-1 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
