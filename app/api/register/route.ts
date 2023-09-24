import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/lib/db'
import supabase from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return new NextResponse('Missing info', { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const imgUrl = `assets/default-pfp/discord-default-pfp-${Math.floor(Math.random() * 5) + 1}.svg`
    const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(imgUrl)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        emailVerified: new Date(),
        image: publicUrlData.publicUrl,
      },
    })

    return NextResponse.json(user)
  } catch (error: any) {
    console.error(error, 'REGISTRATION_ERROR')
    return new NextResponse('Internal Error', { status: 500 })
  }
}
