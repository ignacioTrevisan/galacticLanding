import type { Metadata } from 'next'
import 'animate.css';


export const metadata: Metadata = {
    title: 'template Title',
    description: 'template Description'
};

export default function template() {
    return (
        <div className='animate__animated animate__fadeIn animate__delay-2s animate__slow'>

            <img src="/frames2/ezgif-frame-001.jpg" alt="" />
        </div>
    );
};