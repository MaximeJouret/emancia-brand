import React from 'react'
import { X, Check, MessageCircle } from 'lucide-react'
import { PLATFORMS, CONTENT_TYPES, STATUSES, PILLARS, EFFORTS, AUDIENCES } from './types'
import { getPlatformInfo } from './utils'
import { ChipSelect } from './ChipSelect'

interface IdeaFormProps {
  editingId: string | null
  formTitle: string
  formDescription: string
  formLink: string
  formPlatforms: string[]
  formContentTypes: string[]
  formPillar: string
  formEffort: string
  formAudience: string[]
  formStatus: string
  onTitleChange: (v: string) => void
  onDescriptionChange: (v: string) => void
  onLinkChange: (v: string) => void
  onPlatformsChange: (v: string[]) => void
  onContentTypesChange: (v: string[]) => void
  onPillarChange: (v: string) => void
  onEffortChange: (v: string) => void
  onAudienceChange: (v: string[]) => void
  onStatusChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export function IdeaForm({
  editingId, formTitle, formDescription, formLink,
  formPlatforms, formContentTypes, formPillar, formEffort, formAudience, formStatus,
  onTitleChange, onDescriptionChange, onLinkChange,
  onPlatformsChange, onContentTypesChange, onPillarChange, onEffortChange, onAudienceChange, onStatusChange,
  onSubmit, onCancel,
}: IdeaFormProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-lg w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gris-leger/30 shrink-0">
          <h3 className="font-display text-lg font-semibold text-bleu-nuit">
            {editingId ? 'Modifier l\'idée' : 'Nouvelle idée de contenu'}
          </h3>
          <button type="button" onClick={onCancel} className="text-bleu-nuit/40 hover:text-bleu-nuit transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Titre *</label>
            <input
              value={formTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Ex: 5 erreurs d'investisseur débutant"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gris-leger text-sm text-bleu-nuit placeholder:text-bleu-nuit/30 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Description</label>
            <textarea
              value={formDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Décris le concept, le message clé, le format envisagé..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gris-leger text-sm text-bleu-nuit placeholder:text-bleu-nuit/30 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all resize-none"
            />
          </div>

          {/* Pillar + Effort row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Pilier</label>
              <div className="flex flex-wrap gap-1.5">
                {PILLARS.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => onPillarChange(p.value)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all border ${
                      formPillar === p.value
                        ? 'border-current bg-current/10'
                        : 'border-gris-leger/50 text-bleu-nuit/50 hover:border-bleu-nuit/20'
                    }`}
                    style={formPillar === p.value ? { color: p.color } : undefined}
                  >
                    <span>{p.emoji}</span>
                    <span className="hidden sm:inline">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Effort</label>
              <div className="flex gap-1.5">
                {EFFORTS.map(e => (
                  <button
                    key={e.value}
                    type="button"
                    onClick={() => onEffortChange(e.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex-1 justify-center ${
                      formEffort === e.value
                        ? 'border-current bg-current/10'
                        : 'border-gris-leger/50 text-bleu-nuit/50 hover:border-bleu-nuit/20'
                    }`}
                    style={formEffort === e.value ? { color: e.color } : undefined}
                  >
                    <span>{e.icon}</span>
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audience */}
          <div>
            <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Audience cible</label>
            <ChipSelect
              options={AUDIENCES.map(a => ({ value: a.value, label: a.label }))}
              selected={formAudience}
              onChange={onAudienceChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Plateformes</label>
            <ChipSelect
              options={PLATFORMS.map(p => ({ value: p.value, label: p.label }))}
              selected={formPlatforms}
              onChange={onPlatformsChange}
              renderOption={(opt, isActive) => {
                const p = getPlatformInfo(opt.value)
                const Icon = p?.icon || MessageCircle
                return (
                  <span className="flex items-center gap-1.5">
                    <Icon size={12} style={isActive ? { color: p?.color } : undefined} />
                    {opt.label}
                  </span>
                )
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Types de contenu</label>
            <ChipSelect
              options={CONTENT_TYPES.map(t => ({ value: t, label: t }))}
              selected={formContentTypes}
              onChange={onContentTypesChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Lien <span className="text-bleu-nuit/30 font-normal">(optionnel)</span></label>
            <input
              value={formLink}
              onChange={(e) => onLinkChange(e.target.value)}
              placeholder="https://..."
              type="url"
              className="w-full px-4 py-2.5 rounded-lg border border-gris-leger text-sm text-bleu-nuit placeholder:text-bleu-nuit/30 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Statut</label>
            <div className="flex gap-2">
              {STATUSES.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onStatusChange(s.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    formStatus === s.value
                      ? `${s.bg} ${s.text} ring-1 ring-current`
                      : 'bg-gris-leger/30 text-bleu-nuit/50 hover:bg-gris-leger/50'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${formStatus === s.value ? s.dot : 'bg-bleu-nuit/30'}`} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gris-leger/30 bg-blanc-casse/50 shrink-0">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-bleu-nuit/60 hover:text-bleu-nuit transition-colors">
            Annuler
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 bg-teal text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors"
          >
            <Check size={14} />
            {editingId ? 'Enregistrer' : 'Publier'}
          </button>
        </div>
      </form>
    </div>
  )
}
