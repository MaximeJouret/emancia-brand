import { PageHeader } from '@/components/PageHeader'
import { TokenExporter } from '@/components/TokenExporter'
import { brand } from '@/lib/brand'

export default function TokensPage() {
  return (
    <>
      <PageHeader
        title="Design Tokens"
        description="Exportez les tokens de design Emancia dans le format de votre choix. Ces tokens sont la source de vérité pour tous les projets."
      />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Exporter les tokens</h2>
        <TokenExporter />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Référence rapide</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gris-leger">
                <th className="text-left py-3 pr-4 font-semibold text-bleu-nuit">Token</th>
                <th className="text-left py-3 pr-4 font-semibold text-bleu-nuit">Valeur</th>
                <th className="text-left py-3 font-semibold text-bleu-nuit">Usage</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(brand.colors.primary).map(([key, token]) => (
                <tr key={key} className="border-b border-gris-leger/30">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-gris-leger/30" style={{ backgroundColor: token.hex }} />
                      <code className="text-xs font-mono">--emancia-{key.replace(/([A-Z])/g, '-$1').toLowerCase()}</code>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs">{token.hex}</td>
                  <td className="py-3 text-xs text-gris-texte/80">{token.usage}</td>
                </tr>
              ))}
              {Object.entries(brand.colors.secondary).map(([key, token]) => (
                <tr key={key} className="border-b border-gris-leger/30">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-gris-leger/30" style={{ backgroundColor: token.hex }} />
                      <code className="text-xs font-mono">--emancia-{key.replace(/([A-Z])/g, '-$1').toLowerCase()}</code>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs">{token.hex}</td>
                  <td className="py-3 text-xs text-gris-texte/80">{token.usage}</td>
                </tr>
              ))}
              {Object.entries(brand.colors.functional).map(([key, token]) => (
                <tr key={key} className="border-b border-gris-leger/30">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-gris-leger/30" style={{ backgroundColor: token.hex }} />
                      <code className="text-xs font-mono">--emancia-{key}</code>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs">{token.hex}</td>
                  <td className="py-3 text-xs text-gris-texte/80">{token.usage}</td>
                </tr>
              ))}
              {Object.entries(brand.borderRadius).map(([key, value]) => (
                <tr key={key} className="border-b border-gris-leger/30">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border border-gris-leger" style={{ borderRadius: value }} />
                      <code className="text-xs font-mono">--emancia-radius-{key}</code>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs">{value}</td>
                  <td className="py-3 text-xs text-gris-texte/80">Border radius {key}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
