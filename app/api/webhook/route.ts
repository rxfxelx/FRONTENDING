import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
    }

    const token = authorization.split(" ")[1]
    const { message, user_id } = await request.json()

    const response = await fetch(`${BACKEND_URL}/webhook/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mensagem: message, user_id: user_id }),
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json({ response: data.resposta })
    }

    return NextResponse.json({ error: data.detail || "Erro ao processar webhook" }, { status: response.status })
  } catch (error) {
    console.error("Erro ao processar webhook:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}