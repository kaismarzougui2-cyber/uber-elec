import React, { useState, useMemo } from "react";
import { Zap, Wrench, Car, Home, ShieldCheck, Lightbulb, ChevronRight, ChevronLeft, Check, Calendar, Clock, MapPin, Phone, Mail, User, CreditCard, Lock, AlertCircle, Sparkles } from "lucide-react";

export default function VoltaireApp() {
  const [step, setStep] = useState(0); // 0 home, 1 service, 2 slot, 3 info, 4 pay, 5 done
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [customer, setCustomer] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", zip: "", notes: "" });
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [processing, setProcessing] = useState(false);

  const services = [
    { id: "urgence", icon: AlertCircle, name: "Dépannage urgent", desc: "Intervention sous 2h, 7j/7", price: 149, duration: "1-2h", tag: "URGENT", category: "Urgence" },
    { id: "diagnostic", icon: ShieldCheck, name: "Diagnostic électrique", desc: "Audit complet de votre installation", price: 189, duration: "1-2h", category: "Diagnostic" },
    { id: "norme", icon: Wrench, name: "Mise aux normes NF C 15-100", desc: "Conformité tableau & circuits", price: 690, duration: "1 jour", category: "Rénovation" },
    { id: "tableau", icon: Zap, name: "Remplacement tableau électrique", desc: "Tableau neuf, modulaire, certifié", price: 890, duration: "1 jour", category: "Rénovation" },
    { id: "renovation", icon: Home, name: "Rénovation complète", desc: "Reprise totale T2 à T5+", price: 2490, duration: "3-7 jours", category: "Rénovation", from: true },
    { id: "borne", icon: Car, name: "Borne de recharge VE", desc: "7,4 à 22 kW, prime incluse", price: 1290, duration: "½ journée", category: "Mobilité", tag: "PRIME" },
    { id: "domotique", icon: Sparkles, name: "Domotique & maison connectée", desc: "Éclairage, volets, scénarios", price: 990, duration: "1-2 jours", category: "Confort", from: true },
    { id: "eclairage", icon: Lightbulb, name: "Éclairage LED & design", desc: "Pose, variation, ambiances", price: 240, duration: "2-4h", category: "Confort" },
  ];

  const categories = ["Urgence", "Diagnostic", "Rénovation", "Mobilité", "Confort"];

  // Generate next 14 days
  const days = useMemo(() => {
    const out = [];
    const now = new Date(2026, 4, 1); // May 1 2026
    for (let i = 1; i <= 14; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      out.push(d);
    }
    return out;
  }, []);

  const timeSlots = ["08:00", "09:30", "11:00", "13:30", "15:00", "16:30"];
  const unavailable = { 0: ["09:30", "13:30"], 1: ["11:00"], 3: ["08:00", "15:00"], 5: ["16:30"], 7: ["09:30"], 9: ["13:30", "15:00"] };

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const monthNames = ["jan", "fév", "mar", "avr", "mai", "jun", "jul", "aoû", "sep", "oct", "nov", "déc"];

  const totalPrice = selectedService?.price || 0;
  const deposit = Math.round(totalPrice * 0.3);
  const remaining = totalPrice - deposit;

  const formatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const canPay = card.number.replace(/\s/g, "").length === 16 && card.expiry.length === 5 && card.cvc.length === 3 && card.name.trim().length > 2;
  const canContinueInfo = customer.firstName && customer.lastName && customer.email.includes("@") && customer.phone.length >= 8 && customer.address && customer.city && customer.zip;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setStep(5); }, 1800);
  };

  const reset = () => {
    setStep(0); setSelectedService(null); setSelectedDate(null); setSelectedTime(null);
    setCustomer({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", zip: "", notes: "" });
    setCard({ number: "", expiry: "", cvc: "", name: "" });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
        .display { font-family: 'Archivo Black', sans-serif; letter-spacing: -0.02em; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.4); } 50% { box-shadow: 0 0 0 12px rgba(250, 204, 21, 0); } }
        .pulse-glow { animation: pulse-glow 2s infinite; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .slide-up { animation: slide-up 0.5s ease-out forwards; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(250, 204, 21, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250, 204, 21, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .bolt-pattern { background: radial-gradient(circle at 20% 30%, rgba(250, 204, 21, 0.08), transparent 40%), radial-gradient(circle at 80% 70%, rgba(250, 204, 21, 0.06), transparent 40%); }
        input::placeholder { color: rgb(82, 82, 82); }
        .step-line { background: linear-gradient(90deg, #facc15 var(--p), #262626 var(--p)); transition: --p 0.5s; }
      `}</style>

      {/* NAV */}
      <nav className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={reset} className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-yellow-400 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
              <Zap className="w-5 h-5 text-black" strokeWidth={3} fill="black" />
            </div>
            <div>
              <div className="display text-lg leading-none">VOLTAIRE</div>
              <div className="mono text-[10px] text-yellow-400 tracking-widest">ÉLECTRICITÉ · BASTIA</div>
            </div>
          </button>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <span className="text-neutral-400">Artisan certifié <span className="text-yellow-400">Qualifelec</span></span>
            <a href="tel:0686437640" className="flex items-center gap-2 text-yellow-400 font-semibold"><Phone className="w-4 h-4" />06 86 43 76 40</a>
          </div>
        </div>
      </nav>

      {/* STEP INDICATOR (visible from step 1) */}
      {step > 0 && step < 5 && (
        <div className="border-b border-neutral-800 bg-neutral-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 sm:gap-4">
              {["Prestation", "Créneau", "Infos", "Paiement"].map((label, i) => {
                const idx = i + 1;
                const active = step === idx;
                const done = step > idx;
                return (
                  <React.Fragment key={i}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0 ${done ? "bg-yellow-400 text-black" : active ? "bg-yellow-400 text-black pulse-glow" : "bg-neutral-800 text-neutral-500"}`}>
                        {done ? <Check className="w-4 h-4" strokeWidth={3} /> : idx}
                      </div>
                      <span className={`text-xs sm:text-sm font-semibold truncate ${active ? "text-yellow-400" : done ? "text-neutral-300" : "text-neutral-600"}`}>{label}</span>
                    </div>
                    {i < 3 && <div className={`flex-1 h-px ${done ? "bg-yellow-400" : "bg-neutral-800"}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 0 — HOME */}
      {step === 0 && (
        <div className="relative">
          <div className="absolute inset-0 grid-bg pointer-events-none" />
          <div className="absolute inset-0 bolt-pattern pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-24">
            <div className="slide-up">
              <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 mono text-xs text-yellow-400 mb-6">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                DISPONIBLE AUJOURD'HUI · INTERVENTION SOUS 2H
              </div>
              <h1 className="display text-5xl sm:text-7xl md:text-8xl leading-[0.9] mb-6">
                ON BRANCHE.<br />
                <span className="text-yellow-400">ON RÉPARE.</span><br />
                <span className="text-neutral-500">ON SÉCURISE.</span>
              </h1>
              <p className="text-lg text-neutral-400 max-w-xl mb-10">
                Réservez votre intervention en 2 minutes. Tarif fixe annoncé, créneau garanti, acompte de 30 % seulement à la réservation. Le solde se règle après le travail bien fait.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setStep(1)} className="group bg-yellow-400 hover:bg-yellow-300 text-black px-7 py-4 font-bold flex items-center gap-2 transition-all hover:translate-x-1">
                  RÉSERVER UNE INTERVENTION <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                </button>
                <a href="tel:0686437640" className="border border-neutral-700 hover:border-yellow-400 px-7 py-4 font-bold flex items-center gap-2 transition-colors">
                  <Phone className="w-4 h-4" /> URGENCE 24/7
                </a>
              </div>
            </div>

            {/* Trust strip */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-800 border border-neutral-800">
              {[
                { n: "12", l: "ANS D'EXPÉRIENCE" },
                { n: "1.4K", l: "INTERVENTIONS / AN" },
                { n: "4.9", l: "SUR GOOGLE (320 AVIS)" },
                { n: "2H", l: "DÉLAI MOYEN URGENCE" },
              ].map((s, i) => (
                <div key={i} className="bg-neutral-950 p-6">
                  <div className="display text-3xl text-yellow-400">{s.n}</div>
                  <div className="mono text-[10px] text-neutral-500 tracking-widest mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 1 — SERVICES */}
      {step === 1 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 slide-up">
          <div className="mb-8">
            <div className="mono text-xs text-yellow-400 tracking-widest mb-2">ÉTAPE 01 / 04</div>
            <h2 className="display text-4xl sm:text-5xl">CHOISISSEZ <span className="text-yellow-400">UNE PRESTATION</span></h2>
            <p className="text-neutral-400 mt-2">Tarifs forfaitaires, déplacement Bastia inclus. TVA 10 % comprise.</p>
          </div>

          {categories.map((cat) => (
            <div key={cat} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-yellow-400" />
                <h3 className="mono text-xs tracking-widest text-neutral-400">{cat.toUpperCase()}</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {services.filter((s) => s.category === cat).map((s) => {
                  const Icon = s.icon;
                  const active = selectedService?.id === s.id;
                  return (
                    <button key={s.id} onClick={() => setSelectedService(s)} className={`group text-left p-5 border-2 transition-all ${active ? "border-yellow-400 bg-yellow-400/5" : "border-neutral-800 hover:border-neutral-600 bg-neutral-900/50"}`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 flex items-center justify-center shrink-0 transition-colors ${active ? "bg-yellow-400 text-black" : "bg-neutral-800 text-yellow-400 group-hover:bg-neutral-700"}`}>
                          <Icon className="w-6 h-6" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-bold leading-tight">{s.name}</h4>
                            {s.tag && <span className={`mono text-[9px] px-1.5 py-0.5 tracking-wider shrink-0 ${s.tag === "URGENT" ? "bg-red-500 text-white" : "bg-yellow-400 text-black"}`}>{s.tag}</span>}
                          </div>
                          <p className="text-sm text-neutral-400 mb-3">{s.desc}</p>
                          <div className="flex items-center justify-between">
                            <span className="mono text-xs text-neutral-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {s.duration}</span>
                            <span className="display text-xl">
                              {s.from && <span className="text-xs text-neutral-500 mr-1">dès</span>}
                              {s.price}<span className="text-yellow-400">€</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-neutral-950/95 backdrop-blur border-t border-neutral-800 flex items-center justify-between gap-3">
            <button onClick={() => setStep(0)} className="text-sm text-neutral-400 hover:text-white flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Retour</button>
            <button disabled={!selectedService} onClick={() => setStep(2)} className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-neutral-800 disabled:text-neutral-600 text-black px-6 py-3 font-bold flex items-center gap-2 transition">
              CONTINUER <ChevronRight className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 — SLOT */}
      {step === 2 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 slide-up">
          <div className="mb-8">
            <div className="mono text-xs text-yellow-400 tracking-widest mb-2">ÉTAPE 02 / 04</div>
            <h2 className="display text-4xl sm:text-5xl">CHOISISSEZ <span className="text-yellow-400">UN CRÉNEAU</span></h2>
            <p className="text-neutral-400 mt-2">Créneaux disponibles dans les 14 prochains jours.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="mb-3 mono text-xs text-neutral-500 tracking-widest">JOUR</div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {days.map((d, i) => {
                  const active = selectedDate?.toDateString() === d.toDateString();
                  return (
                    <button key={i} onClick={() => { setSelectedDate(d); setSelectedTime(null); }} className={`p-3 border-2 text-center transition ${active ? "border-yellow-400 bg-yellow-400 text-black" : "border-neutral-800 hover:border-neutral-600 bg-neutral-900/50"}`}>
                      <div className={`mono text-[10px] tracking-wider ${active ? "text-black" : "text-neutral-500"}`}>{dayNames[d.getDay()].toUpperCase()}</div>
                      <div className="display text-2xl leading-none my-1">{d.getDate()}</div>
                      <div className={`mono text-[10px] ${active ? "text-black" : "text-neutral-500"}`}>{monthNames[d.getMonth()]}</div>
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <div className="mt-8">
                  <div className="mb-3 mono text-xs text-neutral-500 tracking-widest">HEURE — {selectedDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {timeSlots.map((t) => {
                      const dayIdx = days.indexOf(selectedDate);
                      const isUnavail = unavailable[dayIdx]?.includes(t);
                      const active = selectedTime === t;
                      return (
                        <button key={t} disabled={isUnavail} onClick={() => setSelectedTime(t)} className={`p-3 border-2 mono text-sm transition ${isUnavail ? "border-neutral-900 bg-neutral-900 text-neutral-700 line-through cursor-not-allowed" : active ? "border-yellow-400 bg-yellow-400 text-black" : "border-neutral-800 hover:border-neutral-600 bg-neutral-900/50"}`}>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-24 self-start border border-neutral-800 bg-neutral-900/50 p-5">
              <div className="mono text-xs text-neutral-500 tracking-widest mb-3">RÉCAPITULATIF</div>
              <div className="border-b border-neutral-800 pb-4 mb-4">
                <div className="text-xs text-neutral-500 mb-1">Prestation</div>
                <div className="font-bold">{selectedService?.name}</div>
                <div className="text-sm text-neutral-400">{selectedService?.duration}</div>
              </div>
              {selectedDate && selectedTime ? (
                <div className="border-b border-neutral-800 pb-4 mb-4">
                  <div className="text-xs text-neutral-500 mb-1">Rendez-vous</div>
                  <div className="font-bold capitalize">{selectedDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</div>
                  <div className="text-sm text-yellow-400 mono">{selectedTime}</div>
                </div>
              ) : (
                <div className="border-b border-neutral-800 pb-4 mb-4 text-sm text-neutral-600 italic">Sélectionnez une date et une heure</div>
              )}
              <div className="flex justify-between text-sm mb-1"><span className="text-neutral-400">Prix total</span><span className="font-bold">{totalPrice} €</span></div>
              <div className="flex justify-between text-sm mb-1"><span className="text-yellow-400">Acompte (30 %)</span><span className="font-bold text-yellow-400">{deposit} €</span></div>
              <div className="flex justify-between text-xs text-neutral-500"><span>Solde après intervention</span><span>{remaining} €</span></div>
            </div>
          </div>

          <div className="sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-neutral-950/95 backdrop-blur border-t border-neutral-800 flex items-center justify-between gap-3 mt-8">
            <button onClick={() => setStep(1)} className="text-sm text-neutral-400 hover:text-white flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Retour</button>
            <button disabled={!selectedDate || !selectedTime} onClick={() => setStep(3)} className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-neutral-800 disabled:text-neutral-600 text-black px-6 py-3 font-bold flex items-center gap-2 transition">
              CONTINUER <ChevronRight className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — INFO */}
      {step === 3 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 slide-up">
          <div className="mb-8">
            <div className="mono text-xs text-yellow-400 tracking-widest mb-2">ÉTAPE 03 / 04</div>
            <h2 className="display text-4xl sm:text-5xl">VOS <span className="text-yellow-400">COORDONNÉES</span></h2>
            <p className="text-neutral-400 mt-2">L'adresse précise nous aide à arriver pile à l'heure.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field icon={User} label="Prénom" value={customer.firstName} onChange={(v) => setCustomer({ ...customer, firstName: v })} placeholder="Jean" />
                <Field label="Nom" value={customer.lastName} onChange={(v) => setCustomer({ ...customer, lastName: v })} placeholder="Dupont" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field icon={Mail} label="Email" type="email" value={customer.email} onChange={(v) => setCustomer({ ...customer, email: v })} placeholder="jean@email.fr" />
                <Field icon={Phone} label="Téléphone" value={customer.phone} onChange={(v) => setCustomer({ ...customer, phone: v })} placeholder="06 12 34 56 78" />
              </div>
              <Field icon={MapPin} label="Adresse d'intervention" value={customer.address} onChange={(v) => setCustomer({ ...customer, address: v })} placeholder="12 rue du Général Graziani" />
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <Field label="Code postal" value={customer.zip} onChange={(v) => setCustomer({ ...customer, zip: v.replace(/\D/g, "").slice(0, 5) })} placeholder="20200" />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Ville" value={customer.city} onChange={(v) => setCustomer({ ...customer, city: v })} placeholder="Bastia" />
                </div>
              </div>
              <div>
                <label className="mono text-xs text-neutral-500 tracking-widest mb-2 block">PRÉCISIONS (optionnel)</label>
                <textarea value={customer.notes} onChange={(e) => setCustomer({ ...customer, notes: e.target.value })} rows={3} placeholder="Étage, code, accès, nature exacte du problème…" className="w-full bg-neutral-900 border-2 border-neutral-800 focus:border-yellow-400 outline-none p-3 text-sm transition resize-none" />
              </div>
            </div>

            <div className="lg:sticky lg:top-24 self-start border border-neutral-800 bg-neutral-900/50 p-5">
              <div className="mono text-xs text-neutral-500 tracking-widest mb-3">RÉCAPITULATIF</div>
              <SummaryRow label="Prestation" value={selectedService?.name} />
              <SummaryRow label="Date" value={selectedDate?.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} />
              <SummaryRow label="Heure" value={selectedTime} mono />
              <div className="border-t border-neutral-800 mt-3 pt-3">
                <div className="flex justify-between text-sm"><span className="text-neutral-400">Total</span><span className="font-bold">{totalPrice} €</span></div>
                <div className="flex justify-between text-sm"><span className="text-yellow-400">À payer maintenant</span><span className="font-bold text-yellow-400">{deposit} €</span></div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-neutral-950/95 backdrop-blur border-t border-neutral-800 flex items-center justify-between gap-3 mt-8">
            <button onClick={() => setStep(2)} className="text-sm text-neutral-400 hover:text-white flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Retour</button>
            <button disabled={!canContinueInfo} onClick={() => setStep(4)} className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-neutral-800 disabled:text-neutral-600 text-black px-6 py-3 font-bold flex items-center gap-2 transition">
              PAIEMENT <ChevronRight className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 — PAYMENT */}
      {step === 4 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 slide-up">
          <div className="mb-8">
            <div className="mono text-xs text-yellow-400 tracking-widest mb-2">ÉTAPE 04 / 04</div>
            <h2 className="display text-4xl sm:text-5xl">VERSER <span className="text-yellow-400">L'ACOMPTE</span></h2>
            <p className="text-neutral-400 mt-2">30 % à la réservation. Le solde se règle sur place après intervention.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Payment breakdown */}
              <div className="border-2 border-yellow-400/30 bg-yellow-400/5 p-5 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center shrink-0"><Lock className="w-5 h-5 text-black" strokeWidth={3} /></div>
                  <div className="flex-1">
                    <div className="font-bold mb-1">Paiement sécurisé en deux temps</div>
                    <div className="text-sm text-neutral-300">
                      Aujourd'hui : <span className="font-bold text-yellow-400">{deposit} €</span> d'acompte (30 %).
                      Après l'intervention : <span className="font-bold">{remaining} €</span> par CB, virement ou chèque.
                    </div>
                  </div>
                </div>
              </div>

              {/* Card */}
              <div className="border-2 border-neutral-800 bg-neutral-900/50 p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-yellow-400" /><span className="font-bold">Carte bancaire</span></div>
                  <div className="flex gap-2 mono text-[10px] text-neutral-500">VISA · MC · CB</div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mono text-xs text-neutral-500 tracking-widest mb-2 block">NUMÉRO DE CARTE</label>
                    <input value={card.number} onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })} placeholder="4242 4242 4242 4242" className="w-full bg-neutral-950 border-2 border-neutral-800 focus:border-yellow-400 outline-none p-3 mono transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mono text-xs text-neutral-500 tracking-widest mb-2 block">EXPIRATION</label>
                      <input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} placeholder="MM/AA" className="w-full bg-neutral-950 border-2 border-neutral-800 focus:border-yellow-400 outline-none p-3 mono transition" />
                    </div>
                    <div>
                      <label className="mono text-xs text-neutral-500 tracking-widest mb-2 block">CVC</label>
                      <input value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) })} placeholder="123" className="w-full bg-neutral-950 border-2 border-neutral-800 focus:border-yellow-400 outline-none p-3 mono transition" />
                    </div>
                  </div>
                  <div>
                    <label className="mono text-xs text-neutral-500 tracking-widest mb-2 block">TITULAIRE</label>
                    <input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })} placeholder="JEAN DUPONT" className="w-full bg-neutral-950 border-2 border-neutral-800 focus:border-yellow-400 outline-none p-3 mono transition" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5 text-xs text-neutral-500">
                  <Lock className="w-3 h-3" /> Données chiffrées · Conformité PCI-DSS · 3D Secure
                </div>
              </div>
            </div>

            {/* Final summary */}
            <div className="lg:sticky lg:top-24 self-start border border-neutral-800 bg-neutral-900/50 p-5">
              <div className="mono text-xs text-neutral-500 tracking-widest mb-3">VOTRE COMMANDE</div>
              <SummaryRow label="Prestation" value={selectedService?.name} />
              <SummaryRow label="Durée estimée" value={selectedService?.duration} />
              <SummaryRow label="Date" value={selectedDate?.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} />
              <SummaryRow label="Heure" value={selectedTime} mono />
              <SummaryRow label="Adresse" value={`${customer.zip} ${customer.city}`} />
              <div className="border-t border-neutral-800 mt-3 pt-3 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-neutral-400">Sous-total</span><span>{totalPrice} €</span></div>
                <div className="flex justify-between text-xs text-neutral-500"><span>Solde post-intervention</span><span>−{remaining} €</span></div>
                <div className="flex justify-between display text-xl pt-2 border-t border-neutral-800 mt-2"><span>À PAYER</span><span className="text-yellow-400">{deposit} €</span></div>
              </div>
              <button disabled={!canPay || processing} onClick={handlePay} className="w-full mt-5 bg-yellow-400 hover:bg-yellow-300 disabled:bg-neutral-800 disabled:text-neutral-600 text-black py-4 font-bold flex items-center justify-center gap-2 transition">
                {processing ? (
                  <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> TRAITEMENT…</>
                ) : (
                  <><Lock className="w-4 h-4" strokeWidth={3} /> PAYER {deposit} €</>
                )}
              </button>
              <p className="text-[11px] text-neutral-500 mt-3 text-center">En confirmant, vous acceptez les CGV et la politique d'annulation (gratuite jusqu'à 24h avant).</p>
            </div>
          </div>

          <div className="mt-6">
            <button onClick={() => setStep(3)} className="text-sm text-neutral-400 hover:text-white flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Modifier mes informations</button>
          </div>
        </div>
      )}

      {/* STEP 5 — DONE */}
      {step === 5 && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 slide-up text-center">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-30" />
            <div className="relative w-24 h-24 bg-yellow-400 mx-auto flex items-center justify-center rotate-3">
              <Check className="w-14 h-14 text-black" strokeWidth={3} />
            </div>
          </div>
          <div className="mono text-xs text-yellow-400 tracking-widest mb-3">RÉSERVATION CONFIRMÉE · #VLT-{Math.floor(Math.random() * 90000 + 10000)}</div>
          <h2 className="display text-4xl sm:text-6xl mb-4">C'EST <span className="text-yellow-400">DANS LA BOÎTE.</span></h2>
          <p className="text-neutral-400 max-w-lg mx-auto mb-10">
            Un email de confirmation est parti vers <span className="text-white font-semibold">{customer.email}</span>.
            On se voit le <span className="text-white font-semibold capitalize">{selectedDate?.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</span> à <span className="text-yellow-400 mono">{selectedTime}</span>.
          </p>

          <div className="border border-neutral-800 bg-neutral-900/50 p-6 text-left max-w-md mx-auto mb-8">
            <SummaryRow label="Prestation" value={selectedService?.name} />
            <SummaryRow label="Technicien" value="Marc V." />
            <SummaryRow label="Adresse" value={`${customer.address}, ${customer.zip} ${customer.city}`} />
            <div className="border-t border-neutral-800 mt-3 pt-3">
              <div className="flex justify-between text-sm"><span className="text-neutral-400">Acompte versé</span><span className="text-yellow-400 font-bold">{deposit} €</span></div>
              <div className="flex justify-between text-sm"><span className="text-neutral-400">Solde à régler après</span><span className="font-bold">{remaining} €</span></div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={reset} className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 font-bold">RETOUR À L'ACCUEIL</button>
            <a href="tel:0686437640" className="border border-neutral-700 hover:border-yellow-400 px-6 py-3 font-bold flex items-center gap-2"><Phone className="w-4 h-4" /> NOUS APPELER</a>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-neutral-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid sm:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="display text-lg mb-2">VOLTAIRE</div>
            <p className="text-neutral-500 text-xs">SARL Voltaire Électricité · SIRET 000 000 000 · Assurance décennale MAAF · Qualifelec RGE</p>
          </div>
          <div>
            <div className="mono text-xs text-neutral-500 tracking-widest mb-2">CONTACT</div>
            <p className="text-neutral-300">06 86 43 76 40</p>
            <p className="text-neutral-300">contact@voltaire-elec.fr</p>
            <p className="text-neutral-500 text-xs mt-1">Bastia · Haute-Corse (2B)</p>
          </div>
          <div>
            <div className="mono text-xs text-neutral-500 tracking-widest mb-2">URGENCES</div>
            <p className="text-neutral-300">7j/7 · 24h/24</p>
            <p className="text-neutral-500 text-xs">Intervention sous 2h sur Bastia et alentours</p>
          </div>
        </div>
        <div className="border-t border-neutral-800 py-4 text-center mono text-[10px] text-neutral-600 tracking-widest">© 2026 VOLTAIRE ÉLECTRICITÉ · TOUS DROITS RÉSERVÉS</div>
      </footer>
    </div>
  );
}

function Field({ icon: Icon, label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="mono text-xs text-neutral-500 tracking-widest mb-2 block">{label.toUpperCase()}</label>
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`w-full bg-neutral-900 border-2 border-neutral-800 focus:border-yellow-400 outline-none p-3 ${Icon ? "pl-10" : ""} text-sm transition`} />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, mono }) {
  return (
    <div className="flex justify-between text-sm py-1">
      <span className="text-neutral-500">{label}</span>
      <span className={`font-semibold ${mono ? "mono text-yellow-400" : ""}`}>{value || "—"}</span>
    </div>
  );
}
