'use client'

import { useState, useRef, useCallback } from 'react'
import { PageHeader } from '@/components/PageHeader'
import {
  Upload, FileText, CheckCircle2, XCircle, AlertTriangle,
  Palette, Type, Eye, Shield, RotateCcw, ChevronDown, ChevronUp,
  Image as ImageIcon, Sparkles,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   Brand reference data
   ───────────────────────────────────────────── */

const BRAND_COLORS: { name: string; hex: string }[] = [
  { name: 'Teal', hex: '#1A8F8A' },
  { name: 'Bleu Nuit', hex: '#1A2B3C' },
  { name: 'Blanc Cassé', hex: '#F2F5EE' },
  { name: 'Prune', hex: '#7A4F6D' },
  { name: 'Teal Clair', hex: '#88C9C7' },
  { name: 'Sauge', hex: '#A8C280' },
  { name: 'Bleu Nuit Clair', hex: '#2A4A5C' },
  { name: 'Blanc', hex: '#FFFFFF' },
  { name: 'Erreur', hex: '#E05252' },
  { name: 'Succès', hex: '#5A8A4A' },
  { name: 'Avertissement', hex: '#F0A500' },
]

const FORBIDDEN_WORDS = [
  'garanti', 'rendement assuré', 'devenez riche', 'sans risque',
  'argent facile', 'secret des riches', 'méthode infaillible',
  'enrichissez-vous rapidement', 'opportunité unique',
  'revenus passifs garantis', "c'est simple", 'il suffit de',
  'tout le monde sait', 'vous devriez', 'évidemment',
]

const PREFERRED_PHRASES = [
  'comprendre pour décider', 'à votre rythme', 'pas à pas',
  'en toute transparence', 'les données montrent',
  'historiquement, on observe', 'chaque situation est unique',
  "informez-vous avant d'agir",
]

const TONE_WARNINGS = [
  { pattern: /!{2,}/g, message: 'Éviter les points d\'exclamation multiples (!! ou !!!)' },
  { pattern: /[A-ZÀÂÉÈÊËÏÎÔÙÛÜŸÇ]{5,}/g, message: 'Éviter les mots entièrement en majuscules (perçu comme agressif)' },
  { pattern: /💰|🤑|💸|🚀{2,}/g, message: 'Éviter les emojis liés à l\'argent ou au hype' },
  { pattern: /\b(cliquez|achetez|profitez)\s+(maintenant|vite|immédiatement)\b/gi, message: 'Éviter les CTA agressifs de type "Achetez maintenant"' },
  { pattern: /\b(incroyable|hallucinant|dingue|ouf|pépite)\b/gi, message: 'Éviter le vocabulaire sensationnaliste' },
]

/* ─────────────────────────────────────────────
   Utility functions
   ───────────────────────────────────────────── */

type Severity = 'error' | 'warning' | 'success'

interface CheckResult {
  id: string
  category: string
  icon: typeof Palette
  label: string
  severity: Severity
  message: string
  details?: string[]
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function colorDistance(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1)
  const [r2, g2, b2] = hexToRgb(hex2)
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function contrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1)
  const [r2, g2, b2] = hexToRgb(hex2)
  const l1 = relativeLuminance(r1, g1, b1)
  const l2 = relativeLuminance(r2, g2, b2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')
}

function findClosestBrandColor(hex: string): { name: string; hex: string; distance: number } | null {
  let closest: { name: string; hex: string; distance: number } | null = null
  for (const bc of BRAND_COLORS) {
    const d = colorDistance(hex, bc.hex)
    if (!closest || d < closest.distance) {
      closest = { ...bc, distance: d }
    }
  }
  return closest
}

/* ─────────────────────────────────────────────
   Image analysis (canvas-based)
   ───────────────────────────────────────────── */

function extractDominantColors(imageData: ImageData, sampleCount = 5): string[] {
  const { data, width, height } = imageData
  const colorMap: Record<string, number> = {}

  // Sample pixels in a grid pattern
  const stepX = Math.max(1, Math.floor(width / 50))
  const stepY = Math.max(1, Math.floor(height / 50))

  for (let y = 0; y < height; y += stepY) {
    for (let x = 0; x < width; x += stepX) {
      const i = (y * width + x) * 4
      const r = Math.round(data[i] / 17) * 17
      const g = Math.round(data[i + 1] / 17) * 17
      const b = Math.round(data[i + 2] / 17) * 17
      const a = data[i + 3]
      if (a < 128) continue // skip transparent
      const key = rgbToHex(r, g, b)
      colorMap[key] = (colorMap[key] || 0) + 1
    }
  }

  return Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, sampleCount)
    .map(([hex]) => hex)
}

