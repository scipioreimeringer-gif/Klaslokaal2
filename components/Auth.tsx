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
 async function load(){const db=supabase();if(!db){setLoading(false);return}try{const {data:{user:u}}=await db.auth.getUser();setUser(u);if(u){const {data}=await db.from('profiles').select('role').eq('id',u.id).maybeSingle();setRole(['admin','teacher','pending_teacher','rejected_teacher'].includes(data?.role)?data.role as Role:'student')}else setRole(null)}catch{setUser(null);setRole(null)}finally{setLoading(false)}}
 useEffect(()=>{void load();const db=supabase();const {data}=db?.auth.onAuthStateChange(()=>{setTimeout(()=>{void load()},0)})||{};return()=>data?.subscription.unsubscribe()},[]);
 return <C.Provider value={{user,role,loading,refresh:load}}>{children}</C.Provider>
}
export function AuthGate({children}:{children:React.ReactNode}){const {user,loading}=useAuth();const db=supabase();if(!db)return <div className="auth-wrap"><section className="auth-card"><h1>Configuratie ontbreekt</h1><p>Voeg NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY toe in Vercel en deploy opnieuw.</p></section></div>;if(loading)return <div className="auth-wrap">Account laden…</div>;if(!user)return <div className="auth-wrap"><section className="auth-card"><div className="auth-logo">✦ Klaslokaal 2.0</div><h1>Welkom bij Klaslokaal</h1><p>Log in met Google om je persoonlijke onderwijsruimte te openen.</p><button className="button auth-google" onClick={async()=>{const {error}=await db.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin}});if(error)alert(error.message)}}>Inloggen met Google</button><small>Je krijgt standaard een leerlingaccount. Een docentaccount wordt apart geactiveerd.</small></section></div>;return <>{children}</>}
