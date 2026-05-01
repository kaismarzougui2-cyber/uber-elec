import React, { useState, useMemo } from "react";
import {
  Zap, Wrench, Car, Home, ShieldCheck, Lightbulb,
  ChevronRight, ChevronLeft, Check, Clock, MapPin,
  Phone, Mail, User, CreditCard, Lock, AlertCircle,
  Sparkles, Star, Shield, Award, ArrowRight,
} from "lucide-react";

/* ─── helpers ─── */
const formatCard   = (v) => v.replace(/\D/g,"").slice(0,16).replace(/(\d{4})(?=\d)/g,"$1 ");
const formatExpiry = (v) => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>=3?`${d.slice(0,2)}/${d.slice(2)}`:d; };

/* ─── data ─── */
const SERVICES = [
  { id:"urgence",    icon:AlertCircle, name:"Dépannage urgent",             desc:"Intervention sous 2h, 7j/7",               price:149,  duration:"1-2h",      tag:"URGENT",  cat:"Urgence"    },
  { id:"diagnostic", icon:ShieldCheck, name:"Diagnostic électrique",         desc:"Audit complet de votre installation",       price:189,  duration:"1-2h",      cat:"Diagnostic" },
  { id:"norme",      icon:Wrench,      name:"Mise aux normes NF C 15-100",   desc:"Conformité tableau & circuits",             price:690,  duration:"1 jour",    cat:"Rénovation" },
  { id:"tableau",    icon:Zap,         name:"Remplacement tableau",           desc:"Tableau neuf, modulaire, certifié",         price:890,  duration:"1 jour",    cat:"Rénovation" },
  { id:"renovation", icon:Home,        name:"Rénovation complète",            desc:"Reprise totale T2 à T5+",                  price:2490, duration:"3-7 jours", cat:"Rénovation", from:true },
  { id:"borne",      icon:Car,         name:"Borne de recharge VE",           desc:"7,4 à 22 kW, prime ADVENIR incluse",       price:1290, duration:"½ journée", tag:"PRIME",   cat:"Mobilité"   },
  { id:"domotique",  icon:Sparkles,    name:"Domotique & maison connectée",   desc:"Éclairage, volets, scénarios smart",        price:990,  duration:"1-2 jours",cat:"Confort",  from:true },
  { id:"eclairage",  icon:Lightbulb,   name:"Éclairage LED & design",         desc:"Pose, variation, ambiances sur-mesure",     price:240,  duration:"2-4h",      cat:"Confort"    },
];
const CATS = ["Urgence","Diagnostic","Rénovation","Mobilité","Confort"];
const TIME_SLOTS   = ["08:00","09:30","11:00","13:30","15:00","16:30"];
const UNAVAILABLE  = {0:["09:30","13:30"],1:["11:00"],3:["08:00","15:00"],5:["16:30"],7:["09:30"],9:["13:30","15:00"]};
const DAY_NAMES    = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MONTH_NAMES  = ["jan","fév","mar","avr","mai","jun","jul","aoû","sep","oct","nov","déc"];
const STATS = [
  {n:"12",  l:"ANS D'EXPÉRIENCE"},
  {n:"1.4K",l:"INTERVENTIONS / AN"},
  {n:"4.9★",l:"AVIS GOOGLE (320)"},
  {n:"2H",  l:"DÉLAI URGENCE"},
];
const TRUST = [
  {icon:Shield, label:"Qualifelec RGE"},
  {icon:Award,  label:"Assurance décennale"},
  {icon:Star,   label:"4.9 / 5 (320 avis)"},
  {icon:Zap,    label:"Devis gratuit"},
];

