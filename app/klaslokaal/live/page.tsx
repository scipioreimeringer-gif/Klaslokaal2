'use client';
import Link from 'next/link';
import {useAuth} from '../../../components/Auth';
import Nav from '../../../components/Nav';

export default function LivePreview(){
 const {user,role,loading}=useAuth();
 if(loading) return <Nav><p>Lesruimte laden…</p></Nav>;
 if(!user || (role!=='admin' && role!=='teacher')) return <Nav><p>Deze testpagina is alleen voor docenten en beheerders.</p></Nav>;
 return <div style={{minHeight:'100vh',background:'#f5f7f8',padding:16,fontFamily:'Inter,system-ui,sans-serif'}}>
  <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap',marginBottom:12}}>
   <div><strong style={{fontSize:19}}>Klaslokaal 2.0 · Live test</strong><div style={{fontSize:12,color:'#667085'}}>v22 preview · oude lesfuncties in nieuwe platformomgeving</div></div>
   <Link href="/klaslokaal" style={{color:'#126e70',fontWeight:600}}>Terug naar dashboard</Link>
  </header>
  <p style={{background:'#fff7ed',border:'1px solid #fed7aa',padding:12,borderRadius:12,fontSize:13}}>Testomgeving: dit is de bestaande v16-lesomgeving. Nog niet gekoppeld aan de Supabase-leerlingprofielen. Gebruik voorlopig geen echte leerlinggegevens. De oude leslink en opslag zijn nog niet beveiligd voor meerdere docenten.</p>
  <iframe title="Klaslokaal v16 live test" src="/legacy/index.html" allow="camera; microphone; display-capture; fullscreen" style={{width:'100%',height:'calc(100vh - 155px)',minHeight:520,border:'1px solid #d7e0e3',borderRadius:14,background:'#fff'}} />
 </div>;
}
