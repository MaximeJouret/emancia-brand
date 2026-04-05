'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface ColorToken {
  hex: string
  name: string
  usage: string
}

export function ColorSwatch({ token }: { token: ColorToken }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(token.hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="group cursor-pointer" onClick={handleCopy}>
      <div
        className="h-24 rounded-xl mb-3 border border-gris-leger/30 transition-transform group-hover:scale-105 relative overflow-hidden"
        style={{ backgroundColor: token.hex }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
          {copied ? (
            <span className="flex items-center gap-1 text-xs font-medium text-white bg-black/40 px-2 py-1 rounded-full">
              <Check size={12} /> Copié !
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-white bg-black/40 px-2 py-1 rounded-full">
              <Copy size={12} /> Copier
            </span>
          )}
        </div>
      </div>
      <p className="font-medium text-sm">{token.name}</p>
      <p className="font-mono text-xs text-gris-texte/60 mt-0.5">{token.hex}</p>
      <p className="text-xs text-gris-texte/80 mt-1">{token.usage}</p>
    </div>
  )
}
