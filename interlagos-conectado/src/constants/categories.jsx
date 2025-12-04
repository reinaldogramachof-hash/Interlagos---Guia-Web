import React from 'react';
import { Filter, Utensils, ShoppingBag, Stethoscope, Hammer, Car, Scissors, GraduationCap, Dog, MoreHorizontal } from 'lucide-react';

export const categories = [
    { id: 'Todos', label: 'Todos', icon: <Filter size={20} /> },
    { id: 'Restaurantes', label: 'Restaurantes', icon: <Utensils size={20} /> },
    { id: 'Serviços', label: 'Serviços', icon: <Filter size={20} /> },
    { id: 'Lojas', label: 'Lojas', icon: <ShoppingBag size={20} /> },
    { id: 'Saúde', label: 'Saúde', icon: <Stethoscope size={20} /> },
    { id: 'Pet', label: 'Pet & Vet', icon: <Dog size={20} /> },
    { id: 'Construção', label: 'Construção', icon: <Hammer size={20} /> },
    { id: 'Automotivo', label: 'Automotivo', icon: <Car size={20} /> },
    { id: 'Beleza', label: 'Beleza', icon: <Scissors size={20} /> },
    { id: 'Educação', label: 'Educação', icon: <GraduationCap size={20} /> },
    { id: 'Outros', label: 'Outros', icon: <MoreHorizontal size={20} /> }
];
