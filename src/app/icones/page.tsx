import { PageHeader } from '@/components/PageHeader'
import {
  Heart, Users, GraduationCap, Shield,
  ArrowRight, ExternalLink, Download, Mail,
  CheckCircle2, AlertTriangle, XCircle, Info,
  TrendingUp, PiggyBank, Wallet, Calculator,
  BookOpen, Lightbulb, Target, Compass,
  Globe, Calendar, MessageCircle, Star,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface IconItem {
  name: string
  Icon: LucideIcon
  color: string
}

interface IconGroup {
  label: string
  description: string
  icons: IconItem[]
}

const iconGroups: IconGroup[] = [
  {
    label: 'Valeurs & Mission',
    description: 'Icônes incarnant les valeurs fondatrices d\'Emancia',
    icons: [
      { name: 'Émancipation', Icon: GraduationCap, color: '#7A4F6D' },
      { name: 'Communauté', Icon: Users, color: '#1A8F8A' },
      { name: 'Bienveillance', Icon: Heart, color: '#7A4F6D' },
      { name: 'Confiance', Icon: Shield, color: '#1A2B3C' },
    ],
  },
  {
    label: 'Finance & Éducation',
    description: 'Icônes pour le contenu financier et pédagogique',
    icons: [
      { name: 'Croissance', Icon: TrendingUp, color: '#1A8F8A' },
      { name: 'Épargne', Icon: PiggyBank, color: '#A8C280' },
      { name: 'Portefeuille', Icon: Wallet, color: '#1A2B3C' },
      { name: 'Calculateur', Icon: Calculator, color: '#1A8F8A' },
      { name: 'Apprentissage', Icon: BookOpen, color: '#7A4F6D' },
      { name: 'Idée', Icon: Lightbulb, color: '#A8C280' },
      { name: 'Objectif', Icon: Target, color: '#1A2B3C' },
      { name: 'Exploration', Icon: Compass, color: '#1A8F8A' },
    ],
  },
  {
    label: 'Navigation',
    description: 'Icônes d\'interface et de navigation',
    icons: [
      { name: 'Suivant', Icon: ArrowRight, color: '#1A8F8A' },
      { name: 'Lien externe', Icon: ExternalLink, color: '#4A4A4A' },
      { name: 'Télécharger', Icon: Download, color: '#4A4A4A' },
      { name: 'Email', Icon: Mail, color: '#1A2B3C' },
      { name: 'Site web', Icon: Globe, color: '#1A8F8A' },
      { name: 'Calendrier', Icon: Calendar, color: '#4A4A4A' },
    ],
  },
  {
    label: 'Feedback',
    description: 'Icônes pour les retours utilisateur et notifications',
    icons: [
      { name: 'Succès', Icon: CheckCircle2, color: '#4CAF82' },
      { name: 'Attention', Icon: AlertTriangle, color: '#F0A500' },
      { name: 'Erreur', Icon: XCircle, color: '#E05252' },
      { name: 'Information', Icon: Info, color: '#88C9C7' },
      { name: 'Message', Icon: MessageCircle, color: '#1A8F8A' },
      { name: 'Favori', Icon: Star, color: '#F0A500' },
    ],
  },
]

export default function IconesPage() {
  return (
    <>
      <PageHeader
        title="Icônes"
        description="Catalogue d'icônes Emancia basé sur Lucide React. Chaque icône utilise les couleurs de la charte et un trait fin (strokeWidth: 1.5) pour une apparence cohérente."
      />

      {iconGroups.map((group) => (
        <section key={group.label} className="mb-12">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{group.label}</h2>
            <p className="text-sm text-gris-texte/70">{group.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {group.icons.map(({ name, Icon, color }) => (
              <div key={name} className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 border border-gris-leger/30 hover:shadow-md transition-shadow">
                <Icon size={28} style={{ color }} strokeWidth={1.5} />
                <span className="text-center text-xs text-gris-texte/70">{name}</span>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Utilisation</h2>
        <div className="rounded-xl bg-bleu-nuit p-6 overflow-x-auto">
          <pre className="text-xs text-teal-clair font-mono leading-relaxed">{`// Installation
npm install lucide-react

// Import
import { Heart, Users, TrendingUp } from 'lucide-react'

// Usage — toujours strokeWidth={1.5}
<Heart size={24} color="#7A4F6D" strokeWidth={1.5} />
<Users size={24} color="#1A8F8A" strokeWidth={1.5} />
<TrendingUp size={24} color="#1A8F8A" strokeWidth={1.5} />`}</pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Règles</h2>
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-5 border border-gris-leger/30">
            <h3 className="font-semibold mb-1">Épaisseur du trait</h3>
            <p className="text-sm text-gris-texte/80">Toujours utiliser <code className="font-mono text-teal bg-teal/5 px-1 rounded">strokeWidth={'{1.5}'}</code> pour une apparence fine et élégante.</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gris-leger/30">
            <h3 className="font-semibold mb-1">Tailles recommandées</h3>
            <p className="text-sm text-gris-texte/80">16px (inline), 20px (boutons), 24px (navigation), 28-32px (héros). Ne pas dépasser 48px.</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gris-leger/30">
            <h3 className="font-semibold mb-1">Couleurs</h3>
            <p className="text-sm text-gris-texte/80">Utiliser uniquement les couleurs de la charte. Les icônes fonctionnelles utilisent les couleurs fonctionnelles (succès, erreur, etc.).</p>
          </div>
        </div>
      </section>
    </>
  )
}
