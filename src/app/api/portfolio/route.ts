import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

const COLLECTION = 'portfolioData'
const DOC_ID = 'main'

// GET /api/portfolio — returns current portfolio data
export async function GET() {
  try {
    const db = await getDb()
    const doc = await db.collection(COLLECTION).findOne({ _id: DOC_ID as any })
    if (!doc) {
      return NextResponse.json({ data: null }, { status: 404 })
    }
    // Remove the internal _id before sending
    const { _id, ...data } = doc
    return NextResponse.json({ data })
  } catch (err) {
    console.error('[GET /api/portfolio]', err)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

// POST /api/portfolio — saves portfolio data (password protected)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { password, data } = body

    // Simple password check
    const expectedPwd = process.env.DASHBOARD_PASSWORD
    if (expectedPwd && password !== expectedPwd) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()
    await db.collection(COLLECTION).replaceOne(
      { _id: DOC_ID as any },
      { _id: DOC_ID as any, ...data },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/portfolio]', err)
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}
