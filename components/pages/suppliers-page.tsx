"use client"

import type React from "react"

import { useState } from "react"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  AlertTriangle,
  Users,
  Loader2,
  RefreshCw,
  Building,
  Phone,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

interface Supplier {
  id: number
  nombre: string
  contacto: string
  telefono: string
  email: string
  direccion: string
  created_at?: string
  updated_at?: string
}

export function SuppliersPage() {
  // Estados principales
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 1,
      nombre: "Apple Inc.",
      contacto: "Juan Pérez",
      telefono: "+1-800-275-2273",
      email: "contacto@apple.com",
      direccion: "One Apple Park Way, Cupertino, CA 95014, USA",
    },
    {
      id: 2,
      nombre: "Samsung Electronics",
      contacto: "María García",
      telefono: "+82-2-2255-0114",
      email: "info@samsung.com",
      direccion: "129 Samsung-ro, Yeongtong-gu, Suwon-si, Gyeonggi-do, South Korea",
    },
    {
      id: 3,
      nombre: "Dell Technologies",
      contacto: "Carlos López",
      telefono: "+1-800-915-3355",
      email: "support@dell.com",
      direccion: "One Dell Way, Round Rock, TX 78682, USA",
    },
    {
      id: 4,
      nombre: "Sony Corporation",
      contacto: "Ana Martínez",
      telefono: "+81-3-6748-2111",
      email: "contact@sony.com",
      direccion: "1-7-1 Konan, Minato-ku, Tokyo 108-0075, Japan",
    },
  ])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    contacto: "",
    telefono: "",
    email: "",
    direccion: "",
  })

  // Estados de modales y operaciones
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados de alertas
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info"
    message: string
  } | null>(null)

  // Función para mostrar alertas temporales
  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  // Manejar cambios en inputs del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      nombre: "",
      contacto: "",
      telefono: "",
      email: "",
      direccion: "",
    })
  }

  // Crear proveedor
  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nombre || !formData.contacto || !formData.email) {
      showAlert("error", "Por favor completa todos los campos obligatorios")
      return
    }

    setIsSubmitting(true)
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newSupplier: Supplier = {
        id: Date.now(),
        nombre: formData.nombre,
        contacto: formData.contacto,
        telefono: formData.telefono,
        email: formData.email,
        direccion: formData.direccion,
        created_at: new Date().toISOString(),
      }

      setSuppliers((prev) => [...prev, newSupplier])
      showAlert("success", "Proveedor creado exitosamente")
      setIsCreateModalOpen(false)
      resetForm()
    } catch (error) {
      showAlert("error", "Error al crear proveedor")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Preparar edición de proveedor
  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      nombre: supplier.nombre,
      contacto: supplier.contacto,
      telefono: supplier.telefono,
      email: supplier.email,
      direccion: supplier.direccion,
    })
    setIsEditModalOpen(true)
  }

  // Actualizar proveedor
  const handleUpdateSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSupplier || !formData.nombre || !formData.contacto || !formData.email) {
      showAlert("error", "Por favor completa todos los campos obligatorios")
      return
    }

    setIsSubmitting(true)
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedSupplier: Supplier = {
        ...editingSupplier,
        nombre: formData.nombre,
        contacto: formData.contacto,
        telefono: formData.telefono,
        email: formData.email,
        direccion: formData.direccion,
        updated_at: new Date().toISOString(),
      }

      setSuppliers((prev) => prev.map((s) => (s.id === editingSupplier.id ? updatedSupplier : s)))
      showAlert("success", "Proveedor actualizado exitosamente")
      setIsEditModalOpen(false)
      resetForm()
      setEditingSupplier(null)
    } catch (error) {
      showAlert("error", "Error al actualizar proveedor")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Eliminar proveedor
  const handleDeleteSupplier = async (supplierId: number) => {
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSuppliers((prev) => prev.filter((s) => s.id !== supplierId))
      showAlert("success", "Proveedor eliminado exitosamente")
    } catch (error) {
      showAlert("error", "Error al eliminar proveedor")
    }
  }

  // Filtrar proveedores por búsqueda
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Componente del formulario
  const SupplierForm = ({
    onSubmit,
    submitText,
    isSubmitting,
  }: {
    onSubmit: (e: React.FormEvent) => void
    submitText: string
    isSubmitting: boolean
  }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-sm font-medium">
            Nombre de la Empresa *
          </Label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Ej: Apple Inc."
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contacto" className="text-sm font-medium">
            Persona de Contacto *
          </Label>
          <Input
            id="contacto"
            name="contacto"
            value={formData.contacto}
            onChange={handleInputChange}
            placeholder="Ej: Juan Pérez"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="telefono" className="text-sm font-medium">
            Teléfono
          </Label>
          <Input
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            placeholder="Ej: +1-800-275-2273"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Ej: contacto@empresa.com"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion" className="text-sm font-medium">
          Dirección
        </Label>
        <Textarea
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleInputChange}
          placeholder="Dirección completa de la empresa..."
          className="min-h-[100px] resize-none"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            resetForm()
            setIsCreateModalOpen(false)
            setIsEditModalOpen(false)
            setEditingSupplier(null)
          }}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              {submitText}
            </>
          )}
        </Button>
      </div>
    </form>
  )

  return (
    <div className="space-y-6">
      {/* Alertas */}
      {alert && (
        <Alert
          className={`${
            alert.type === "success"
              ? "border-green-200 bg-green-50 dark:bg-green-950"
              : alert.type === "error"
                ? "border-red-200 bg-red-50 dark:bg-red-950"
                : "border-blue-200 bg-blue-50 dark:bg-blue-950"
          }`}
        >
          <AlertTriangle
            className={`h-4 w-4 ${
              alert.type === "success" ? "text-green-600" : alert.type === "error" ? "text-red-600" : "text-blue-600"
            }`}
          />
          <AlertDescription
            className={
              alert.type === "success"
                ? "text-green-800 dark:text-green-200"
                : alert.type === "error"
                  ? "text-red-800 dark:text-red-200"
                  : "text-blue-800 dark:text-blue-200"
            }
          >
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar proveedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Proveedor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
              </DialogHeader>
              <SupplierForm onSubmit={handleCreateSupplier} submitText="Crear Proveedor" isSubmitting={isSubmitting} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Lista de proveedores */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron proveedores</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer proveedor"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Proveedor
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold truncate flex items-center">
                      <Building className="w-5 h-5 mr-2 text-blue-600" />
                      {supplier.nombre}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{supplier.contacto}</p>
                  </div>
                  <Badge variant="secondary">ID: {supplier.id}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {supplier.telefono && (
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-muted-foreground">{supplier.telefono}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-muted-foreground truncate">{supplier.email}</span>
                  </div>
                </div>

                {supplier.direccion && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{supplier.direccion}</p>
                )}

                <div className="flex space-x-2 pt-2">
                  <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSupplier(supplier)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Editar Proveedor</DialogTitle>
                      </DialogHeader>
                      <SupplierForm
                        onSubmit={handleUpdateSupplier}
                        submitText="Actualizar Proveedor"
                        isSubmitting={isSubmitting}
                      />
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="flex-1">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center">
                          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                          Confirmar Eliminación
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          ¿Estás seguro de que deseas eliminar el proveedor "{supplier.nombre}"? Esta acción no se puede
                          deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteSupplier(supplier.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer con estadísticas */}
      <div className="text-center text-muted-foreground">
        <p>
          Mostrando {filteredSuppliers.length} de {suppliers.length} proveedores
        </p>
      </div>
    </div>
  )
}
