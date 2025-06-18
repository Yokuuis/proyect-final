"use client"

import { Button } from "@/components/ui/button"
import { Home, Package, Users, LogOut, X } from "lucide-react"
import type { PageType } from "@/app/page"

interface SidebarProps {
  currentPage: PageType
  setCurrentPage: (page: PageType) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function Sidebar({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen }: SidebarProps) {
  const handleLogout = () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      // Aquí puedes agregar la lógica de logout
      alert("Sesión cerrada exitosamente")
    }
  }

  const menuItems = [
    { id: "home" as PageType, label: "Inicio", icon: Home },
    { id: "products" as PageType, label: "Productos", icon: Package },
    { id: "suppliers" as PageType, label: "Proveedores", icon: Users },
  ]

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setCurrentPage(item.id)
                  setSidebarOpen(false)
                }}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </div>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
