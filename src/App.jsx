import { useState } from "react";

const COLORS = {
  sage: "#7A9E87",
  sageDark: "#5C7A67",
  sageLight: "#EAF2EC",
  cream: "#FAFAF7",
  charcoal: "#2C2C2C",
  mid: "#6B6B6B",
  light: "#D4D4CC",
  white: "#FFFFFF",
  score1: "#C0392B",
  score2: "#E67E22",
  score3: "#F1C40F",
  score4: "#27AE60",
  score5: "#1A7A4A",
  error: "#C0392B",
};

const contextQuestions = [
  {
    id: "taille",
    text: "Quelle est la taille de votre entreprise ?",
    options: ["1–10 salariés", "11–50 salariés", "51–200 salariés", "200+ salariés"],
    scored: false,
  },
  {
    id: "gestionnaire",
    text: "Qui gère la facturation et le suivi des paiements ?",
    options: ["Une personne dédiée ADV", "La comptabilité", "Le commercial", "Le dirigeant lui-même"],
    scored: false,
  },
];

const scoredQuestions = [
  { id: "backup", text: "Si cette personne est absente, quelqu'un peut prendre le relais ?", options: ["Oui", "Parfois", "Non"], values: [2, 1, 0] },
  { id: "process_doc", text: "Votre processus de facturation est-il documenté quelque part ?", options: ["Oui", "Parfois", "Non"], values: [2, 1, 0] },
  { id: "prerequis", text: "Les prérequis de chaque client (PO, bon de commande…) sont-ils connus et centralisés ?", options: ["Oui", "Parfois", "Non"], values: [2, 1, 0] },
  { id: "visibilite", text: "Vous savez à tout moment où en est chacune de vos factures ?", options: ["Oui", "Parfois", "Non"], values: [2, 1, 0] },
  { id: "outil", text: "Vous utilisez un outil dédié pour ce suivi ?", options: ["Oui", "Parfois", "Non"], values: [2, 1, 0] },
  { id: "delais", text: "Vos clients paient-ils dans les délais contractuels ?", options: ["Oui", "Parfois", "Non"], values: [2, 1, 0] },
  { id: "litiges", text: "Vous avez régulièrement des factures bloquées ou contestées ?", options: ["Non", "Parfois", "Oui"], values: [2, 1, 0] },
  { id: "tresorerie", text: "Les retards ont un impact concret sur votre trésorerie ?", options: ["Non", "Parfois", "Oui"], values: [2, 1, 0] },
  { id: "relance", text: "Vous avez une procédure de relance claire, appliquée régulièrement ?", options: ["Oui", "Parfois", "Non"], values: [2, 1, 0] },
];

const allQuestions = [...contextQuestions, ...scoredQuestions];

const SCORE_LEVELS = [
  { score: 1, label: "Critique", color: COLORS.score1, description: "Votre processus de facturation présente des fragilités majeures. Chaque retard non traité pèse directement sur votre trésorerie — et le risque s'accumule silencieusement. C'est le moment d'agir avant que la situation ne se dégrade.", cta: "Réserver un diagnostic ADV complet" },
  { score: 2, label: "Fragile", color: COLORS.score2, description: "Des bases existent, mais le process tient souvent à une seule personne ou à l'informel. Un départ, une absence, et tout peut se gripper. Structurer maintenant évite une crise plus tard.", cta: "Identifier les points de fragilité avec un diagnostic" },
  { score: 3, label: "Instable", color: COLORS.score3, description: "Vous gérez — mais en mode réactif plutôt que proactif. Des angles morts persistent, souvent là où on ne regarde pas. Un regard extérieur permet de les nommer et de les corriger avant qu'ils coûtent cher.", cta: "Aller plus loin avec un diagnostic ADV" },
  { score: 4, label: "Solide", color: COLORS.score4, description: "Votre process est globalement maîtrisé. Quelques points d'optimisation restent probablement à adresser — notamment sur la formalisation ou la robustesse face aux aléas. Un diagnostic ciblé peut confirmer ce qui fonctionne et affiner le reste.", cta: "Confirmer et optimiser avec un diagnostic" },
  { score: 5, label: "Maîtrisé", color: COLORS.score5, description: "Votre facturation est bien structurée et votre process semble solide. Vous pouvez tout de même bénéficier d'un regard extérieur pour valider vos pratiques et identifier des leviers de performance que l'habitude rend invisibles.", cta: "Valider vos pratiques avec un diagnostic expert" },
];

