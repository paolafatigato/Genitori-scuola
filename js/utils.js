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
