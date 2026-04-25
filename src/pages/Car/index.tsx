import { useState, useEffect } from 'react';
import { Container } from '../../components/Container';
import { FaWhatsapp } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

interface CarProps {
    id: string;
    name: string;
    model: string;
    price: string;
    year: string;
    km: string;
    city: string;
    description: string;
    created: string;
    owner: string;
    uid: string;
    images: string[];
    whatsapp: string;
}

export function CarDetail() {
    const [car, setCar] = useState<CarProps>()

    return(
        <div>
            <h1>Pagina detalhes</h1>
        </div>
    )
}