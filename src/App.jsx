import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full border text-sm mr-2 mb-2 transition ${
        active ? 'bg-black text-white border-black' : 'bg-white text-gray-800 border-gray-300 hover:border-black'
      }`}
    >
      {label}
    </button>
  )
}

function Card({ title, subtitle, image, tags = [], why }) {
  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
      <div className="flex gap-4">
        <img src={image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop'} alt="" className="w-20 h-20 object-cover rounded-lg" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.slice(0,4).map((t) => (
              <span key={t} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>
      {why && <p className="text-sm text-gray-600 mt-3">{why}</p>}
    </div>
  )
}

export default function App() {
  const [step, setStep] = useState('home')
  const [loading, setLoading] = useState(false)
  const [quiz, setQuiz] = useState({
    familles_aimees: [], familles_evitees: [], notes_aimees: [], notes_evitees: [], sillage_cible: 2, tenue_cible: 2, contextes: ['quotidien'], saisons: ['tempéré'], budget_range: '50-120', references_aimees: []
  })
  const [recos, setRecos] = useState(null)
  const familles = ['citrus','floral','boisé','ambré','aromatique','cuiré','gourmand','marin','vert']

  const canNext = useMemo(() => {
    if (step === 'quiz1') return quiz.familles_aimees.length > 0
    if (step === 'quiz2') return true
    return true
  }, [step, quiz])

  const startQuiz = () => setStep('quiz1')

  const submitQuiz = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/quiz/recommendations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(quiz) })
      const data = await res.json()
      setRecos(data)
      setStep('recos')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-peach-50 to-orange-50">
      {step === 'home' && (
        <div className="relative">
          <div className="h-[60vh] w-full">
            <Spline scene="https://prod.spline.design/c1w2QYixcPkptHWE/scene.splinecode" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 shadow-xl text-center max-w-md pointer-events-auto">
              <h1 className="text-2xl font-bold">Trouve ton parfum</h1>
              <p className="text-gray-600 mt-1">Profil olfactif rapide. Recos claires. Inclusif. Sans jargon.</p>
              <div className="mt-4">
                <button onClick={startQuiz} className="px-4 py-2 rounded-lg bg-black text-white">Trouver mon profil</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step.startsWith('quiz') && (
        <div className="max-w-xl mx-auto p-4">
          <h2 className="text-xl font-semibold mb-3">Mon profil olfactif</h2>

          {step === 'quiz1' && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Familles que tu aimes</p>
              <div className="flex flex-wrap">
                {familles.map(f => (
                  <Chip key={f} label={f} active={quiz.familles_aimees.includes(f)} onClick={() => setQuiz(q => ({...q, familles_aimees: q.familles_aimees.includes(f) ? q.familles_aimees.filter(x=>x!==f) : [...q.familles_aimees, f]}))} />
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button disabled={!canNext} onClick={() => setStep('quiz2')} className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-40">Suivant</button>
              </div>
            </div>
          )}

          {step === 'quiz2' && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Sillage et tenue</p>
              <div className="flex gap-2 mb-3">
                {[1,2,3].map(v => (
                  <Chip key={v} label={`Sillage ${v}`} active={quiz.sillage_cible===v} onClick={() => setQuiz(q => ({...q, sillage_cible: v}))} />
                ))}
              </div>
              <div className="flex gap-2">
                {[1,2,3].map(v => (
                  <Chip key={v} label={`Tenue ${v}`} active={quiz.tenue_cible===v} onClick={() => setQuiz(q => ({...q, tenue_cible: v}))} />
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep('quiz1')} className="px-4 py-2 rounded-lg border">Retour</button>
                <button onClick={() => setStep('quiz3')} className="px-4 py-2 rounded-lg bg-black text-white">Suivant</button>
              </div>
            </div>
          )}

          {step === 'quiz3' && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Saisons</p>
              <div className="flex flex-wrap">
                {['froid','tempéré','chaud','humide'].map(s => (
                  <Chip key={s} label={s} active={quiz.saisons.includes(s)} onClick={() => setQuiz(q => ({...q, saisons: q.saisons.includes(s) ? q.saisons.filter(x=>x!==s) : [...q.saisons, s]}))} />
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep('quiz2')} className="px-4 py-2 rounded-lg border">Retour</button>
                <button onClick={submitQuiz} className="px-4 py-2 rounded-lg bg-black text-white">Voir mes recos</button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 'recos' && (
        <div className="max-w-xl mx-auto p-4">
          <h2 className="text-xl font-semibold mb-3">Tes recommandations</h2>
          {loading && <p>Chargement…</p>}
          {!loading && recos && (
            <div className="space-y-6">
              <section>
                <h3 className="font-semibold mb-2">Top matchs</h3>
                <div className="grid grid-cols-1 gap-3">
                  {recos.top_matchs.map((r) => (
                    <Card key={r.id} title={r.nom} subtitle={r.marque} image={r.image} tags={[...r.familles, ...r.accords_principaux]} why={r.pourquoi} />
                  ))}
                </div>
              </section>
              <section>
                <h3 className="font-semibold mb-2">Alternatives budget</h3>
                <div className="grid grid-cols-1 gap-3">
                  {recos.alternatives_budget.map((r) => (
                    <Card key={r.id} title={r.nom} subtitle={r.marque} image={r.image} tags={[...r.familles, ...r.accords_principaux]} why={r.pourquoi} />
                  ))}
                </div>
              </section>
              <section>
                <h3 className="font-semibold mb-2">Wildcards</h3>
                <div className="grid grid-cols-1 gap-3">
                  {recos.wildcards.map((r) => (
                    <Card key={r.id} title={r.nom} subtitle={r.marque} image={r.image} tags={[...r.familles, ...r.accords_principaux]} why={r.pourquoi} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
