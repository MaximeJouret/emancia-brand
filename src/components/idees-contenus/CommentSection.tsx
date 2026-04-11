'use client'

import { useState } from 'react'
import { Send, Pencil, Trash2, X, Check } from 'lucide-react'
import type { IdeaComment } from './types'
import { timeAgo } from './utils'

interface CommentSectionProps {
  comments: IdeaComment[]
  userId: string | null
  onAddComment: (text: string) => void
  onDeleteComment: (commentId: string) => void
  onEditComment: (commentId: string, newText: string) => void
}

export function CommentSection({ comments, userId, onAddComment, onDeleteComment, onEditComment }: CommentSectionProps) {
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAddComment(trimmed)
    setText('')
  }

  const startEdit = (comment: IdeaComment) => {
    setEditingId(comment.id)
    setEditText(comment.text)
  }

  const confirmEdit = () => {
    if (!editingId || !editText.trim()) return
    onEditComment(editingId, editText.trim())
    setEditingId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  return (
    <div className="px-6 py-4 border-t border-gris-leger/30">
      <p className="text-[10px] uppercase tracking-wider text-bleu-nuit/40 font-medium mb-3">
        Commentaires {comments.length > 0 && `(${comments.length})`}
      </p>

      {/* Comments list */}
      {comments.length > 0 && (
        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
          {comments.map((comment) => {
            const isOwner = userId === comment.user_id
            const isEditing = editingId === comment.id

            return (
              <div key={comment.id} className="group flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-semibold text-teal">
                    {(comment.user_name || '?')[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-bleu-nuit">{comment.user_name}</span>
                    <span className="text-[10px] text-bleu-nuit/30">{timeAgo(comment.created_at)}</span>

                    {/* Actions — visible on hover, only for own comments */}
                    {isOwner && !isEditing && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                        <button
                          onClick={() => startEdit(comment)}
                          className="p-1 rounded text-bleu-nuit/30 hover:text-teal transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={11} />
                        </button>
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="p-1 rounded text-bleu-nuit/30 hover:text-error transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') confirmEdit(); if (e.key === 'Escape') cancelEdit() }}
                        autoFocus
                        className="flex-1 px-2 py-1 rounded text-xs border border-teal/30 bg-white text-bleu-nuit focus:outline-none focus:ring-1 focus:ring-teal/20 transition-all"
                      />
                      <button onClick={confirmEdit} className="p-1 rounded text-teal hover:bg-teal/10 transition-colors" title="Valider">
                        <Check size={13} />
                      </button>
                      <button onClick={cancelEdit} className="p-1 rounded text-bleu-nuit/30 hover:text-bleu-nuit transition-colors" title="Annuler">
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-bleu-nuit/70 leading-relaxed mt-0.5 whitespace-pre-wrap">
                      {comment.text}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
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
