import Link from 'next/link';
export default function Nav({children}:{children:React.ReactNode}){return <div className="shell"><nav className="side"><div className="logo">Klaslokaal <small style={{fontSize:11}}>2.0</small></div><Link href="/">Dashboard</Link><Link href="/leerlingen">Leerlingen</Link><Link href="/klaslokaal">Classroom v15</Link></nav><main className="main">{children}</main></div>}
