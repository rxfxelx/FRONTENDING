import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        full_name: name, // Mapeia 'name' do frontend para 'full_name' do backend
        company_name: "", // Pode ser ajustado para um campo no frontend ou opcional
        ai_tone: "Seja profissional e prestativo ao responder sobre nossos produtos.", // Valor padrão ou configurável
      }),
    })

    const data = await response.json()

    if (response.ok) {
      // O backend retorna o objeto UserResponse, precisamos adaptar para o formato do frontend
      return NextResponse.json({
        user: { id: data.id.toString(), email: data.email, name: data.full_name },
        token: data.access_token, // O backend não retorna access_token no registro, isso precisará ser obtido via login após o registro
      })
    }

    return NextResponse.json({ error: data.detail || "Erro ao registrar usuário" }, { status: response.status })
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
