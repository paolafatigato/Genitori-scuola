import {
  auth, db, googleProvider,
  signInWithPopup, signOut, onAuthStateChanged,
  doc, getDoc, setDoc, serverTimestamp
} from "./firebase-init.js";
import { generaCodiceCondivisione } from "./utils.js";
export const GIORNI_SETTIMANA = ["lunedi","martedi","mercoledi","giovedi","venerdi","sabato","domenica"];
export const VOCI_ZAINO_DEFAULT = [
  "Libri e quaderni del giorno dopo",
  "Diario firmato",
  "Astuccio completo",
  "Compiti svolti",
  "Materiale per attività extra"
];

export function accediConGoogle(){
  return signInWithPopup(auth, googleProvider);
}

export function esci(){
  return signOut(auth);
}

// Legge utenti/{uid}. Restituisce null se l'utente non ha ancora scelto un ruolo.
export async function leggiUtente(uid){
  const snap = await getDoc(doc(db, "utenti", uid));
  return snap.exists() ? snap.data() : null;
}

// Crea utenti/{uid} e, se famiglia, anche famiglie/{uid} con i valori di default.
export async function creaProfilo(user, ruolo){
  await setDoc(doc(db, "utenti", user.uid), {
    ruolo,
    nome: user.displayName || "",
    email: user.email || "",
    creato_il: serverTimestamp()
  });

  if(ruolo === "famiglia"){
  const codice = generaCodiceCondivisione();

  // Un modello di checklist per ciascun giorno della settimana. Parto con
  // le stesse voci generiche per tutti i giorni: si personalizzano poi
  // giorno per giorno direttamente dalla pagina Zaino.
  const modelloBase = {};
  GIORNI_SETTIMANA.forEach(g => modelloBase[g] = [...VOCI_ZAINO_DEFAULT]);

  await setDoc(doc(db, "famiglie", user.uid), {
    nome_alunno: "",
    codice_condivisione: codice,
    strumenti_attivi: { zaino: true, emozioni: true, sonno: true },
    checklist_zaino_settimanale: modelloBase,
    creato_il: serverTimestamp()
  });
  await setDoc(doc(db, "codici_condivisione", codice), {
    uid_famiglia: user.uid
  });
}
}

// Da usare in cima a ogni pagina protetta.
// ruoloRichiesto: "famiglia" | "docente" | null (qualsiasi ruolo va bene)
// onReady(user, utente) viene chiamato solo quando tutto è verificato.
export function proteggiPagina(ruoloRichiesto, onReady){
  onAuthStateChanged(auth, async (user) => {
    if(!user){
      window.location.href = "../index.html";
      return;
    }
    const utente = await leggiUtente(user.uid);
    if(!utente){
      // Ha fatto login ma non ha ancora scelto un ruolo.
      window.location.href = "../index.html";
      return;
    }
    if(ruoloRichiesto && utente.ruolo !== ruoloRichiesto){
      window.location.href = utente.ruolo === "famiglia" ? "../famiglia/dashboard.html" : "../docente/dashboard.html";
      return;
    }
    onReady(user, utente);
  });
}