/* ─── main component ─── */
export default function App() {
  const [step,setStep]               = useState(0);
  const [service,setService]         = useState(null);
  const [date,setDate]               = useState(null);
  const [time,setTime]               = useState(null);
  const [customer,setCustomer]       = useState({firstName:"",lastName:"",email:"",phone:"",address:"",city:"",zip:"",notes:""});
  const [card,setCard]               = useState({number:"",expiry:"",cvc:"",name:""});
  const [processing,setProcessing]   = useState(false);

  const days = useMemo(()=>{
    const out=[]; const now=new Date(2026,4,1);
    for(let i=1;i<=14;i++){const d=new Date(now);d.setDate(d.getDate()+i);out.push(d);}
    return out;
  },[]);

  const total   = service?.price || 0;
  const deposit = Math.round(total * 0.3);
  const rest    = total - deposit;

  const canPay  = card.number.replace(/\s/g,"").length===16 && card.expiry.length===5 && card.cvc.length===3 && card.name.trim().length>2;
  const canInfo = customer.firstName && customer.lastName && customer.email.includes("@") && customer.phone.length>=8 && customer.address && customer.city && customer.zip;

  const pay = () => { setProcessing(true); setTimeout(()=>{setProcessing(false);setStep(5);},1800); };

  const reset = () => {
    setStep(0);setService(null);setDate(null);setTime(null);
    setCustomer({firstName:"",lastName:"",email:"",phone:"",address:"",city:"",zip:"",notes:""});
    setCard({number:"",expiry:"",cvc:"",name:""});
  };

  return (
    <div className="min-h-screen bg-volt-bg text-neutral-100 font-sans">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-volt-border bg-volt-bg/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <button onClick={reset} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-volt-yellow flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all duration-300 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
              <Zap size={20} className="text-black" strokeWidth={3} fill="black" />
            </div>
            <div className="text-left">
              <div className="font-display text-lg leading-none tracking-tight">VOLTAIRE</div>
              <div className="font-mono text-[10px] text-volt-yellow tracking-[0.15em] leading-none mt-0.5">ÉLECTRICITÉ · BASTIA</div>
            </div>
          </button>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-1.5 text-sm text-volt-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Disponible maintenant
            </div>
            <a href="tel:0686437640"
               className="flex items-center gap-2 bg-volt-yellow hover:bg-volt-hover text-black font-bold px-4 py-2.5 text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]">
              <Phone size={15} strokeWidth={2.5} />
              <span className="hidden sm:inline">06 86 43 76 40</span>
              <span className="sm:hidden">Appeler</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ── STEP INDICATOR ── */}
      {step > 0 && step < 5 && (
        <div className="border-b border-volt-border bg-volt-bg/90">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {["Prestation","Créneau","Infos","Paiement"].map((label,i)=>{
                const idx=i+1; const active=step===idx; const done=step>idx;
                return (
                  <React.Fragment key={i}>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className={`w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0 transition-all
                        ${done  ? "bg-volt-yellow text-black"
                        : active? "bg-volt-yellow text-black animate-pulse-glow"
                        :         "bg-volt-border text-volt-dim"}`}>
                        {done ? <Check size={14} strokeWidth={3}/> : idx}
                      </div>
                      <span className={`text-xs sm:text-sm font-semibold hidden sm:inline transition-colors
                        ${active?"text-volt-yellow":done?"text-neutral-300":"text-volt-dim"}`}>{label}</span>
                    </div>
                    {i<3 && <div className={`flex-1 h-px transition-colors ${done?"bg-volt-yellow":"bg-volt-border"}`}/>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ════════════ STEP 0 — HERO ════════════ */}
      {step===0 && (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 grid-bg pointer-events-none"/>
          <div className="absolute inset-0 bolt-halo pointer-events-none"/>

          {/* Hero section */}
          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-28 animate-slide-up">
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-volt-yellow animate-pulse"/>
              <span className="font-mono text-[11px] text-volt-yellow tracking-[0.15em] uppercase">
                Disponible aujourd'hui · Bastia & Haute-Corse
              </span>
            </div>

            <div className="max-w-4xl">
              <h1 className="font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.88] mb-8">
                ON BRANCHE.<br/>
                <span className="text-volt-yellow [text-shadow:0_0_40px_rgba(250,204,21,0.3)]">ON RÉPARE.</span><br/>
                <span className="text-volt-dim">ON SÉCURISE.</span>
              </h1>
              <p className="text-lg text-volt-muted max-w-xl leading-relaxed mb-10">
                Votre électricien à Bastia. Tarif fixe garanti, créneau confirmé en 2 minutes.
                30 % d'acompte à la réservation — le solde après le travail bien fait.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={()=>setStep(1)}
                  className="group bg-volt-yellow hover:bg-volt-hover text-black px-8 py-4 font-bold text-sm tracking-wide flex items-center gap-2 transition-all hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] hover:translate-x-0.5">
                  RÉSERVER UNE INTERVENTION
                  <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform"/>
                </button>
                <a href="tel:0686437640"
                  className="border border-neutral-700 hover:border-volt-yellow px-8 py-4 font-bold text-sm tracking-wide flex items-center gap-2 transition-all">
                  <Phone size={16}/> URGENCE 24/7
                </a>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-14 flex flex-wrap gap-3">
              {TRUST.map(({icon:Icon,label},i)=>(
                <div key={i} className="flex items-center gap-2 bg-volt-soft border border-volt-border px-4 py-2.5 text-sm">
                  <Icon size={14} className="text-volt-yellow shrink-0"/>
                  <span className="text-volt-muted">{label}</span>
                </div>
              ))}
            </div>

            {/* Stats strip */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-volt-border border border-volt-border">
              {STATS.map((s,i)=>(
                <div key={i} className="bg-volt-bg p-6 group hover:bg-volt-soft transition-colors">
                  <div className="font-display text-4xl text-volt-yellow mb-1 group-hover:[text-shadow:0_0_20px_rgba(250,204,21,0.5)] transition-all">{s.n}</div>
                  <div className="font-mono text-[10px] text-volt-dim tracking-[0.12em] uppercase">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Services preview */}
          <div className="relative bg-volt-soft border-t border-volt-border">
            <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <div className="font-mono text-[11px] text-volt-yellow tracking-[0.15em] mb-3">NOS PRESTATIONS</div>
                  <h2 className="font-display text-3xl sm:text-4xl">TOUT CE QU'IL<br/><span className="text-volt-yellow">VOUS FAUT</span></h2>
                </div>
                <button onClick={()=>setStep(1)} className="hidden sm:flex items-center gap-2 text-volt-yellow font-semibold text-sm hover:gap-3 transition-all">
                  Voir tout <ArrowRight size={16}/>
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SERVICES.slice(0,4).map(s=>{
                  const Icon=s.icon;
                  return(
                    <button key={s.id} onClick={()=>{setService(s);setStep(2);}}
                      className="text-left p-5 bg-volt-bg border border-volt-border hover:border-volt-yellow hover:bg-volt-yellow/5 transition-all group">
                      <div className="w-11 h-11 bg-volt-border group-hover:bg-volt-yellow flex items-center justify-center mb-4 transition-colors">
                        <Icon size={22} className="text-volt-yellow group-hover:text-black transition-colors" strokeWidth={2}/>
                      </div>
                      <div className="font-semibold text-sm mb-1">{s.name}</div>
                      <div className="text-volt-dim text-xs mb-3">{s.desc}</div>
                      <div className="font-display text-2xl">
                        {s.from&&<span className="text-xs text-volt-dim mr-1">dès</span>}
                        {s.price}<span className="text-volt-yellow">€</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ STEP 1 — SERVICES ════════════ */}
      {step===1 && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 animate-slide-up">
          <div className="mb-10">
            <div className="font-mono text-[11px] text-volt-yellow tracking-[0.15em] mb-3">ÉTAPE 01 / 04</div>
            <h2 className="font-display text-4xl sm:text-5xl mb-2">
              CHOISISSEZ <span className="text-volt-yellow">UNE PRESTATION</span>
            </h2>
            <p className="text-volt-muted">Tarifs forfaitaires TTC, déplacement Bastia inclus.</p>
          </div>

          {CATS.map(cat=>{
            const list=SERVICES.filter(s=>s.cat===cat);
            if(!list.length) return null;
            return(
              <div key={cat} className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-6 bg-volt-yellow rounded-full"/>
                  <span className="font-mono text-[11px] text-volt-dim tracking-[0.12em]">{cat.toUpperCase()}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {list.map(s=>{
                    const Icon=s.icon; const active=service?.id===s.id;
                    return(
                      <button key={s.id} onClick={()=>setService(s)}
                        className={`text-left p-5 border-2 transition-all group
                          ${active?"border-volt-yellow bg-volt-yellow/5 shadow-[0_0_20px_rgba(250,204,21,0.1)]"
                                  :"border-volt-border hover:border-neutral-600 bg-volt-soft/50"}`}>
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 flex items-center justify-center shrink-0 transition-all
                            ${active?"bg-volt-yellow text-black shadow-[0_0_15px_rgba(250,204,21,0.4)]"
                                    :"bg-volt-border text-volt-yellow group-hover:bg-neutral-700"}`}>
                            <Icon size={22} strokeWidth={2.5}/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <h4 className="font-bold text-sm leading-tight">{s.name}</h4>
                              {s.tag&&(
                                <span className={`font-mono text-[9px] px-1.5 py-0.5 tracking-wide shrink-0 font-bold
                                  ${s.tag==="URGENT"?"bg-volt-red text-white":"bg-volt-yellow text-black"}`}>
                                  {s.tag}
                                </span>
                              )}
                            </div>
                            <p className="text-volt-muted text-xs mb-4">{s.desc}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] text-volt-dim flex items-center gap-1.5">
                                <Clock size={11}/>{s.duration}
                              </span>
                              <span className="font-display text-2xl">
                                {s.from&&<span className="text-volt-dim text-xs mr-1">dès</span>}
                                {s.price}<span className="text-volt-yellow">€</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        {active&&(
                          <div className="mt-4 pt-4 border-t border-volt-yellow/30 flex items-center gap-2 text-volt-yellow text-xs font-semibold">
                            <Check size={13} strokeWidth={3}/> Sélectionné
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="sticky bottom-0 -mx-5 sm:-mx-8 px-5 sm:px-8 py-4 bg-volt-bg/95 backdrop-blur-md border-t border-volt-border flex items-center justify-between">
            <button onClick={()=>setStep(0)} className="flex items-center gap-1.5 text-volt-muted hover:text-white text-sm font-medium transition-colors">
              <ChevronLeft size={16}/> Retour
            </button>
            {service&&(
              <span className="text-volt-muted text-sm hidden sm:block">
                <span className="text-white font-semibold">{service.name}</span> — <span className="text-volt-yellow font-bold font-display">{service.price}€</span>
              </span>
            )}
            <button disabled={!service} onClick={()=>setStep(2)}
              className="bg-volt-yellow hover:bg-volt-hover disabled:bg-volt-border disabled:text-volt-dim text-black px-6 py-3 font-bold text-sm flex items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(250,204,21,0.35)]">
              CONTINUER <ChevronRight size={16} strokeWidth={3}/>
            </button>
          </div>
        </div>
      )}

      {/* ════════════ STEP 2 — CRÉNEAU ════════════ */}
      {step===2 && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 animate-slide-up">
          <div className="mb-10">
            <div className="font-mono text-[11px] text-volt-yellow tracking-[0.15em] mb-3">ÉTAPE 02 / 04</div>
            <h2 className="font-display text-4xl sm:text-5xl mb-2">
              CHOISISSEZ <span className="text-volt-yellow">UN CRÉNEAU</span>
            </h2>
            <p className="text-volt-muted">Disponibilités en temps réel · 14 prochains jours</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-6">
            <div>
              <div className="font-mono text-[10px] text-volt-dim tracking-[0.12em] mb-3">CHOISISSEZ UN JOUR</div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {days.map((d,i)=>{
                  const active=date?.toDateString()===d.toDateString();
                  return(
                    <button key={i} onClick={()=>{setDate(d);setTime(null);}}
                      className={`p-2.5 text-center border-2 transition-all
                        ${active?"border-volt-yellow bg-volt-yellow text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                                :"border-volt-border hover:border-neutral-600 bg-volt-soft/50"}`}>
                      <div className={`font-mono text-[9px] tracking-wide ${active?"text-black":"text-volt-dim"}`}>
                        {DAY_NAMES[d.getDay()].toUpperCase()}
                      </div>
                      <div className="font-display text-2xl leading-none my-1">{d.getDate()}</div>
                      <div className={`font-mono text-[9px] ${active?"text-black":"text-volt-dim"}`}>
                        {MONTH_NAMES[d.getMonth()]}
                      </div>
                    </button>
                  );
                })}
              </div>

              {date&&(
                <div className="mt-8">
                  <div className="font-mono text-[10px] text-volt-dim tracking-[0.12em] mb-3 capitalize">
                    HORAIRES — {date.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {TIME_SLOTS.map(t=>{
                      const dayIdx=days.indexOf(date);
                      const unavail=UNAVAILABLE[dayIdx]?.includes(t);
                      const active=time===t;
                      return(
                        <button key={t} disabled={unavail} onClick={()=>setTime(t)}
                          className={`p-3 font-mono text-sm border-2 transition-all
                            ${unavail?"border-volt-bg bg-volt-bg text-volt-dim line-through cursor-not-allowed"
                            :active?"border-volt-yellow bg-volt-yellow text-black shadow-[0_0_12px_rgba(250,204,21,0.3)]"
                                    :"border-volt-border hover:border-neutral-600 bg-volt-soft/50"}`}>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Summary sidebar */}
            <SummarySidebar service={service} date={date} time={time} total={total} deposit={deposit} rest={rest}/>
          </div>

          <NavBar
            onBack={()=>setStep(1)} onNext={()=>setStep(3)}
            disabled={!date||!time}
            label="CONTINUER"
          />
        </div>
      )}

      {/* ════════════ STEP 3 — INFOS ════════════ */}
      {step===3 && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 animate-slide-up">
          <div className="mb-10">
            <div className="font-mono text-[11px] text-volt-yellow tracking-[0.15em] mb-3">ÉTAPE 03 / 04</div>
            <h2 className="font-display text-4xl sm:text-5xl mb-2">
              VOS <span className="text-volt-yellow">COORDONNÉES</span>
            </h2>
            <p className="text-volt-muted">L'adresse précise nous aide à arriver pile à l'heure.</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-6">
            <div className="flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <FInput icon={User}  label="Prénom"     value={customer.firstName} onChange={v=>setCustomer({...customer,firstName:v})} placeholder="Jean"/>
                <FInput              label="Nom"        value={customer.lastName}  onChange={v=>setCustomer({...customer,lastName:v})}  placeholder="Dupont"/>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <FInput icon={Mail}  label="Email"      type="email" value={customer.email} onChange={v=>setCustomer({...customer,email:v})} placeholder="jean@email.fr"/>
                <FInput icon={Phone} label="Téléphone"  value={customer.phone} onChange={v=>setCustomer({...customer,phone:v})} placeholder="06 12 34 56 78"/>
              </div>
              <FInput icon={MapPin} label="Adresse d'intervention" value={customer.address} onChange={v=>setCustomer({...customer,address:v})} placeholder="12 rue du Général Graziani"/>
              <div className="grid grid-cols-[130px_1fr] gap-4">
                <FInput label="Code postal" value={customer.zip}  onChange={v=>setCustomer({...customer,zip:v.replace(/\D/g,"").slice(0,5)})} placeholder="20200"/>
                <FInput label="Ville"       value={customer.city} onChange={v=>setCustomer({...customer,city:v})} placeholder="Bastia"/>
              </div>
              <div>
                <label className="block font-mono text-[10px] text-volt-dim tracking-[0.12em] uppercase mb-2">PRÉCISIONS (optionnel)</label>
                <textarea value={customer.notes} onChange={e=>setCustomer({...customer,notes:e.target.value})}
                  rows={3} placeholder="Étage, code, accès, nature exacte du problème…"
                  className="w-full bg-volt-soft border-2 border-volt-border focus:border-volt-yellow outline-none p-3 text-sm transition-colors resize-none text-neutral-100 placeholder:text-volt-dim"/>
              </div>
            </div>

            <SummarySidebar service={service} date={date} time={time} total={total} deposit={deposit} rest={rest}/>
          </div>

          <NavBar onBack={()=>setStep(2)} onNext={()=>setStep(4)} disabled={!canInfo} label="PAIEMENT"/>
        </div>
      )}

      {/* ════════════ STEP 4 — PAIEMENT ════════════ */}
      {step===4 && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 animate-slide-up">
          <div className="mb-10">
            <div className="font-mono text-[11px] text-volt-yellow tracking-[0.15em] mb-3">ÉTAPE 04 / 04</div>
            <h2 className="font-display text-4xl sm:text-5xl mb-2">
              VERSER <span className="text-volt-yellow">L'ACOMPTE</span>
            </h2>
            <p className="text-volt-muted">30 % maintenant · solde après l'intervention sur place.</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-6">
            <div className="flex flex-col gap-4">
              {/* Notice */}
              <div className="bg-volt-yellow/5 border-2 border-volt-yellow/30 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-volt-yellow flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                    <Lock size={18} className="text-black" strokeWidth={3}/>
                  </div>
                  <div>
                    <p className="font-bold mb-1 text-sm">Paiement sécurisé en deux temps</p>
                    <p className="text-volt-muted text-sm leading-relaxed">
                      Aujourd'hui : <span className="text-volt-yellow font-bold">{deposit} €</span> d'acompte.
                      Après l'intervention : <span className="text-white font-bold">{rest} €</span> par CB, virement ou chèque.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card form */}
              <div className="bg-volt-soft border-2 border-volt-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 font-bold">
                    <CreditCard size={18} className="text-volt-yellow"/> Carte bancaire
                  </div>
                  <span className="font-mono text-[10px] text-volt-dim tracking-wide">VISA · MC · CB · AMEX</span>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-volt-dim tracking-[0.12em] uppercase mb-2">NUMÉRO DE CARTE</label>
                    <input value={card.number} onChange={e=>setCard({...card,number:formatCard(e.target.value)})}
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-volt-bg border-2 border-volt-border focus:border-volt-yellow outline-none p-3 font-mono text-sm transition-colors text-neutral-100 placeholder:text-volt-dim"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] text-volt-dim tracking-[0.12em] uppercase mb-2">EXPIRATION</label>
                      <input value={card.expiry} onChange={e=>setCard({...card,expiry:formatExpiry(e.target.value)})}
                        placeholder="MM/AA"
                        className="w-full bg-volt-bg border-2 border-volt-border focus:border-volt-yellow outline-none p-3 font-mono text-sm transition-colors text-neutral-100 placeholder:text-volt-dim"/>
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-volt-dim tracking-[0.12em] uppercase mb-2">CVC</label>
                      <input value={card.cvc} onChange={e=>setCard({...card,cvc:e.target.value.replace(/\D/g,"").slice(0,3)})}
                        placeholder="123"
                        className="w-full bg-volt-bg border-2 border-volt-border focus:border-volt-yellow outline-none p-3 font-mono text-sm transition-colors text-neutral-100 placeholder:text-volt-dim"/>
                    </div>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-volt-dim tracking-[0.12em] uppercase mb-2">TITULAIRE</label>
                    <input value={card.name} onChange={e=>setCard({...card,name:e.target.value.toUpperCase()})}
                      placeholder="JEAN DUPONT"
                      className="w-full bg-volt-bg border-2 border-volt-border focus:border-volt-yellow outline-none p-3 font-mono text-sm transition-colors text-neutral-100 placeholder:text-volt-dim"/>
                  </div>
                </div>
                <p className="flex items-center gap-1.5 mt-5 text-volt-dim text-xs">
                  <Lock size={11}/> Données chiffrées · Conformité PCI-DSS · 3D Secure
                </p>
              </div>
            </div>

            {/* Final summary */}
            <div className="bg-volt-soft border border-volt-border p-5 self-start lg:sticky lg:top-24">
              <p className="font-mono text-[10px] text-volt-dim tracking-[0.12em] mb-4">VOTRE COMMANDE</p>
              <SRow label="Prestation"    value={service?.name}/>
              <SRow label="Durée"         value={service?.duration}/>
              <SRow label="Date"          value={date?.toLocaleDateString("fr-FR",{day:"numeric",month:"long"})}/>
              <SRow label="Heure"         value={time} mono/>
              <SRow label="Adresse"       value={`${customer.zip} ${customer.city}`}/>
              <div className="h-px bg-volt-border my-4"/>
              <div className="flex justify-between text-sm mb-1.5"><span className="text-volt-muted">Sous-total</span><span className="font-semibold">{total} €</span></div>
              <div className="flex justify-between text-xs text-volt-dim mb-3"><span>Solde après intervention</span><span>−{rest} €</span></div>
              <div className="flex justify-between items-center mb-5">
                <span className="font-display text-lg">À PAYER</span>
                <span className="font-display text-2xl text-volt-yellow">{deposit} €</span>
              </div>
              <button disabled={!canPay||processing} onClick={pay}
                className="w-full bg-volt-yellow hover:bg-volt-hover disabled:bg-volt-border disabled:text-volt-dim text-black py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_25px_rgba(250,204,21,0.4)]">
                {processing
                  ?<><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"/> TRAITEMENT…</>
                  :<><Lock size={15} strokeWidth={3}/> PAYER {deposit} €</>
                }
              </button>
              <p className="text-volt-dim text-[11px] mt-3 text-center leading-relaxed">
                En confirmant vous acceptez les CGV et la politique d'annulation (gratuite jusqu'à 24h avant).
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button onClick={()=>setStep(3)} className="flex items-center gap-1.5 text-volt-muted hover:text-white text-sm font-medium transition-colors">
              <ChevronLeft size={16}/> Modifier mes informations
            </button>
          </div>
        </div>
      )}

      {/* ════════════ STEP 5 — CONFIRMATION ════════════ */}
      {step===5 && (
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-20 text-center animate-slide-up">
          <div className="relative inline-block mb-10">
            <div className="absolute inset-0 bg-volt-yellow blur-3xl opacity-25 scale-150"/>
            <div className="relative w-28 h-28 bg-volt-yellow mx-auto flex items-center justify-center rotate-3 shadow-[0_0_50px_rgba(250,204,21,0.5)]">
              <Check size={60} className="text-black" strokeWidth={3}/>
            </div>
          </div>

          <div className="font-mono text-[11px] text-volt-yellow tracking-[0.15em] mb-4">
            RÉSERVATION CONFIRMÉE · #VLT-{Math.floor(Math.random()*90000+10000)}
          </div>
          <h2 className="font-display text-5xl sm:text-7xl mb-6">
            C'EST <span className="text-volt-yellow [text-shadow:0_0_40px_rgba(250,204,21,0.4)]">DANS LA BOÎTE.</span>
          </h2>
          <p className="text-volt-muted leading-relaxed mb-10">
            Un email a été envoyé à <span className="text-white font-semibold">{customer.email}</span>.<br/>
            Rendez-vous le <span className="text-white font-semibold capitalize">
              {date?.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}
            </span> à <span className="font-mono text-volt-yellow">{time}</span>.
          </p>

          <div className="bg-volt-soft border border-volt-border p-6 text-left mb-10">
            <SRow label="Prestation"  value={service?.name}/>
            <SRow label="Technicien" value="Marc V."/>
            <SRow label="Adresse"    value={`${customer.address}, ${customer.zip} ${customer.city}`}/>
            <div className="h-px bg-volt-border my-4"/>
            <div className="flex justify-between text-sm"><span className="text-volt-muted">Acompte versé</span><span className="text-volt-yellow font-bold">{deposit} €</span></div>
            <div className="flex justify-between text-sm mt-1"><span className="text-volt-muted">Solde à régler</span><span className="font-bold">{rest} €</span></div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={reset} className="bg-volt-yellow hover:bg-volt-hover text-black px-7 py-3.5 font-bold text-sm transition-all">
              RETOUR À L'ACCUEIL
            </button>
            <a href="tel:0686437640" className="border border-neutral-700 hover:border-volt-yellow px-7 py-3.5 font-bold text-sm flex items-center gap-2 transition-colors">
              <Phone size={15}/> NOUS APPELER
            </a>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      {step===0 && (
        <footer className="border-t border-volt-border mt-0">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 grid sm:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="font-display text-xl mb-3">VOLTAIRE</div>
              <p className="text-volt-dim text-xs leading-relaxed">
                SARL Voltaire Électricité · SIRET 000 000 000<br/>
                Assurance décennale MAAF · Qualifelec RGE
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-volt-dim tracking-[0.12em] uppercase mb-3">Contact</p>
              <a href="tel:0686437640" className="block text-volt-muted hover:text-volt-yellow transition-colors mb-1">06 86 43 76 40</a>
              <p className="text-volt-muted mb-1">contact@voltaire-elec.fr</p>
              <p className="text-volt-dim text-xs">Bastia · Haute-Corse (2B)</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-volt-dim tracking-[0.12em] uppercase mb-3">Urgences</p>
              <p className="text-volt-muted mb-1">7j/7 · 24h/24</p>
              <p className="text-volt-dim text-xs">Intervention sous 2h sur Bastia et alentours</p>
            </div>
          </div>
          <div className="border-t border-volt-border py-5 text-center">
            <span className="font-mono text-[10px] text-volt-dim tracking-[0.12em]">
              © 2026 VOLTAIRE ÉLECTRICITÉ · TOUS DROITS RÉSERVÉS
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}

/* ─── sub-components ─── */

function SummarySidebar({service,date,time,total,deposit,rest}){
  return(
    <div className="bg-volt-soft border border-volt-border p-5 self-start lg:sticky lg:top-24">
      <p className="font-mono text-[10px] text-volt-dim tracking-[0.12em] mb-4">RÉCAPITULATIF</p>
      {service&&(
        <div className="border-b border-volt-border pb-4 mb-4">
          <p className="text-[11px] text-volt-dim mb-0.5">Prestation</p>
          <p className="font-bold text-sm">{service.name}</p>
          <p className="text-volt-muted text-xs">{service.duration}</p>
        </div>
      )}
      {date&&time?(
        <div className="border-b border-volt-border pb-4 mb-4">
          <p className="text-[11px] text-volt-dim mb-0.5">Rendez-vous</p>
          <p className="font-bold text-sm capitalize">{date.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</p>
          <p className="font-mono text-volt-yellow text-sm">{time}</p>
        </div>
      ):(
        <p className="text-volt-dim text-xs italic border-b border-volt-border pb-4 mb-4">Sélectionnez une date et une heure</p>
      )}
      <div className="flex justify-between text-sm mb-1.5"><span className="text-volt-muted">Total</span><span className="font-bold">{total} €</span></div>
      <div className="flex justify-between text-sm mb-1 text-volt-yellow font-bold"><span>Acompte (30 %)</span><span>{deposit} €</span></div>
      <div className="flex justify-between text-xs text-volt-dim"><span>Solde après</span><span>{rest} €</span></div>
    </div>
  );
}

function NavBar({onBack,onNext,disabled,label}){
  return(
    <div className="sticky bottom-0 -mx-5 sm:-mx-8 px-5 sm:px-8 py-4 mt-8 bg-volt-bg/95 backdrop-blur-md border-t border-volt-border flex items-center justify-between">
      <button onClick={onBack} className="flex items-center gap-1.5 text-volt-muted hover:text-white text-sm font-medium transition-colors">
        <ChevronLeft size={16}/> Retour
      </button>
      <button disabled={disabled} onClick={onNext}
        className="bg-volt-yellow hover:bg-volt-hover disabled:bg-volt-border disabled:text-volt-dim text-black px-6 py-3 font-bold text-sm flex items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(250,204,21,0.35)]">
        {label} <ChevronRight size={16} strokeWidth={3}/>
      </button>
    </div>
  );
}

function FInput({icon:Icon,label,value,onChange,placeholder,type="text"}){
  return(
    <div>
      <label className="block font-mono text-[10px] text-volt-dim tracking-[0.12em] uppercase mb-2">{label}</label>
      <div className="relative">
        {Icon&&(
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-volt-dim pointer-events-none flex">
            <Icon size={15}/>
          </div>
        )}
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          className={`w-full bg-volt-soft border-2 border-volt-border focus:border-volt-yellow outline-none p-3 ${Icon?"pl-10":""} text-sm transition-colors text-neutral-100 placeholder:text-volt-dim`}/>
      </div>
    </div>
  );
}

function SRow({label,value,mono}){
  return(
    <div className="flex justify-between text-sm py-1.5 border-b border-volt-border/50 last:border-0">
      <span className="text-volt-dim">{label}</span>
      <span className={`font-semibold text-right max-w-[55%] ${mono?"font-mono text-volt-yellow":""}`}>{value||"—"}</span>
    </div>
  );
}
