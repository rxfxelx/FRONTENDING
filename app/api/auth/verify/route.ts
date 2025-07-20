import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
    }

    const token = authorization.split(" ")[1]

    const response = await fetch(`${BACKEND_URL}/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await response.json()

    if (response.ok) {
      // O backend retorna o objeto UserResponse, precisamos adaptar para o formato do frontend
      return NextResponse.json({
        user: { id: data.id.toString(), email: data.email, name: data.full_name },
      })
    }

    return NextResponse.json({ error: data.detail || "Token inválido" }, { status: response.status })
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
