import type { Metadata } from 'next'
import ContenedorSecundario from './contenedorSecundario';


export const metadata: Metadata = {
    title: 'HomePage Title',
    description: 'HomePage Description'
};

export default function HomePage() {
    return (
        <ContenedorSecundario />
    );
};