import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
export async function POST(req:NextRequest){try{
 const token=req.headers.get('authorization')?.replace(/^Bearer /,'');if(!token)return NextResponse.json({error:'Niet ingelogd'},{status:401});
 const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user}}=await db.auth.getUser(token);if(!user)return NextResponse.json({error:'Geen sessie'},{status:401});
 const {submissionId}=await req.json();if(typeof submissionId!=='string')return NextResponse.json({error:'Ongeldig ID'},{status:400});
 const {data:s}=await db.from('homework_submissions').select('assignment_id,file_path').eq('id',submissionId).single();if(!s?.file_path)return NextResponse.json({error:'Bestand niet gevonden'},{status:404});
 const {data:allowed}=await db.rpc('owns_assignment',{aid:s.assignment_id});if(!allowed)return NextResponse.json({error:'Geen toegang'},{status:403});
 const {data,error}=await db.storage.from('homework').createSignedUrl(s.file_path,60);return error?NextResponse.json({error:error.message},{status:403}):NextResponse.json({url:data.signedUrl});
 }catch{return NextResponse.json({error:'Bestand openen mislukt'},{status:500})}}
