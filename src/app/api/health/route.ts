import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    name: 'PNG to WebP Converter',
    version: '1.0.0',
    features: [
      'Client-side conversion using Canvas API',
      'Batch processing support',
      'Quality adjustment',
      'Resize options',
      'Privacy-focused (no server uploads)'
    ],
    deployment: 'Cloudflare Pages',
    timestamp: new Date().toISOString()
  })
}