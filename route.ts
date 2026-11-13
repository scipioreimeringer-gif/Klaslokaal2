import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
export async function POST(req:NextRequest){
 try{
 const token=req.headers.get('authorization')?.replace(/^Bearer /,'');if(!token)return NextResponse.json({error:'Log eerst in'},{status:401});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL!,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
 const db=createClient(url,key,{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user},error:authError}=await db.auth.getUser(token);if(authError||!user)return NextResponse.json({error:'Ongeldige sessie'},{status:401});
 const {submissionId}=await req.json();if(typeof submissionId!=='string'||!/^[0-9a-f-]{36}$/i.test(submissionId))return NextResponse.json({error:'Ongeldige inzending'},{status:400});
 const {data:s}=await db.from('homework_submissions').select('id,assignment_id,answer').eq('id',submissionId).maybeSingle();if(!s)return NextResponse.json({error:'Geen toegang'},{status:403});
 const {data:allowed}=await db.rpc('owns_assignment',{aid:s.assignment_id});if(!allowed)return NextResponse.json({error:'Alleen de docent'},{status:403});
 const {data:a}=await db.from('assignments').select('title,instructions').eq('id',s.assignment_id).single();if(!a)return NextResponse.json({error:'Opdracht ontbreekt'},{status:404});
 if(!s.answer.trim())return NextResponse.json({error:'Deze inzending heeft geen tekst. Bijlagen worden nog niet door AI gelezen.'},{status:400});
 if(!process.env.OPENAI_API_KEY)return NextResponse.json({error:'OPENAI_API_KEY ontbreekt op Vercel'},{status:503});
 const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4.1-mini',messages:[{role:'system',content:'Je helpt een taaldocent. Geef in het Nederlands constructieve, precieze feedback op de antwoorden, met verbeterde zinnen en korte uitleg. Doe geen aannames over antwoorden die ontbreken. Dit is een concept voor docentcontrole.'},{role:'user',content:`Opdracht: ${a.title}\n${a.instructions.slice(0,8000)}\n\nAntwoord leerling:\n${s.answer.slice(0,12000)}`}],max_completion_tokens:1600})});const j=await r.json();if(!r.ok)return NextResponse.json({error:j.error?.message||'AI-verzoek mislukt'},{status:502});const feedback=j.choices?.[0]?.message?.content?.trim();if(!feedback)return NextResponse.json({error:'Geen AI-antwoord'},{status:502});return NextResponse.json({feedback});
 }catch{return NextResponse.json({error:'Kon feedback niet genereren'},{status:500})}
}
