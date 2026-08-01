import './globals.css';import type {Metadata} from 'next';import {Header} from '../components/site';
export const metadata:Metadata={title:'AdGeco — Governed Advertising Infrastructure',description:'Advertising infrastructure for publishers, advertisers, agencies and technology partners.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Header/>{children}</body></html>}
