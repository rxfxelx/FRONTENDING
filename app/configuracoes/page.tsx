"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"
import Layout from "../components/Layout"
import { Settings, Save } from "lucide-react"

export default function Configuracoes() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [aiTone, setAiTone] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchConfig()
    }
  }, [user])

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/configuracoes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setAiTone(data.aiTone || "")
      }
    } catch (error) {
      console.error("Erro ao buscar configurações:", error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/configuracoes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ aiTone }),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Configurações da IA</h1>
          <p className="text-gray-400">Defina como sua IA de vendas deve se comportar</p>
        </div>

        <div className="card max-w-2xl">
          <div className="flex items-center mb-6">
            <Settings className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-white">Tom da IA</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Como sua IA deve responder aos clientes?
              </label>
              <textarea
                rows={6}
                className="input-field w-full"
                placeholder="Ex: Seja simpática e direta. Use uma linguagem amigável e profissional. Sempre destaque os benefícios dos produtos e tente fechar a venda de forma natural."
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-2">
                Descreva o tom, estilo e comportamento que sua IA deve ter ao conversar com os clientes.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Configurações"}
              </button>
            </div>

            {saved && <div className="text-green-400 text-sm text-center">Configurações salvas com sucesso!</div>}
          </div>
        </div>

        <div className="card max-w-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Exemplos de Tom</h3>
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-orange-400 mb-2">Profissional e Formal</h4>
              <p className="text-gray-300 text-sm">
                "Seja sempre educada e profissional. Use tratamento formal e linguagem técnica quando apropriado. Foque
                nos benefícios e especificações dos produtos."
              </p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-orange-400 mb-2">Amigável e Casual</h4>
              <p className="text-gray-300 text-sm">
                "Seja descontraída e amigável. Use uma linguagem casual e próxima. Faça o cliente se sentir à vontade e
                crie uma conversa natural."
              </p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-orange-400 mb-2">Consultiva e Especialista</h4>
              <p className="text-gray-300 text-sm">
                "Atue como uma consultora especialista. Faça perguntas para entender as necessidades do cliente e
                recomende os melhores produtos baseado no perfil dele."
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