/* ─────────────────────────────────────────────
   Check runners
   ───────────────────────────────────────────── */

function runTextChecks(text: string): CheckResult[] {
  const results: CheckResult[] = []
  const lower = text.toLowerCase()

  // 1. Forbidden words
  const foundForbidden: string[] = []
  for (const word of FORBIDDEN_WORDS) {
    if (lower.includes(word.toLowerCase())) {
      foundForbidden.push(word)
    }
  }
  results.push({
    id: 'forbidden-words',
    category: 'Ton éditorial',
    icon: Type,
    label: 'Mots interdits',
    severity: foundForbidden.length > 0 ? 'error' : 'success',
    message: foundForbidden.length > 0
      ? `${foundForbidden.length} expression(s) interdite(s) détectée(s)`
      : 'Aucun mot interdit détecté',
    details: foundForbidden.length > 0 ? foundForbidden.map(w => `« ${w} »`) : undefined,
  })

  // 2. Preferred phrases
  const foundPreferred: string[] = []
  for (const phrase of PREFERRED_PHRASES) {
    if (lower.includes(phrase.toLowerCase())) {
      foundPreferred.push(phrase)
    }
  }
  results.push({
    id: 'preferred-phrases',
    category: 'Ton éditorial',
    icon: Sparkles,
    label: 'Expressions préférées',
    severity: foundPreferred.length > 0 ? 'success' : 'warning',
    message: foundPreferred.length > 0
      ? `${foundPreferred.length} expression(s) de la marque utilisée(s)`
      : 'Aucune expression typique Emancia détectée — pensez à en intégrer',
    details: foundPreferred.length > 0 ? foundPreferred.map(p => `✓ « ${p} »`) : undefined,
  })

  // 3. Tone warnings
  const toneIssues: string[] = []
  for (const rule of TONE_WARNINGS) {
    if (rule.pattern.test(text)) {
      toneIssues.push(rule.message)
    }
    rule.pattern.lastIndex = 0 // reset regex
  }
  results.push({
    id: 'tone-check',
    category: 'Ton éditorial',
    icon: Shield,
    label: 'Ton & style',
    severity: toneIssues.length > 0 ? 'warning' : 'success',
    message: toneIssues.length > 0
      ? `${toneIssues.length} alerte(s) de ton`
      : 'Le ton semble conforme aux guidelines Emancia',
    details: toneIssues.length > 0 ? toneIssues : undefined,
  })

  // 4. Length check
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  results.push({
    id: 'length',
    category: 'Structure',
    icon: FileText,
    label: 'Longueur du texte',
    severity: wordCount < 10 ? 'warning' : 'success',
    message: `${wordCount} mot${wordCount > 1 ? 's' : ''} — ${wordCount < 10 ? 'texte très court, vérifiez qu\'il est complet' : 'longueur suffisante'}`,
  })

  // 5. Sources / credibility
  const hasSource = /source|étude|selon|d'après|recherche|données|statistique/i.test(text)
  results.push({
    id: 'sourcing',
    category: 'Crédibilité',
    icon: CheckCircle2,
    label: 'Sourçage',
    severity: hasSource ? 'success' : 'warning',
    message: hasSource
      ? 'Le texte semble référencer des sources — conforme à la valeur Rigueur'
      : 'Aucune mention de source détectée — pensez à citer vos données (valeur : Rigueur & Qualité)',
  })

  return results
}

function runImageChecks(dominantColors: string[]): CheckResult[] {
  const results: CheckResult[] = []

  // 1. Brand color compliance
  const colorAnalysis: string[] = []
  let onBrandCount = 0
  let offBrandColors: string[] = []

  for (const color of dominantColors) {
    const closest = findClosestBrandColor(color)
    if (closest && closest.distance < 50) {
      onBrandCount++
      colorAnalysis.push(`${color} ≈ ${closest.name} (${closest.hex})`)
    } else {
      offBrandColors.push(color)
      if (closest) {
        colorAnalysis.push(`${color} — hors palette (plus proche : ${closest.name})`)
      }
    }
  }

  const colorRatio = dominantColors.length > 0 ? onBrandCount / dominantColors.length : 0
  results.push({
    id: 'color-compliance',
    category: 'Couleurs',
    icon: Palette,
    label: 'Couleurs de la palette',
    severity: colorRatio >= 0.8 ? 'success' : colorRatio >= 0.5 ? 'warning' : 'error',
    message: `${Math.round(colorRatio * 100)}% des couleurs dominantes sont conformes à la palette`,
    details: colorAnalysis,
  })

  // 2. Off-brand colors
  if (offBrandColors.length > 0) {
    results.push({
      id: 'off-brand',
      category: 'Couleurs',
      icon: XCircle,
      label: 'Couleurs hors charte',
      severity: 'warning',
      message: `${offBrandColors.length} couleur(s) hors palette détectée(s)`,
      details: offBrandColors.map(c => {
        const closest = findClosestBrandColor(c)
        return `${c} → remplacer par ${closest?.name} (${closest?.hex})`
      }),
    })
  }

  return results
}

