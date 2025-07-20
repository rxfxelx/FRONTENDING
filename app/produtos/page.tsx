"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"
import Layout from "../components/Layout"
import { Plus, Edit, Trash2, Package } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
}

export default function Produtos() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/produtos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")
      const url = editingProduct ? `/api/produtos/${editingProduct.id}` : "/api/produtos"
      const method = editingProduct ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number.parseFloat(formData.price),
        }),
      })

      if (response.ok) {
        fetchProducts()
        setShowModal(false)
        setEditingProduct(null)
        setFormData({ name: "", description: "", price: "" })
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`/api/produtos/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          fetchProducts()
        }
      } catch (error) {
        console.error("Erro ao deletar produto:", error)
      }
    }
  }

  const openModal = () => {
    setEditingProduct(null)
    setFormData({ name: "", description: "", price: "" })
    setShowModal(true)
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Meus Produtos</h1>
            <p className="text-gray-400">Gerencie os produtos da sua IA de vendas</p>
          </div>
          <button onClick={openModal} className="btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Novo Produto
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhum produto cadastrado</h3>
            <p className="text-gray-500 mb-4">Comece adicionando seu primeiro produto</p>
            <button onClick={openModal} className="btn-primary">
              Adicionar Produto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(product)} className="text-blue-400 hover:text-blue-300">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">{product.description}</p>
                <p className="text-xl font-bold text-orange-400">R$ {product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-4">
                {editingProduct ? "Editar Produto" : "Novo Produto"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                  <input
                    type="text"
                    required
                    className="input-field w-full"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
                  <textarea
                    required
                    rows={3}
                    className="input-field w-full"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="input-field w-full"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingProduct ? "Salvar" : "Criar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
