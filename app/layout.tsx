import './style.css';
import type {Metadata} from 'next';
import {AuthProvider,AuthGate} from '../components/Auth';
export const metadata:Metadata={title:'Klaslokaal 2.0',description:'Jouw online onderwijsruimte'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="nl"><body><AuthProvider><AuthGate>{children}</AuthGate></AuthProvider></body></html>}