function runContrastChecks(fgHex: string, bgHex: string): CheckResult[] {
  const results: CheckResult[] = []
  const ratio = contrastRatio(fgHex, bgHex)
  const ratioStr = ratio.toFixed(2)

  // Normal text (WCAG AA = 4.5:1)
  results.push({
    id: 'contrast-normal',
    category: 'Accessibilité',
    icon: Eye,
    label: 'Contraste texte normal (WCAG AA)',
    severity: ratio >= 4.5 ? 'success' : ratio >= 3 ? 'warning' : 'error',
    message: `Ratio ${ratioStr}:1 — ${ratio >= 4.5 ? 'conforme AA' : ratio >= 3 ? 'insuffisant pour du texte normal (min 4.5:1), OK pour du gros texte' : 'non conforme (min 4.5:1)'}`,
  })

  // Large text (WCAG AA = 3:1)
  results.push({
    id: 'contrast-large',
    category: 'Accessibilité',
    icon: Eye,
    label: 'Contraste gros texte (WCAG AA)',
    severity: ratio >= 3 ? 'success' : 'error',
    message: `Ratio ${ratioStr}:1 — ${ratio >= 3 ? 'conforme pour les titres et texte gras' : 'non conforme même pour du gros texte (min 3:1)'}`,
  })

  // WCAG AAA
  results.push({
    id: 'contrast-aaa',
    category: 'Accessibilité',
    icon: Shield,
    label: 'Contraste texte (WCAG AAA)',
    severity: ratio >= 7 ? 'success' : 'warning',
    message: `Ratio ${ratioStr}:1 — ${ratio >= 7 ? 'conforme AAA (excellent)' : 'non conforme AAA (min 7:1) — pas obligatoire mais recommandé'}`,
  })

  return results
}

/* ─────────────────────────────────────────────
   Score calculation
   ───────────────────────────────────────────── */

function calculateScore(results: CheckResult[]): number {
  if (results.length === 0) return 0
  let score = 0
  for (const r of results) {
    if (r.severity === 'success') score += 100
    else if (r.severity === 'warning') score += 50
    // error = 0
  }
  return Math.round(score / results.length)
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#5A8A4A'
  if (score >= 50) return '#F0A500'
  return '#E05252'
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 80) return 'Conforme'
  if (score >= 60) return 'À améliorer'
  if (score >= 40) return 'Insuffisant'
  return 'Non conforme'
}

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */

