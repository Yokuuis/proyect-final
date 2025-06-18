"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function ConnectionTest() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<{
    status: "success" | "error" | "info"
    message: string
    details?: string
  } | null>(null)

  const testConnection = async () => {
    setTesting(true)
    setResult(null)

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/tu-proyecto"

    try {
      const response = await fetch(`${API_BASE_URL}/api/productos/read.php`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      const contentType = response.headers.get("content-type")

      if (!response.ok) {
        setResult({
          status: "error",
          message: `Error HTTP: ${response.status}`,
          details: `Verifica que la URL ${API_BASE_URL} sea correcta y que XAMPP esté ejecutándose.`,
        })
        return
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        setResult({
          status: "error",
          message: "El servidor no devuelve JSON",
          details: `Respuesta recibida: ${text.substring(0, 200)}...`,
        })
        return
      }

      const data = await response.json()

      if (data.success) {
        setResult({
          status: "success",
          message: "Conexión exitosa con el backend PHP",
          details: `Se encontraron ${data.data?.length || 0} productos en la base de datos.`,
        })
      } else {
        setResult({
          status: "error",
          message: "Error en el backend",
          details: data.message || "Error desconocido",
        })
      }
    } catch (error) {
      setResult({
        status: "error",
        message: "Error de conexión",
        details: error instanceof Error ? error.message : "Error desconocido",
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Test de Conexión</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testConnection} disabled={testing} className="w-full">
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Probando...
            </>
          ) : (
            "Probar Conexión"
          )}
        </Button>

        {result && (
          <Alert className={result.status === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {result.status === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={result.status === "success" ? "text-green-800" : "text-red-800"}>
              <div className="font-medium">{result.message}</div>
              {result.details && <div className="text-sm mt-1 opacity-90">{result.details}</div>}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <div>URL actual: {process.env.NEXT_PUBLIC_API_URL || "http://localhost/tu-proyecto"}</div>
          <div>Configura la URL en .env.local</div>
        </div>
      </CardContent>
    </Card>
  )
}
