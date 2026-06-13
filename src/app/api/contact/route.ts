import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

// POST /api/contact — Save a new contact message to MongoDB
export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const db = await getDb()
    await db.collection('messages').insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
      read: false,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[POST /api/contact]', err)
    return NextResponse.json({ error: err.message || 'Failed to save message.' }, { status: 500 })
  }
}

// GET /api/contact — Fetch all messages (password protected)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const password = searchParams.get('password')

    const expectedPwd = process.env.DASHBOARD_PASSWORD
    if (expectedPwd && password !== expectedPwd) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()
    const messages = await db
      .collection('messages')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ messages })
  } catch (err: any) {
    console.error('[GET /api/contact]', err)
    return NextResponse.json({ error: 'Failed to fetch messages.' }, { status: 500 })
  }
}
