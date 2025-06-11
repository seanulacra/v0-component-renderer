'use client'

import { useState } from 'react'
import { Sandpack } from '@codesandbox/sandpack-react'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/v0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate component')
      }

      setCode(data.code)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">v0 Component Renderer</h1>
        
        <form onSubmit={handleGenerate} className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Component Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the component you want to generate..."
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Component ✨'}
          </button>
        </form>

        {code && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Live Preview</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Sandpack
                template="react-ts"
                files={{
                  '/App.tsx': code,
                }}
                options={{
                  autorun: true,
                  showNavigator: false,
                  showTabs: true,
                  showLineNumbers: true,
                  showInlineErrors: true,
                  editorHeight: 300,
                  previewHeight: 400,
                  externalResources: [
                    "https://cdn.tailwindcss.com"
                  ]
                }}
                theme="light"
              />
            </div>
            
            <details className="bg-white rounded-lg shadow-md p-6">
              <summary className="font-semibold text-gray-800 cursor-pointer">
                View Raw Code
              </summary>
              <pre className="mt-4 p-4 bg-gray-100 rounded overflow-x-auto text-sm">
                <code>{code}</code>
              </pre>
            </details>
          </div>
        )}
      </div>
    </main>
  )
}