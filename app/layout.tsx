import './style.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title:'Klaslokaal 2.0 — testomgeving', description:'Persoonlijke docentomgeving' };
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="nl"><body>{children}</body></html>}
