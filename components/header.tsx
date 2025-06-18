"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import type { PageType } from "@/app/page"

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
  currentPage: PageType
}

const pageLabels = {
  home: "Inicio",
  products: "Gestión de Productos",
  suppliers: "Gestión de Proveedores",
}

export function Header({ setSidebarOpen, currentPage }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="bg-card shadow-sm border-b">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4">
            <Menu className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold">{pageLabels[currentPage]}</h2>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-9 h-9">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}
