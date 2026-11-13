 'use client';
import {Suspense,useEffect,useState} from 'react';
import {useRouter,useSearchParams} from 'next/navigation';
import {useAuth} from '../../components/Auth';
import {supabase} from '../../lib/supabase';
function Claim(){const params=useSearchParams();const router=useRouter();const {user,loading}=useAuth();const [message,setMessage]=useState('Uitnodiging controleren…');
useEffect(()=>{if(loading||!user)return;const token=params?.get('token');if(!token){setMessage('Geen uitnodigingscode gevonden.');return;}let cancelled=false;(async()=>{const {error}=await supabase()!.rpc('claim_student_invitation',{invitation_token:token});if(cancelled)return;if(error)setMessage(error.message);else router.replace('/mijn-profiel');})();return()=>{cancelled=true}},[loading,user?.id,params,router]);
return <div className="auth-wrap"><section className="auth-card"><h1>Leerlinguitnodiging</h1><p role="status">{message}</p><a className="button" href="/">Naar dashboard</a></section></div>}
export default function Invitation(){return <Suspense fallback={<p>Uitnodiging laden…</p>}><Claim/></Suspense>}
