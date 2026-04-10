import { PLATFORMS, STATUSES, PILLARS, EFFORTS } from './types'
import type { ContentIdea } from './types'

export function getStatusInfo(status: string) {
  return STATUSES.find(s => s.value === status) || STATUSES[0]
}

export function getPlatformInfo(platform: string) {
  return PLATFORMS.find(p => p.value === platform)
}

export function getPillarInfo(pillar: string) {
  return PILLARS.find(p => p.value === pillar)
}

export function getEffortInfo(effort: string) {
  return EFFORTS.find(e => e.value === effort)
}

export function getIdeaPlatforms(idea: ContentIdea): string[] {
  if (idea.platforms && idea.platforms.length > 0) return idea.platforms
  if (idea.platform) return [idea.platform]
  return []
}

export function getIdeaContentTypes(idea: ContentIdea): string[] {
  if (idea.content_types && idea.content_types.length > 0) return idea.content_types
  if (idea.content_type) return [idea.content_type]
  return []
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes}min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `il y a ${days}j`
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function getWeekDays(weekOffset: number): Date[] {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)
  monday.setHours(0, 0, 0, 0)
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push(d)
  }
  return days
}

export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0]
}
