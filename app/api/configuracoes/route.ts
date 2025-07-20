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
      return NextResponse.json({ aiTone: data.ai_tone })
    }

    return NextResponse.json({ error: data.detail || "Erro ao obter configurações" }, { status: response.status })
  } catch (error) {
    console.error("Erro ao obter configurações:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
    }

    const token = authorization.split(" ")[1]
    const { aiTone } = await request.json()

    const response = await fetch(`${BACKEND_URL}/auth/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ai_tone: aiTone }),
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json({ aiTone: data.ai_tone })
    }

    return NextResponse.json({ error: data.detail || "Erro ao atualizar configurações" }, { status: response.status })
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}