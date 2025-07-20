import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
    }

    const token = authorization.split(" ")[1]

    const response = await fetch(`${BACKEND_URL}/products/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: data.detail || "Erro ao listar produtos" }, { status: response.status })
  } catch (error) {
    console.error("Erro ao listar produtos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
    }

    const token = authorization.split(" ")[1]
    const productData = await request.json()

    const response = await fetch(`${BACKEND_URL}/products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json(data, { status: 201 })
    }

    return NextResponse.json({ error: data.detail || "Erro ao criar produto" }, { status: response.status })
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}