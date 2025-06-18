"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, TrendingUp, DollarSign } from "lucide-react"

export function HomePage() {
  const stats = [
    {
      title: "Total Productos",
      value: "24",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Proveedores",
      value: "8",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Ventas del Mes",
      value: "$12,450",
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
    },
    {
      title: "Crecimiento",
      value: "+15%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Bienvenida */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">¡Bienvenido al Dashboard!</h1>
        <p className="text-xl text-muted-foreground">
          Gestiona tu inventario de productos y proveedores de manera eficiente
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nuevo producto agregado</p>
                <p className="text-xs text-muted-foreground">MacBook Pro 14" - hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Proveedor actualizado</p>
                <p className="text-xs text-muted-foreground">Apple Inc. - hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Producto eliminado</p>
                <p className="text-xs text-muted-foreground">iPhone 12 - hace 1 día</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accesos Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle>Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <Package className="w-8 h-8 mb-2 text-blue-600" />
              <h3 className="font-medium">Agregar Producto</h3>
              <p className="text-sm text-muted-foreground">Añade un nuevo producto al inventario</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <Users className="w-8 h-8 mb-2 text-green-600" />
              <h3 className="font-medium">Nuevo Proveedor</h3>
              <p className="text-sm text-muted-foreground">Registra un nuevo proveedor</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <TrendingUp className="w-8 h-8 mb-2 text-purple-600" />
              <h3 className="font-medium">Ver Reportes</h3>
              <p className="text-sm text-muted-foreground">Analiza las estadísticas de ventas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
