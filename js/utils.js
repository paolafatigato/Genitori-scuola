// Piccole utilità condivise da tutte le pagine.

const MESI_IT = ["gennaio","febbraio","marzo","aprile","maggio","giugno",
  "luglio","agosto","settembre","ottobre","novembre","dicembre"];
const GIORNI_IT = ["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"];

// Restituisce la data locale di oggi come "AAAA-MM-GG" (usata come ID documento).
export function todayId(offsetDays = 0){
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

// "2026-07-16" -> "16 luglio"
export function formatDateBreve(dateId){
  const [y,m,d] = dateId.split("-").map(Number);
  return `${d} ${MESI_IT[m-1]}`;
}

// "2026-07-16" -> "giovedì 16 luglio 2026"
export function formatDateLunga(dateId){
  const [y,m,d] = dateId.split("-").map(Number);
  const dt = new Date(y, m-1, d);
  return `${GIORNI_IT[dt.getDay()]} ${d} ${MESI_IT[m-1]} ${y}`;
}

// Genera un elenco di N id data, dal più vecchio al più recente, terminando oggi.
export function ultimiNGiorni(n){
  const out = [];
  for(let i = n-1; i >= 0; i--) out.push(todayId(-i));
  return out;
}

// Codice di condivisione leggibile: 6 caratteri, senza caratteri ambigui (0/O, 1/I/L).
export function generaCodiceCondivisione(){
  const alfabeto = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for(let i=0;i<6;i++) code += alfabeto[Math.floor(Math.random()*alfabeto.length)];
  return code;
}

// Mostra un piccolo avviso in basso, si nasconde da solo.
let toastTimer = null;
export function showToast(msg){
  let el = document.getElementById("toast");
  if(!el){
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

export function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}
// Elenco centrale degli strumenti disponibili: aggiungere qui un domani per
// far comparire un nuovo strumento tra quelli attivabili dalle impostazioni.
// DOPO
export const STRUMENTI_DISPONIBILI = [
  { chiave: "zaino", nome: "Zaino", emoji: "🎒", href: "/famiglia/zaino.html" },
  { chiave: "attenzione", nome: "Attenzione", emoji: "🎯", href: "/famiglia/attenzione.html" },
  { chiave: "organizzazione", nome: "Organizzazione", emoji: "📋", href: "/famiglia/organizzazione.html" },
  { chiave: "emozioni", nome: "Emozioni", emoji: "🌡️", href: "/famiglia/emozioni.html" },
  { chiave: "sonno", nome: "Sonno", emoji: "🌙", href: "/famiglia/sonno.html" }
];

// Accetta sia il vecchio formato {zaino:true,...} sia il nuovo array ordinato
// e restituisce sempre un array di chiavi attive, nell'ordine scelto.
export function normalizzaStrumentiAttivi(raw){
  const chiaviValide = STRUMENTI_DISPONIBILI.map(s => s.chiave);
  if(Array.isArray(raw)){
    const filtrato = raw.filter(c => chiaviValide.includes(c));
    return filtrato.length ? filtrato : chiaviValide;
  }
  if(raw && typeof raw === "object"){
    const attivi = chiaviValide.filter(c => raw[c]);
    return attivi.length ? attivi : chiaviValide;
  }
  return chiaviValide;
}