function computeScore(answers) {
  let total = 0;
  scoredQuestions.forEach((q) => { const ans = answers[q.id]; if (ans !== undefined) total += q.values[ans]; });
  const max = scoredQuestions.length * 2;
  const ratio = total / max;
  if (ratio <= 0.2) return 1;
  if (ratio <= 0.44) return 2;
  if (ratio <= 0.65) return 3;
  if (ratio <= 0.83) return 4;
  return 5;
}

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: COLORS.mid, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}>Question {current} sur {total}</span>
        <span style={{ fontSize: 12, color: COLORS.sage, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 3, background: COLORS.light, borderRadius: 2 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: COLORS.sage, borderRadius: 2, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function ScoreDisplay({ score, answers }) {
  const level = SCORE_LEVELS[score - 1];
  const taille = allQuestions[0].options[answers["taille"]] || "";
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.mid, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Votre score</p>
      <div style={{ display: "inline-block", marginBottom: 32 }}>
        <svg width={140} height={140} viewBox="0 0 140 140">
          <circle cx={70} cy={70} r={60} fill="none" stroke={COLORS.light} strokeWidth={8} />
          <circle cx={70} cy={70} r={60} fill="none" stroke={level.color} strokeWidth={8} strokeDasharray={`${(score / 5) * 376} 376`} strokeLinecap="round" transform="rotate(-90 70 70)" style={{ transition: "stroke-dasharray 0.8s ease" }} />
          <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle" fill={level.color} fontSize={42} fontFamily="'Playfair Display', serif" fontWeight={700}>{score}</text>
          <text x="50%" y="66%" textAnchor="middle" dominantBaseline="middle" fill={COLORS.mid} fontSize={13} fontFamily="'DM Sans', sans-serif">sur 5</text>
        </svg>
      </div>
      <div style={{ display: "inline-block", padding: "6px 20px", borderRadius: 100, background: level.color + "18", border: `1px solid ${level.color}40`, marginBottom: 28 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: level.color, fontSize: 15 }}>{level.label}</span>
      </div>
      {taille && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.mid, marginBottom: 20 }}>Pour une entreprise de <strong style={{ color: COLORS.charcoal }}>{taille.toLowerCase()}</strong></p>}
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: COLORS.charcoal, lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>{level.description}</p>
    </div>
  );
}

function EmailCapture({ score, onSubmitted }) {
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = prenom.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom: prenom.trim(), email: email.trim(), score }),
      });
      if (!res.ok) throw new Error();
      onSubmitted(prenom.trim());
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 6,
    border: `1.5px solid ${COLORS.light}`, fontFamily: "'DM Sans', sans-serif",
    fontSize: 15, color: COLORS.charcoal, background: COLORS.white,
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
  };

  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ width: "100%", height: 1, background: COLORS.light, marginBottom: 36 }} />
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: COLORS.charcoal, margin: "0 0 10px", fontWeight: 700 }}>
          Recevez votre analyse complète par email
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.mid, margin: 0, lineHeight: 1.6 }}>
          Un récapitulatif personnalisé avec les points clés à adresser en priorité.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        <input type="text" placeholder="Votre prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = COLORS.sage)}
          onBlur={(e) => (e.target.style.borderColor = COLORS.light)} />
        <input type="email" placeholder="Votre email professionnel" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = COLORS.sage)}
          onBlur={(e) => (e.target.style.borderColor = COLORS.light)}
          onKeyDown={(e) => e.key === "Enter" && isValid && handleSubmit()} />
      </div>
      {error && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.error, marginBottom: 12, textAlign: "center" }}>{error}</p>}
      <button onClick={handleSubmit} disabled={!isValid || loading}
        style={{
          width: "100%", background: isValid && !loading ? COLORS.sage : COLORS.light,
          color: isValid && !loading ? COLORS.white : COLORS.mid,
          border: "none", borderRadius: 4, padding: "15px 0", fontSize: 15,
          fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
          cursor: isValid && !loading ? "pointer" : "not-allowed",
          transition: "all 0.2s", marginBottom: 12,
        }}>
        {loading ? "Envoi en cours…" : "Recevoir mon analyse →"}
      </button>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.light, textAlign: "center", margin: 0 }}>
        Pas de spam. Un email utile, c'est tout.
      </p>
    </div>
  );
}

function ThankYou({ prenom, score, onRestart }) {
  const level = SCORE_LEVELS[score - 1];
  return (
    <div style={{ textAlign: "center", paddingTop: 8 }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.sageLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        <span style={{ fontSize: 22, color: COLORS.sage }}>✓</span>
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: COLORS.charcoal, margin: "0 0 16px", fontWeight: 700 }}>
        C'est envoyé, {prenom} !
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.mid, lineHeight: 1.7, marginBottom: 36 }}>
        Votre analyse est en route. Si vous souhaitez aller plus loin et transformer ce diagnostic en plan d'action concret, je suis disponible.
      </p>
      <div style={{ width: 48, height: 2, background: COLORS.sage, margin: "0 auto 32px" }} />
      <a href="mailto:nassma.toufaili@gmail.com"
        style={{ display: "inline-block", background: COLORS.sage, color: COLORS.white, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, padding: "14px 32px", borderRadius: 4, textDecoration: "none", marginBottom: 24 }}>
        {level.cta} →
      </a>
      <div style={{ marginTop: 24 }}>
        <button onClick={onRestart} style={{ background: "none", border: "none", color: COLORS.mid, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textDecoration: "underline" }}>
          Recommencer le diagnostic
        </button>
      </div>
    </div>
  );
}

