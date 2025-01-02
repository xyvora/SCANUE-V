import { NextRequest } from 'next/server'
import { POST } from '@/app/api/chat/route'

// Mock Response if not available in test environment
if (typeof Response === 'undefined') {
  class MockResponse implements Response {
    private readonly response: Response;

    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this.response = new Response(body || '', init);
    }

    // Implement Response interface methods by delegating to this.response
    get body() { return this.response.body }
    get bodyUsed() { return this.response.bodyUsed }
    get headers() { return this.response.headers }
    get ok() { return this.response.ok }
    get redirected() { return this.response.redirected }
    get status() { return this.response.status }
    get statusText() { return this.response.statusText }
    get type() { return this.response.type }
    get url() { return this.response.url }
    clone() { return this.response.clone() }
    async arrayBuffer() { return this.response.arrayBuffer() }
    async blob() { return this.response.blob() }
    async formData() { return this.response.formData() }
    async json() { return this.response.json() }
    async text() { return this.response.text() }

    static error() {
      return new Response(null, { status: 500 })
    }

    static json(data: unknown, init?: ResponseInit) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    static redirect(url: string | URL, status = 302) {
      return new Response(null, {
        status,
        headers: { Location: url.toString() },
      })
    }
  }

  global.Response = MockResponse as unknown as typeof Response
}

describe('Chat API', () => {
  it('handles valid requests', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Test message',
        agent: 'General'
      })
    })

    const response = await POST(req)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.message).toBeDefined()
    expect(data.agentResponse).toBeDefined()
    expect(data.timestamp).toBeDefined()
  })

  it('handles invalid agent type', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Test message',
        agent: 'Invalid'
      })
    })

    const response = await POST(req)
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toBe('Invalid agent type')
  })

  it('handles missing fields', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({})
    })

    const response = await POST(req)
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toBe('Missing required fields')
  })
})
