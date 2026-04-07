import { createServerSupabase } from '@/lib/supabase/server'
import { PageHeader } from '@/components/PageHeader'
import { ProfileActions } from '@/components/ProfileActions'
import { PromptTemplate } from '@/components/PromptTemplate'

export default async function ProfilPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const role = user.user_metadata?.role || 'viewer'
  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'

  return (
    <>
      <PageHeader
        title="Mon profil"
        description="Vos informations et votre rôle au sein de l'espace Emancia."
      />

      <section className="mb-12">
        <div className="bg-white rounded-2xl p-8 border border-gris-leger/30">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-full bg-teal flex items-center justify-center text-white font-display font-bold text-2xl">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-bleu-nuit">{fullName}</h2>
              <p className="text-sm text-bleu-nuit/60">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-blanc-casse rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-bleu-nuit/40 mb-1">Rôle</p>
              <div className="flex items-center gap-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  role === 'admin'
                    ? 'bg-prune/10 text-prune'
                    : 'bg-teal/10 text-teal'
                }`}>
                  {role === 'admin' ? 'Administrateur' : 'Lecteur'}
                </span>
              </div>
              <p className="text-xs text-bleu-nuit/50 mt-2">
                {role === 'admin'
                  ? 'Vous pouvez modifier les guidelines de la charte graphique.'
                  : 'Vous pouvez consulter la charte graphique. Contactez un admin pour obtenir les droits d\'édition.'}
              </p>
            </div>

            <div className="bg-blanc-casse rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-bleu-nuit/40 mb-1">Membre depuis</p>
              <p className="text-sm font-medium text-bleu-nuit">
                {new Date(user.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <ProfileActions />

          <PromptTemplate />
        </div>
      </section>
    </>
  )
}