export default function DiagADV() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState("questions"); // "questions" | "thankyou"
  const [submittedPrenom, setSubmittedPrenom] = useState("");

  const totalQ = allQuestions.length;
  const isIntro = step === 0;
  const isResult = step === totalQ + 1;
  const currentQ = allQuestions[step - 1];
  const score = computeScore(answers);

  const handleNext = () => {
    if (selected === null) return;
    setAnswers({ ...answers, [currentQ.id]: selected });
    setSelected(null);
    setStep(step + 1);
  };

  const handleRestart = () => { setStep(0); setAnswers({}); setSelected(null); setPhase("questions"); setSubmittedPrenom(""); };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ width: "100%", maxWidth: 560, background: COLORS.white, borderRadius: 12, padding: "52px 48px", boxShadow: "0 2px 24px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.light}` }}>

        {/* Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.sage }} />
          <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.sage, fontWeight: 600 }}>Pré-diagnostic ADV</span>
        </div>

        {/* THANK YOU */}
        {phase === "thankyou" && <ThankYou prenom={submittedPrenom} score={score} onRestart={handleRestart} />}

        {phase === "questions" && (
          <>
            {/* Title */}
            {!isResult && (
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isIntro ? 30 : 22, color: COLORS.charcoal, margin: "0 0 32px", lineHeight: 1.25, fontWeight: 700 }}>
                {isIntro ? "Votre processus de facturation est-il sous contrôle ?" : currentQ.text}
              </h1>
            )}
            {isResult && <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: COLORS.charcoal, margin: "0 0 36px", lineHeight: 1.25 }}>Résultats de votre diagnostic</h1>}

            {/* INTRO */}
            {isIntro && (
              <>
                <p style={{ fontSize: 16, color: COLORS.mid, lineHeight: 1.7, marginBottom: 36 }}>11 questions · 2 minutes · Un score de 1 à 5 avec une analyse personnalisée de votre situation.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
                  {["Retards de paiement fréquents ?", "Process non formalisé ?", "Manque de visibilité sur vos factures ?"].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: COLORS.sageLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: COLORS.sage, fontSize: 11, fontWeight: 700 }}>✓</span>
                      </div>
                      <span style={{ fontSize: 15, color: COLORS.charcoal }}>{item}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep(1)} style={{ width: "100%", background: COLORS.sage, color: COLORS.white, border: "none", borderRadius: 4, padding: "16px 0", fontSize: 16, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                  Commencer le diagnostic →
                </button>
              </>
            )}

            {/* QUESTION */}
            {!isIntro && !isResult && (
              <>
                <ProgressBar current={step} total={totalQ} />
                {step <= 2 && (
                  <div style={{ marginBottom: 20 }}>
                    <span style={{ fontSize: 11, color: COLORS.sage, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, background: COLORS.sageLight, padding: "4px 10px", borderRadius: 100 }}>Contexte · non noté</span>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                  {currentQ.options.map((opt, idx) => (
                    <button key={opt} onClick={() => setSelected(idx)}
                      style={{ width: "100%", padding: "14px 20px", textAlign: "left", borderRadius: 6, border: selected === idx ? `2px solid ${COLORS.sage}` : `2px solid ${COLORS.light}`, background: selected === idx ? COLORS.sageLight : COLORS.white, color: selected === idx ? COLORS.sageDark : COLORS.charcoal, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: selected === idx ? 600 : 400, cursor: "pointer", transition: "all 0.15s ease" }}>
                      {opt}
                    </button>
                  ))}
                </div>
                <button onClick={handleNext} disabled={selected === null}
                  style={{ width: "100%", background: selected !== null ? COLORS.sage : COLORS.light, color: selected !== null ? COLORS.white : COLORS.mid, border: "none", borderRadius: 4, padding: "14px 0", fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: selected !== null ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                  {step === totalQ ? "Voir mes résultats →" : "Question suivante →"}
                </button>
              </>
            )}

            {/* RESULT + CAPTURE */}
            {isResult && (
              <>
                <ScoreDisplay score={score} answers={answers} />
                <EmailCapture score={score} onSubmitted={(p) => { setSubmittedPrenom(p); setPhase("thankyou"); }} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
