"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Upload,
  X,
  Check,
  AlertTriangle,
  Home,
  Package,
  Users,
  LogOut,
  Menu,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Product {
  id: number
  name: string
  description: string
  price: number
  supplier: string
  image: string
}

export default function ProductsDashboard() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "MacBook Pro 14",
      description: "Laptop profesional con chip M3 Pro",
      price: 2499.99,
      supplier: "Apple Inc.",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      description: "Smartphone con cámara profesional",
      price: 1199.99,
      supplier: "Apple Inc.",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Samsung Galaxy S24",
      description: "Smartphone Android flagship",
      price: 899.99,
      supplier: "Samsung",
      image: "/placeholder.svg?height=100&width=100",
    },
  ])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    supplier: "",
    image: "",
  })

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.supplier) return

    const newProduct: Product = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      supplier: formData.supplier,
      image: formData.image || "/placeholder.svg?height=100&width=100",
    }

    setProducts((prev) => [...prev, newProduct])
    setFormData({ name: "", description: "", price: "", supplier: "", image: "" })
    setIsCreateModalOpen(false)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      supplier: product.supplier,
      image: product.image,
    })
    setIsEditModalOpen(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct || !formData.name || !formData.price || !formData.supplier) return

    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      supplier: formData.supplier,
      image: formData.image || "/placeholder.svg?height=100&width=100",
    }

    setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p)))
    setFormData({ name: "", description: "", price: "", supplier: "", image: "" })
    setEditingProduct(null)
    setIsEditModalOpen(false)
  }

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", supplier: "", image: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const ProductForm = ({ onSubmit, submitText }: { onSubmit: (e: React.FormEvent) => void; submitText: string }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nombre del Producto *
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ej: MacBook Pro 14"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium text-gray-700">
            Precio *
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.00"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier" className="text-sm font-medium text-gray-700">
          Proveedor *
        </Label>
        <Input
          id="supplier"
          name="supplier"
          value={formData.supplier}
          onChange={handleInputChange}
          placeholder="Ej: Apple Inc."
          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
          Descripción
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe las características del producto..."
          className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Imagen del Producto</Label>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir Imagen
            </Button>
          </div>
          {formData.image && (
            <div className="relative">
              <img
                src={formData.image || "/placeholder.svg"}
                alt="Vista previa"
                className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
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
          }}
          className="px-6 hover:bg-gray-50 transition-colors duration-200"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="px-6 bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Check className="w-4 h-4 mr-2" />
          {submitText}
        </Button>
      </div>
    </form>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              <Home className="w-5 h-5 mr-3" />
              Inicio
            </Button>
            <Button variant="default" className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
              <Package className="w-5 h-5 mr-3" />
              Productos
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              <Users className="w-5 h-5 mr-3" />
              Proveedores
            </Button>
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4">
                <Menu className="w-5 h-5" />
              </Button>
              <h2 className="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
            </div>

            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar productos o proveedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={resetForm}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-800">Crear Nuevo Producto</DialogTitle>
                </DialogHeader>
                <ProductForm onSubmit={handleSubmit} submitText="Crear Producto" />
              </DialogContent>
            </Dialog>
          </div>

          {/* Products Table */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Productos Registrados ({filteredProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Proveedor
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg border-2 border-gray-200 mr-4"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {product.description || "Sin descripción"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 font-semibold">
                            ${product.price.toFixed(2)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.supplier}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(product)}
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-semibold text-gray-800">
                                    Editar Producto
                                  </DialogTitle>
                                </DialogHeader>
                                <ProductForm onSubmit={handleUpdate} submitText="Actualizar Producto" />
                              </DialogContent>
                            </Dialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center">
                                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                                    Confirmar Eliminación
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    ¿Estás seguro de que deseas eliminar el producto "{product.name}"? Esta acción no se
                                    puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="hover:bg-gray-50 transition-colors duration-200">
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(product.id)}
                                    className="bg-red-600 hover:bg-red-700 transition-colors duration-200"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                  <p className="text-gray-500">
                    {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer producto"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
