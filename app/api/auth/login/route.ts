import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json({
        user: { id: data.user_id, email: email, name: "" }, // Adapte conforme a resposta do seu backend
        token: data.access_token,
      })
    }

    return NextResponse.json({ error: data.detail || "Credenciais inválidas" }, { status: response.status })
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
