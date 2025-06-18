"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Upload,
  X,
  Check,
  AlertTriangle,
  Package,
  Loader2,
  ImageIcon,
  RefreshCw,
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

// Importar el componente al inicio del archivo
import { ConnectionTest } from "@/components/connection-test"

interface Product {
  id: number
  nombre: string
  descripcion: string
  precio: number
  proveedor: string
  imagen?: string
  created_at?: string
  updated_at?: string
}

interface ApiResponse {
  success: boolean
  message: string
  data?: Product[]
  product?: Product
}

export default function ProductsPage() {
  // Agregar al inicio del componente, después de los imports
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/tu-proyecto"

  // Estados principales
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    proveedor: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  // Estados de modales y operaciones
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados de alertas
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info"
    message: string
  } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Función para mostrar alertas temporales
  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts()
  }, [])

  // Función para obtener todos los productos
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost/proyect-final/api/productos.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProducts(data)
      showAlert("success", `${data.length} productos cargados exitosamente`)
    } catch (error) {
      console.error('Error fetching products:', error)
      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          showAlert("error", "No se puede conectar al servidor. Verifica que XAMPP esté ejecutándose.")
        } else {
          showAlert("error", error.message)
        }
      } else {
        showAlert("error", "Error desconocido al cargar productos")
      }
    } finally {
      setLoading(false)
    }
  }

  // Manejar cambios en inputs del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar selección de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      proveedor: "",
    })
    setSelectedImage(null)
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Crear producto
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nombre || !formData.precio || !formData.proveedor) {
      showAlert("error", "Por favor completa todos los campos obligatorios")
      return
    }

    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("nombre", formData.nombre)
      formDataToSend.append("descripcion", formData.descripcion)
      formDataToSend.append("precio", formData.precio)
      formDataToSend.append("proveedor", formData.proveedor)

      if (selectedImage) {
        formDataToSend.append("imagen", selectedImage)
      }

      const response = await fetch(`${API_BASE_URL}/api/productos/create.php`, {
        method: "POST",
        body: formDataToSend,
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        showAlert("success", "Producto creado exitosamente")
        setIsCreateModalOpen(false)
        resetForm()
        fetchProducts()
      } else {
        showAlert("error", data.message || "Error al crear producto")
      }
    } catch (error) {
      showAlert("error", "Error de conexión al servidor")
      console.error("Error creating product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Preparar edición de producto
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio.toString(),
      proveedor: product.proveedor,
    })
    setImagePreview(product.imagen || "")
    setIsEditModalOpen(true)
  }

  // Actualizar producto
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct || !formData.nombre || !formData.precio || !formData.proveedor) {
      showAlert("error", "Por favor completa todos los campos obligatorios")
      return
    }

    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("id", editingProduct.id.toString())
      formDataToSend.append("nombre", formData.nombre)
      formDataToSend.append("descripcion", formData.descripcion)
      formDataToSend.append("precio", formData.precio)
      formDataToSend.append("proveedor", formData.proveedor)

      if (selectedImage) {
        formDataToSend.append("imagen", selectedImage)
      }

      const response = await fetch(`${API_BASE_URL}/api/productos/update.php`, {
        method: "POST",
        body: formDataToSend,
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        showAlert("success", "Producto actualizado exitosamente")
        setIsEditModalOpen(false)
        resetForm()
        setEditingProduct(null)
        fetchProducts()
      } else {
        showAlert("error", data.message || "Error al actualizar producto")
      }
    } catch (error) {
      showAlert("error", "Error de conexión al servidor")
      console.error("Error updating product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Eliminar producto
  const handleDeleteProduct = async (productId: number) => {
    try {
      const formData = new FormData()
      formData.append("id", productId.toString())

      const response = await fetch(`${API_BASE_URL}/api/productos/delete.php`, {
        method: "POST",
        body: formData,
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        showAlert("success", "Producto eliminado exitosamente")
        fetchProducts()
      } else {
        showAlert("error", data.message || "Error al eliminar producto")
      }
    } catch (error) {
      showAlert("error", "Error de conexión al servidor")
      console.error("Error deleting product:", error)
    }
  }

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.proveedor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Componente del formulario
  const ProductForm = ({
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
            Nombre del Producto *
          </Label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Ej: MacBook Pro 14"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="precio" className="text-sm font-medium">
            Precio *
          </Label>
          <Input
            id="precio"
            name="precio"
            type="number"
            step="0.01"
            value={formData.precio}
            onChange={handleInputChange}
            placeholder="0.00"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="proveedor" className="text-sm font-medium">
          Proveedor *
        </Label>
        <Input
          id="proveedor"
          name="proveedor"
          value={formData.proveedor}
          onChange={handleInputChange}
          placeholder="Ej: Apple Inc."
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion" className="text-sm font-medium">
          Descripción
        </Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          placeholder="Describe las características del producto..."
          className="min-h-[100px] resize-none"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Imagen del Producto</Label>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-12 border-2 border-dashed"
              disabled={isSubmitting}
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir Imagen
            </Button>
          </div>
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Vista previa"
                className="w-16 h-16 object-cover rounded-lg border-2"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  setSelectedImage(null)
                  setImagePreview("")
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                disabled={isSubmitting}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            resetForm()
            setIsCreateModalOpen(false)
            setIsEditModalOpen(false)
            setEditingProduct(null)
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Productos</h1>
          <p className="text-gray-600">Administra tu inventario de productos de manera eficiente</p>
        </div>

        {/* Test de Conexión (solo en desarrollo) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 flex justify-center">
            <ConnectionTest />
          </div>
        )}

        {/* Alertas */}
        {alert && (
          <Alert
            className={`mb-6 ${alert.type === "success"
                ? "border-green-200 bg-green-50"
                : alert.type === "error"
                  ? "border-red-200 bg-red-50"
                  : "border-blue-200 bg-blue-50"
              }`}
          >
            <AlertTriangle
              className={`h-4 w-4 ${alert.type === "success" ? "text-green-600" : alert.type === "error" ? "text-red-600" : "text-blue-600"
                }`}
            />
            <AlertDescription
              className={
                alert.type === "success" ? "text-green-800" : alert.type === "error" ? "text-red-800" : "text-blue-800"
              }
            >
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Controles superiores */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar productos o proveedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchProducts} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Producto</DialogTitle>
                </DialogHeader>
                <ProductForm onSubmit={handleCreateProduct} submitText="Crear Producto" isSubmitting={isSubmitting} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Lista de productos */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer producto"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Producto
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold truncate">{product.nombre}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{product.proveedor}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ${Number(product.precio).toFixed(2)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {product.imagen ? (
                    <img
                      src={product.imagen || "/placeholder.svg"}
                      alt={product.nombre}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  {product.descripcion && <p className="text-sm text-gray-600 line-clamp-2">{product.descripcion}</p>}

                  <div className="flex space-x-2">
                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Editar Producto</DialogTitle>
                        </DialogHeader>
                        <ProductForm
                          onSubmit={handleUpdateProduct}
                          submitText="Actualizar Producto"
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
                            ¿Estás seguro de que deseas eliminar el producto "{product.nombre}"? Esta acción no se puede
                            deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProduct(product.id)}
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
        <div className="mt-12 text-center text-gray-500">
          <p>
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
        </div>
      </div>
    </div>
  )
}
