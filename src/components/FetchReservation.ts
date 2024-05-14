import { useState, useEffect } from 'react';

export interface Reservation{
    id: string
    name: string
    date: string
    time: string
    packages: string
}

export const useFetchReservation  = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [reload, setReload] = useState(false);

    // Funktion för att hämta reservationer
    useEffect(() => {
        const fetchReservations = async () => {
          const response = await fetch("https://coral-app-w45yr.ondigitalocean.app/reservations");
          const data = await response.json();
          setReservations(data);
        };
    
        fetchReservations();
      }, [reload]);
    
      return { reservations, reload: () => setReload(!reload) };
    };
    
    export default useFetchReservation;