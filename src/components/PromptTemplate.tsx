'use client'

import { useState } from 'react'
import { FileText, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'

const PROMPT_TEMPLATE = `Tu es un expert en design de marque et développement web full-stack. Je veux créer un site interne de charte graphique / brand guidelines pour mon entreprise.

---

## INFORMATIONS SUR MON ENTREPRISE

- **Nom de l'entreprise** : [NOM]
- **Secteur d'activité** : [SECTEUR]
- **Baseline / slogan** : [BASELINE]
- **Mission en une phrase** : [MISSION]
- **Valeurs fondatrices** (3-5 valeurs) : [VALEURS]
- **Public cible** : [PUBLIC]
- **Ton de communication** (ex: professionnel, accessible, expert, décontracté) : [TON]

---

## IDENTITÉ VISUELLE

### Couleurs
- **Couleur primaire principale** (hex) : [EX: #1A8F8A]
- **Couleur primaire secondaire / fond sombre** (hex) : [EX: #1A2B3C]
- **Couleur de fond claire** (hex) : [EX: #F2F5EE]
- **Couleurs secondaires** (2-3 hex) : [EX: #7A4F6D, #A8C280, #88C9C7]
- **Couleurs fonctionnelles** : succès [HEX], erreur [HEX], warning [HEX]

### Typographie
- **Police display / titres** : [EX: Fraunces]
- **Police body / texte** : [EX: DM Sans]
- **Police mono / données** : [EX: JetBrains Mono]

### Logo
- J'ai les fichiers SVG suivants : [LISTER : logo-icon.svg, logo-main.svg, logo-baseline.svg, etc.]
- Placer les fichiers dans \`/public/logos/\`

---

## STACK TECHNIQUE

Créer un projet Next.js (App Router) avec :
- **Next.js 15+** avec TypeScript
- **Tailwind CSS 4** (utiliser \`@theme\` pour les design tokens)
- **Supabase** pour l'authentification (email + mot de passe) et la base de données
- **lucide-react** pour les icônes
- **Déploiement** sur Vercel (auto-deploy depuis GitHub)

---

## STRUCTURE DU SITE

### Authentification
- Page login (\`/login\`) : fond pleine page couleur sombre, logo centré au-dessus, formulaire glassmorphism, cercles de couleur en fond pour la profondeur
- Deux modes : **Se connecter** (email + mot de passe) et **Créer un compte** (nom + email + mot de passe, rôle viewer par défaut)
- Middleware de protection des routes (redirection vers /login si non connecté)
- Callback route pour la confirmation email (\`/auth/callback\`)
- IMPORTANT : déplacer \`createClient()\` dans les handlers (pas au top-level du composant) pour éviter les erreurs de prerendering Vercel

### Layout principal
- **Sidebar** à gauche (couleur primaire, logo en haut, navigation par sections)
- **Zone de contenu** à droite avec fond clair, \`max-w-6xl\` pour laisser de la place au kanban
- **Page profil** avec rôle (admin/viewer), déconnexion, et bouton "Prompt Template" (ce prompt, copiable en un clic)

### Pages à créer

1. **Identité** (\`/\`) — Page d'accueil avec résumé de la marque, mission, valeurs
2. **Logo** (\`/logo\`) — Versions du logo, zone de protection, déclinaisons chromatiques, usages interdits
3. **Couleurs** (\`/couleurs\`) — Palette complète avec swatches (copier hex au clic), associations psychologie des couleurs ↔ valeurs, couleurs fonctionnelles, dégradés
4. **Typographie** (\`/typographie\`) — Échelle typographique, specimens, règles d'usage
5. **Composants** (\`/composants\`) — Boutons, inputs, cards, badges, alerts avec preview live
6. **Règles** (\`/regles\`) — Do/Don't avec exemples visuels côte à côte
7. **Ton éditorial** (\`/ton-editorial\`) — Philosophie de communication, axes de voix, expressions préférées, mots interdits
8. **Icônes** (\`/icones\`) — Catalogue d'icônes groupées par catégorie
9. **Graphiques** (\`/graphiques\`) — Templates de dataviz (KPI cards, bar chart, donut, line chart) avec les couleurs brand
10. **Tokens** (\`/tokens\`) — Export des design tokens en CSS / JSON / Tailwind
11. **Contextes** (\`/contextes\`) — Mockups du logo en situation réelle (navbar, email, réseaux sociaux, footer)
12. **Formes** (\`/formes\`) — Playground interactif pour tester radius et couleurs
13. **Idées de contenus** (\`/idees-contenus\`) — CRUD collaboratif avec vue **Kanban (Board)** et vue **Liste** :
    - Proposer des idées par plateforme (Instagram, YouTube, LinkedIn, TikTok, X)
    - 4 colonnes de statut : Idée → Validé → En cours → Publié
    - **Drag & drop** : glisser les cartes entre colonnes pour changer le statut (HTML5 Drag API, mise à jour optimiste en base)
    - Toggle Board / Liste en haut à droite
    - Barre de stats avec compteurs par statut
    - Filtre par plateforme
    - Champ lien optionnel + détection auto des URLs dans la description (composant Linkify)
    - Chaque membre peut modifier/supprimer ses propres idées uniquement
    - Formulaire modal pour création/édition

### Navigation sidebar (groupée)
\`\`\`
Fondamentaux : Identité, Logo, Couleurs, Typographie
Communication : Ton éditorial, Idées de contenus
Outils : Icônes, Composants, Formes, Graphiques, Tokens
Mise en pratique : Contextes, Do/Don't
\`\`\`

---

## ARCHITECTURE TECHNIQUE

### Design tokens (\`lib/brand/\`)
- \`types.ts\` — Interfaces TypeScript pour BrandKit (couleurs, typo, spacing, radius)
- \`defaults.ts\` — Valeurs par défaut exportées

### Supabase (\`lib/supabase/\`)
- \`client.ts\` — Client navigateur (createBrowserClient)
- \`server.ts\` — Client serveur (createServerClient avec cookies)
- \`middleware.ts\` — Gestion de session + redirection auth

### Composants réutilisables (\`src/components/\`)
- \`Sidebar.tsx\` — Navigation avec sections groupées
- \`PageHeader.tsx\` — Titre + description pour chaque page
- \`CopyButton.tsx\` — Copier dans le presse-papier avec feedback
- \`ColorSwatch.tsx\` — Swatch couleur cliquable (copie hex)
- \`ProfileActions.tsx\` — Bouton déconnexion
- \`PromptTemplate.tsx\` — Ce prompt, accessible depuis le profil

### Tailwind CSS 4 (\`globals.css\`)
- Utiliser \`@theme { }\` pour déclarer toutes les couleurs, polices, spacing, radius
- Règle globale : body → font-body, color gris-texte, bg blanc-cassé
- Règle globale : h1-h4 → font-display, color couleur-sombre
- Override \`.dark-context h1-h4 { color: inherit }\` pour les zones à fond sombre

### Base de données Supabase
Table \`content_ideas\` :
\`\`\`sql
CREATE TABLE content_ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT,
  platform TEXT NOT NULL,
  content_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  link TEXT,
  status TEXT DEFAULT 'idee',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture pour tous les utilisateurs connectés"
  ON content_ideas FOR SELECT TO authenticated USING (true);

CREATE POLICY "Insertion pour les utilisateurs connectés"
  ON content_ideas FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Mise à jour par le propriétaire"
  ON content_ideas FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Suppression par le propriétaire"
  ON content_ideas FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
\`\`\`

---

## RÈGLES DE DESIGN

1. **Coins arrondis** : \`rounded-xl\` (12px) pour les cartes, \`rounded-lg\` (8px) pour les inputs/boutons
2. **Bordures** : \`border border-gris-leger/30\` sur les cartes blanches
3. **Ombres** : Minimales, utiliser les bordures pour la structure
4. **Espacement** : Sections séparées par \`mb-12\`, éléments internes par \`gap-4\`
5. **Texte secondaire** : Toujours \`text-gris-texte/60\` ou \`/70\`
6. **Données numériques** : Toujours en \`font-mono\`
7. **Bouton principal** : \`bg-[primaire] text-white rounded-lg hover:bg-[primaire-dark]\`
8. **Glassmorphism** (login) : \`bg-white/[0.07] backdrop-blur-xl border border-white/10\`
9. **Drag & drop** : utiliser l'API HTML5 native (pas de librairie), avec mise à jour optimiste + rollback en cas d'erreur
10. **CSS Specificity** : les headings globaux (h1-h4) forcent la couleur sombre → ajouter \`.dark-context\` et \`.sidebar-scroll\` avec \`color: inherit\` pour les zones à fond coloré. Utiliser \`style={{ color: '#ffffff' }}\` en inline si nécessaire

---

## INSTRUCTIONS DE DÉPLOIEMENT

1. Créer le repo GitHub
2. Connecter à Vercel (auto-deploy)
3. Ajouter les variables d'environnement dans Vercel :
   - \`NEXT_PUBLIC_SUPABASE_URL\`
   - \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
4. Configurer Supabase :
   - Site URL : \`https://[projet].vercel.app\`
   - Redirect URLs : \`https://[projet].vercel.app/**\`
5. Exécuter le SQL pour créer la table \`content_ideas\`

---

Commence par créer la structure complète du projet, puis implémente chaque page une par une. Assure-toi que \`npx next build\` passe sans erreur TypeScript avant chaque commit.`

export function PromptTemplate() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROMPT_TEMPLATE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = PROMPT_TEMPLATE
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="mt-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full px-5 py-4 bg-bleu-nuit/5 hover:bg-bleu-nuit/8 rounded-xl transition-colors text-left group"
      >
        <div className="w-10 h-10 rounded-lg bg-bleu-nuit/10 flex items-center justify-center shrink-0">
          <FileText size={18} className="text-bleu-nuit" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-bleu-nuit">Prompt Template</p>
          <p className="text-xs text-gris-texte/50 mt-0.5">
            Prompt pour recréer ce site de charte graphique de A à Z, adaptable à tout business
          </p>
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-gris-texte/40 shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-gris-texte/40 shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="mt-3 rounded-xl border border-gris-leger/30 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-blanc-casse border-b border-gris-leger/30">
            <span className="text-xs text-gris-texte/50 font-medium">
              {PROMPT_TEMPLATE.split('\n').length} lignes — Remplis les champs [ENTRE CROCHETS] avec tes infos
            </span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                copied
                  ? 'bg-success/10 text-success'
                  : 'bg-teal/10 text-teal hover:bg-teal/20'
              }`}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copié !' : 'Copier le prompt'}
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[500px] overflow-y-auto bg-white">
            <pre className="p-5 text-xs leading-relaxed text-gris-texte/80 whitespace-pre-wrap font-mono">
              {PROMPT_TEMPLATE}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