export default function ConformitePage() {
  const [text, setText] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [dominantColors, setDominantColors] = useState<string[]>([])
  const [fgColor, setFgColor] = useState('#1A2B3C')
  const [bgColor, setBgColor] = useState('#F2F5EE')
  const [results, setResults] = useState<CheckResult[]>([])
  const [hasRun, setHasRun] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [analyzing, setAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      setImagePreview(src)

      // Extract colors from image
      const img = new window.Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        const colors = extractDominantColors(imageData, 8)
        setDominantColors(colors)
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file)
    }
  }, [handleImageUpload])

  const runAnalysis = () => {
    setAnalyzing(true)
    setResults([])

    // Simulate a brief processing delay for UX
    setTimeout(() => {
      const allResults: CheckResult[] = []

      // Text checks
      if (text.trim()) {
        allResults.push(...runTextChecks(text))
      }

      // Image checks
      if (dominantColors.length > 0) {
        allResults.push(...runImageChecks(dominantColors))
      }

      // Contrast checks
      allResults.push(...runContrastChecks(fgColor, bgColor))

      setResults(allResults)
      setHasRun(true)
      setAnalyzing(false)
      setExpandedIds(new Set(allResults.filter(r => r.severity === 'error').map(r => r.id)))
    }, 800)
  }

  const reset = () => {
    setText('')
    setImagePreview(null)
    setDominantColors([])
    setFgColor('#1A2B3C')
    setBgColor('#F2F5EE')
    setResults([])
    setHasRun(false)
    setExpandedIds(new Set())
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const score = calculateScore(results)
  const scoreColor = getScoreColor(score)
  const scoreLabel = getScoreLabel(score)

  const errorCount = results.filter(r => r.severity === 'error').length
  const warningCount = results.filter(r => r.severity === 'warning').length
  const successCount = results.filter(r => r.severity === 'success').length

  // Group results by category
  const categories = Array.from(new Set(results.map(r => r.category)))

  return (
    <>
      <PageHeader
        title="Checklist de conformité"
        description="Vérifiez que votre contenu respecte la charte graphique Emancia avant publication. Uploadez un visuel, collez votre texte et testez le contraste."
      />

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* ── Left: Input area ── */}
        <div className="space-y-6">
          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold text-bleu-nuit mb-2">
              <ImageIcon size={14} className="inline mr-1.5 -mt-0.5" />
              Visuel à vérifier
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg transition-all cursor-pointer ${
                imagePreview
                  ? 'border-teal/30 bg-teal/5'
                  : 'border-gris-leger hover:border-teal/40 hover:bg-teal/5'
              }`}
            >
              {imagePreview ? (
                <div className="p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" className="w-full rounded-md max-h-48 object-contain" />
                  {dominantColors.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="text-[10px] text-bleu-nuit/40 mr-1">Couleurs détectées :</span>
                      {dominantColors.map((c, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded border border-white shadow-sm"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-10 text-center">
                  <Upload size={32} className="mx-auto text-bleu-nuit/20 mb-3" />
                  <p className="text-sm text-bleu-nuit/50">
                    Glissez un visuel ici ou <span className="text-teal font-medium">parcourir</span>
                  </p>
                  <p className="text-[10px] text-bleu-nuit/30 mt-1">PNG, JPG, WebP</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
              />
            </div>
          </div>

          {/* Text input */}
          <div>
            <label className="block text-sm font-semibold text-bleu-nuit mb-2">
              <FileText size={14} className="inline mr-1.5 -mt-0.5" />
              Texte à vérifier
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Collez ici le texte de votre post, article, newsletter..."
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gris-leger text-sm text-bleu-nuit placeholder:text-bleu-nuit/30 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all resize-none"
            />
          </div>

          {/* Contrast checker */}
          <div>
            <label className="block text-sm font-semibold text-bleu-nuit mb-2">
              <Eye size={14} className="inline mr-1.5 -mt-0.5" />
              Vérification de contraste
            </label>
            <div className="bg-white rounded-lg border border-gris-leger p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-[10px] uppercase tracking-wider text-bleu-nuit/40 mb-1">Texte</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 rounded border border-gris-leger cursor-pointer"
                    />
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded border border-gris-leger text-xs font-mono text-bleu-nuit focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] uppercase tracking-wider text-bleu-nuit/40 mb-1">Fond</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded border border-gris-leger cursor-pointer"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded border border-gris-leger text-xs font-mono text-bleu-nuit focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>
              </div>

              {/* Live preview */}
              <div
                className="rounded-lg p-4 text-center border border-gris-leger/30"
                style={{ backgroundColor: bgColor }}
              >
                <p className="text-lg font-semibold" style={{ color: fgColor }}>
                  Aperçu du contraste
                </p>
                <p className="text-sm mt-1" style={{ color: fgColor, opacity: 0.8 }}>
                  Emancia — Éducation Financière
                </p>
              </div>

              {/* Quick presets */}
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-bleu-nuit/30">Presets :</span>
                {[
                  { fg: '#1A2B3C', bg: '#F2F5EE', label: 'Bleu Nuit / Blanc Cassé' },
                  { fg: '#1A2B3C', bg: '#FFFFFF', label: 'Bleu Nuit / Blanc' },
                  { fg: '#FFFFFF', bg: '#1A8F8A', label: 'Blanc / Teal' },
                  { fg: '#FFFFFF', bg: '#7A4F6D', label: 'Blanc / Prune' },
                  { fg: '#1A8F8A', bg: '#F2F5EE', label: 'Teal / Blanc Cassé' },
                  { fg: '#FFFFFF', bg: '#1A2B3C', label: 'Blanc / Bleu Nuit' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => { setFgColor(preset.fg); setBgColor(preset.bg) }}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium border border-gris-leger/50 hover:border-teal/30 hover:bg-teal/5 transition-colors text-bleu-nuit/60"
                  >
                    <div className="flex gap-0.5">
                      <div className="w-3 h-3 rounded-sm border border-white/50" style={{ backgroundColor: preset.fg }} />
                      <div className="w-3 h-3 rounded-sm border border-gris-leger/50" style={{ backgroundColor: preset.bg }} />
                    </div>
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={runAnalysis}
              disabled={analyzing || (!text.trim() && dominantColors.length === 0)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-teal text-white text-sm font-semibold rounded-lg hover:bg-teal-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Lancer la vérification
                </>
              )}
            </button>
            {hasRun && (
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-3 border border-gris-leger text-sm text-bleu-nuit/60 rounded-lg hover:bg-blanc-casse transition-colors"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div>
          {!hasRun ? (
            <div className="bg-white rounded-lg border border-gris-leger/30 p-12 text-center h-full flex flex-col items-center justify-center">
              <Shield size={48} className="text-bleu-nuit/10 mb-4" />
              <p className="text-bleu-nuit/40 text-sm mb-1">Aucune vérification lancée</p>
              <p className="text-bleu-nuit/25 text-xs">
                Ajoutez un visuel, du texte, ou les deux, puis cliquez sur &quot;Lancer la vérification&quot;
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score card */}
              <div className="bg-white rounded-lg border border-gris-leger/30 p-6">
                <div className="flex items-center gap-6">
                  {/* Circular score */}
                  <div className="relative w-24 h-24 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={scoreColor}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${score * 2.64} ${264 - score * 2.64}`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold" style={{ color: scoreColor }}>{score}</span>
                      <span className="text-[9px] text-bleu-nuit/40">/100</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="font-display text-lg font-semibold" style={{ color: scoreColor }}>
                      {scoreLabel}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      {errorCount > 0 && (
                        <span className="flex items-center gap-1 text-xs text-error">
                          <XCircle size={12} /> {errorCount} erreur{errorCount > 1 ? 's' : ''}
                        </span>
                      )}
                      {warningCount > 0 && (
                        <span className="flex items-center gap-1 text-xs text-warning">
                          <AlertTriangle size={12} /> {warningCount} alerte{warningCount > 1 ? 's' : ''}
                        </span>
                      )}
                      {successCount > 0 && (
                        <span className="flex items-center gap-1 text-xs text-success">
                          <CheckCircle2 size={12} /> {successCount} OK
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results by category */}
              {categories.map(cat => (
                <div key={cat}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-teal mb-2">{cat}</p>
                  <div className="space-y-2">
                    {results.filter(r => r.category === cat).map(result => {
                      const Icon = result.icon
                      const isExpanded = expandedIds.has(result.id)
                      const severityStyles = {
                        error: 'border-error/20 bg-error/5',
                        warning: 'border-warning/20 bg-warning/5',
                        success: 'border-success/20 bg-success/5',
                      }
                      const iconColor = {
                        error: '#E05252',
                        warning: '#F0A500',
                        success: '#5A8A4A',
                      }
                      const StatusIcon = result.severity === 'error' ? XCircle : result.severity === 'warning' ? AlertTriangle : CheckCircle2

                      return (
                        <div
                          key={result.id}
                          className={`rounded-lg border overflow-hidden transition-all ${severityStyles[result.severity]}`}
                        >
                          <button
                            onClick={() => result.details && toggleExpand(result.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left"
                          >
                            <Icon size={16} style={{ color: iconColor[result.severity] }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-bleu-nuit">{result.label}</p>
                              <p className="text-xs text-bleu-nuit/60 mt-0.5">{result.message}</p>
                            </div>
                            <StatusIcon size={16} style={{ color: iconColor[result.severity] }} />
                            {result.details && (
                              isExpanded
                                ? <ChevronUp size={14} className="text-bleu-nuit/30 shrink-0" />
                                : <ChevronDown size={14} className="text-bleu-nuit/30 shrink-0" />
                            )}
                          </button>
                          {result.details && isExpanded && (
                            <div className="px-4 pb-3 pt-0">
                              <div className="pl-7 border-l-2 border-current/10 ml-1 space-y-1">
                                {result.details.map((detail, i) => (
                                  <p key={i} className="text-xs text-bleu-nuit/60">{detail}</p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
