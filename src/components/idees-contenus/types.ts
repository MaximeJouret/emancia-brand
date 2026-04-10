import { Camera, Play, Briefcase, Video, MessageCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface ContentIdea {
  id: string
  user_id: string
  user_email: string
  user_name: string | null
  platform: string
  platforms: string[]
  content_type: string
  content_types: string[]
  pillar: string
  effort: string
  audience: string[]
  title: string
  description: string
  link: string | null
  status: string
  scheduled_date: string | null
  liked_by: string[]
  position: number
  created_at: string
  updated_at: string
}

export interface PlatformConfig {
  value: string
  label: string
  icon: LucideIcon
  color: string
}

export interface StatusConfig {
  value: string
  label: string
  bg: string
  text: string
  dot: string
  color: string
  headerBg: string
  borderColor: string
}

export interface PillarConfig {
  value: string
  label: string
  emoji: string
  color: string
}

export interface EffortConfig {
  value: string
  label: string
  icon: string
  color: string
}

export interface AudienceConfig {
  value: string
  label: string
}

export const PLATFORMS: PlatformConfig[] = [
  { value: 'instagram', label: 'Instagram', icon: Camera, color: '#E1306C' },
  { value: 'youtube', label: 'YouTube', icon: Play, color: '#FF0000' },
  { value: 'linkedin', label: 'LinkedIn', icon: Briefcase, color: '#0A66C2' },
  { value: 'tiktok', label: 'TikTok', icon: Video, color: '#000000' },
  { value: 'twitter', label: 'X / Twitter', icon: MessageCircle, color: '#1DA1F2' },
]

export const CONTENT_TYPES = [
  'Post image',
  'Carrousel',
  'Reel / Short',
  'Story',
  'Vidéo longue',
  'Article / Blog',
  'Newsletter',
  'Thread',
  'Live',
  'Autre',
]

export const PILLARS: PillarConfig[] = [
  { value: 'budget', label: 'Budget & Épargne', emoji: '💰', color: '#1A8F8A' },
  { value: 'investissement', label: 'Investissement', emoji: '📈', color: '#0A66C2' },
  { value: 'dette', label: 'Gestion de dette', emoji: '🔓', color: '#7A4F6D' },
  { value: 'arnaques', label: 'Arnaques & Pièges', emoji: '🛡️', color: '#E74C3C' },
  { value: 'fiscalite', label: 'Fiscalité', emoji: '📋', color: '#F0A500' },
  { value: 'mindset', label: 'Mindset financier', emoji: '🧠', color: '#A8C280' },
  { value: 'actu', label: 'Actualité éco', emoji: '📰', color: '#1A2B3C' },
  { value: 'temoignage', label: 'Témoignage', emoji: '🎤', color: '#E1306C' },
]

export const EFFORTS: EffortConfig[] = [
  { value: 'quick', label: 'Rapide', icon: '⚡', color: '#A8C280' },
  { value: 'medium', label: 'Moyen', icon: '⏱️', color: '#F0A500' },
  { value: 'complex', label: 'Complexe', icon: '🎬', color: '#7A4F6D' },
]

export const AUDIENCES: AudienceConfig[] = [
  { value: 'debutants', label: 'Débutants' },
  { value: 'jeunes', label: 'Jeunes 18-25' },
  { value: 'parents', label: 'Parents' },
  { value: 'independants', label: 'Indépendants' },
  { value: 'salaries', label: 'Salariés' },
  { value: 'tous', label: 'Tout public' },
]

export const STATUSES: StatusConfig[] = [
  { value: 'idee', label: 'Idée', bg: 'bg-sauge/15', text: 'text-sauge', dot: 'bg-sauge', color: '#A8C280', headerBg: 'bg-sauge/10', borderColor: 'border-sauge/20' },
  { value: 'valide', label: 'Validé', bg: 'bg-teal/10', text: 'text-teal', dot: 'bg-teal', color: '#1A8F8A', headerBg: 'bg-teal/10', borderColor: 'border-teal/20' },
  { value: 'en_cours', label: 'En cours', bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning', color: '#F0A500', headerBg: 'bg-warning/10', borderColor: 'border-warning/20' },
  { value: 'publie', label: 'Publié', bg: 'bg-success/10', text: 'text-success', dot: 'bg-success', color: '#5A8A4A', headerBg: 'bg-success/10', borderColor: 'border-success/20' },
]

export const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
export const MONTH_NAMES = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
