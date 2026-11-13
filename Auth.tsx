'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import type {User} from '@supabase/supabase-js';
import {supabase} from '../lib/supabase';
type Role='admin'|'teacher'|'student'|'pending_teacher'|'rejected_teacher';
type Auth={user:User|null;role:Role|null;loading:boolean;refresh:()=>Promise<void>};
const C=createContext<Auth>({user:null,role:null,loading:true,refresh:async()=>{}});
export const useAuth=()=>useContext(C);
export function AuthProvider({children}:{children:React.ReactNode}){
 const [user,setUser]=useState<User|null>(null);const [role,setRole]=useState<Role|null>(null);const [loading,setLoading]=useState(true);
 async function load(){const db=supabase();if(!db){setLoading(false);return}try{const {data:{user:u}}=await db.auth.getUser();setUser(u);if(u){const {data}=await db.from('profiles').select('role').eq('id',u.id).maybeSingle();setRole(['admin','teacher','pending_teacher','rejected_teacher'].includes(data?.role ?? '')?(data?.role as Role):'student')}else setRole(null)}catch{setUser(null);setRole(null)}finally{setLoading(false)}}
 useEffect(()=>{void load();const db=supabase();const {data}=db?.auth.onAuthStateChange(()=>{setTimeout(()=>{void load()},0)})||{};return()=>data?.subscription.unsubscribe()},[]);
 return <C.Provider value={{user,role,loading,refresh:load}}>{children}</C.Provider>
}
export function AuthGate({children}:{children:React.ReactNode}){
 const {user,loading}=useAuth();
 const [email,setEmail]=useState('');
 const [loginAs,setLoginAs]=useState<'student'|'teacher'>('student');
 const [message,setMessage]=useState('');
 const [busy,setBusy]=useState(false);
 const db=supabase();
 if(!db)return <div className="auth-wrap"><section className="auth-card"><h1>Configuratie ontbreekt</h1><p>Controleer de Supabase-omgevingsvariabelen in Vercel.</p></section></div>;
 if(loading)return <div className="auth-wrap">Account laden…</div>;
 if(!user)return <div className="auth-wrap"><section className="auth-card" style={{maxWidth:440}}>
 <div className="auth-logo">✦ Klaslokaal 2.0</div><h1>Welkom bij Klaslokaal</h1>
 <p>Kies hoe je Klaslokaal gebruikt en log veilig in.</p>
 <div className="auth-choice" role="group" aria-label="Inloggen als"><button type="button" aria-pressed={loginAs==='student'} onClick={()=>setLoginAs('student')}>🎓 Leerling</button><button type="button" aria-pressed={loginAs==='teacher'} onClick={()=>setLoginAs('teacher')}>📚 Docent</button></div>
 <p className="auth-helper">{loginAs==='student'?'Open je leerlingprofiel, lessen en huiswerk. Gebruik het e-mailadres van je uitnodiging.':'Open je docentendashboard. Docenttoegang vereist goedkeuring door de beheerder.'}</p>
 <button className="button auth-google" disabled={busy} onClick={async()=>{setBusy(true);const {error}=await db.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.href}});if(error){setMessage(error.message);setBusy(false)}}}>Inloggen met Google</button>
 <p style={{margin:'20px 0 8px'}}>Of ontvang een veilige inloglink per e-mail</p>
 <form onSubmit={async e=>{e.preventDefault();setBusy(true);setMessage('');const {error}=await db.auth.signInWithOtp({email:email.trim().toLowerCase(),options:{emailRedirectTo:window.location.href,shouldCreateUser:true}});setBusy(false);setMessage(error?error.message:'Controleer je e-mail en klik op de inloglink.');}}>
 <input className="field" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="jij@voorbeeld.com" style={{width:'100%',marginBottom:10}}/>
 <button className="button" disabled={busy} type="submit" style={{width:'100%'}}>Stuur mij een inloglink</button>
 </form>{message&&<p role="status" style={{marginTop:12}}>{message}</p>}
 <small>Je sessie wordt op dit webadres onthouden. Gebruik geen gedeelde computer als je ingelogd wilt blijven.</small>
 </section></div>;
 return <>{children}</>;
}
