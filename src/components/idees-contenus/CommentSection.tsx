'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import type { IdeaComment } from './types'
import { timeAgo } from './utils'

interface CommentSectionProps {
  comments: IdeaComment[]
  onAddComment: (text: string) => void
}

export function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAddComment(trimmed)
    setText('')
  }

  return (
    <div className="px-6 py-4 border-t border-gris-leger/30">
      <p className="text-[10px] uppercase tracking-wider text-bleu-nuit/40 font-medium mb-3">
        Commentaires {comments.length > 0 && `(${comments.length})`}
      </p>

      {/* Comments list */}
      {comments.length > 0 && (
        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5">
              <div className="w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-semibold text-teal">
                  {(comment.user_name || '?')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-bleu-nuit">{comment.user_name}</span>
                  <span className="text-[10px] text-bleu-nuit/30">{timeAgo(comment.created_at)}</span>
                </div>
                <p className="text-xs text-bleu-nuit/70 leading-relaxed mt-0.5 whitespace-pre-wrap">
                  {comment.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {comments.length === 0 && (
        <p className="text-xs text-bleu-nuit/30 mb-3">Aucun commentaire pour le moment.</p>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ajouter un commentaire..."
          className="flex-1 px-3 py-2 rounded-lg text-xs border border-gris-leger/30 bg-blanc-casse text-bleu-nuit placeholder:text-bleu-nuit/30 focus:outline-none focus:border-teal/40 focus:ring-1 focus:ring-teal/20 transition-all"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-2 rounded-lg bg-teal text-white hover:bg-teal-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  )
}
