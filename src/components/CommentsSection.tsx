'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageSquare, Send, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface Comment {
  id: string
  user_id: string
  user_name: string
  user_email: string
  page_slug: string
  message: string
  created_at: string
}

function timeAgo(dateStr: string): string {
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

export function CommentsSection({ pageSlug }: { pageSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [message, setMessage] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchComments = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('page_comments')
      .select('*')
      .eq('page_slug', pageSlug)
      .order('created_at', { ascending: true })

    if (error) {
      // Table might not exist yet - silently ignore
      if (!error.message.includes('does not exist')) {
        console.error('Error fetching comments:', error)
      }
    } else {
      setComments(data || [])
    }
  }, [pageSlug])

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || '')
        setUserEmail(user.email || '')
      }
      await fetchComments()
    }
    init()
  }, [fetchComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !userId) return

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('page_comments').insert({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      page_slug: pageSlug,
      message: message.trim(),
      created_at: new Date().toISOString(),
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('')
      setError('')
      await fetchComments()
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('page_comments').delete().eq('id', id)
    if (error) {
      setError(error.message)
    } else {
      await fetchComments()
    }
  }

  return (
    <div className="mt-16 border-t border-gris-leger/30 pt-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 text-sm font-medium text-gris-texte/60 hover:text-bleu-nuit transition-colors group"
      >
        <MessageSquare size={18} />
        <span>Commentaires</span>
        {comments.length > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-teal/10 text-teal text-xs font-semibold">
            {comments.length}
          </span>
        )}
        {isOpen ? (
          <ChevronUp size={14} className="text-gris-texte/30" />
        ) : (
          <ChevronDown size={14} className="text-gris-texte/30" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error/10 text-error text-xs border border-error/20">
              {error}
            </div>
          )}

          {/* Comments list */}
          {comments.length > 0 && (
            <div className="space-y-3 mb-5">
              {comments.map((comment) => {
                const isOwner = userId === comment.user_id
                const initials = comment.user_name
                  ? comment.user_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  : comment.user_email?.charAt(0).toUpperCase() || '?'

                return (
                  <div key={comment.id} className="flex gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-teal/10 text-teal flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-bleu-nuit">
                          {comment.user_name || comment.user_email?.split('@')[0]}
                        </span>
                        <span className="text-[10px] text-gris-texte/30">
                          {timeAgo(comment.created_at)}
                        </span>
                        {isOwner && (
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="p-0.5 rounded text-gris-texte/20 hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                            title="Supprimer"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gris-texte/70 leading-relaxed whitespace-pre-wrap">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {comments.length === 0 && (
            <p className="text-xs text-gris-texte/30 mb-4">
              Aucun commentaire pour le moment. Soyez le premier à donner votre avis.
            </p>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ajouter un commentaire..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-gris-leger/50 text-sm text-gris-texte placeholder:text-gris-texte/25 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all resize-none bg-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="p-2.5 rounded-xl bg-teal text-white hover:bg-teal-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
          <p className="text-[10px] text-gris-texte/25 mt-1.5">Entrée pour envoyer · Shift+Entrée pour un saut de ligne</p>
        </div>
      )}
    </div>
  )
}
