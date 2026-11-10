'use client';
import {useCallback,useEffect,useState} from 'react';
import Nav from '../../components/Nav';
import {useAuth} from '../../components/Auth';
import {supabase} from '../../lib/supabase';
type Applicant={id:string;email:string;full_name:string|null;role:string;created_at:string};
export default function Beheer(){const {role,loading}=useAuth();const [items,setItems]=useState<Applicant[]>([]);const [error,setError]=useState('');const [busy,setBusy]=useState<string|null>(null);
 const load=useCallback(async()=>{const {data,error:e}=await supabase()!.from('profiles').select('id,email,full_name,role,created_at').eq('role','pending_teacher').order('created_at');if(e)setError(e.message);else setItems(data||[])},[]);
 useEffect(()=>{if(role==='admin')void load()},[role,load]);
 async function review(id:string,approve:boolean){setBusy(id);setError('');const {error:e}=await supabase()!.rpc('review_teacher_application',{target_id:id,approve});if(e)setError(e.message);else await load();setBusy(null)}
 return <Nav><div className="section-heading"><div><h1>Docenten beheren</h1><p>Beoordeel nieuwe aanvragen voor docenttoegang.</p></div></div>{loading?<p>Laden…</p>:role!=='admin'?<div className="notice">Alleen de beheerder heeft toegang tot deze pagina.</div>:<section className="panel" style={{padding:24}}>{error&&<div className="notice">{error}</div>}{items.length===0?<p>Er zijn momenteel geen openstaande aanvragen.</p>:items.map(item=><div key={item.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,padding:'14px 0',borderBottom:'1px solid #ddd',flexWrap:'wrap'}}><div><strong>{item.full_name||item.email}</strong><p style={{margin:0}}>{item.email}</p></div><div style={{display:'flex',gap:8}}><button className="button" disabled={busy!==null} onClick={()=>void review(item.id,true)}>Goedkeuren</button><button className="button" disabled={busy!==null} onClick={()=>void review(item.id,false)}>Weigeren</button></div></div>)}</section>}</Nav>
}
