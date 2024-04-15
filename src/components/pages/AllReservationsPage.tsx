import React from 'react';
import { Reservation } from '../FetchReservation';

type AllReservationsPageProps = {
  reservations: Reservation[];
  setPage: (page: string) => void;
};

const AllReservationsPage: React.FC<AllReservationsPageProps> = ({ reservations, setPage }) => {
  // Sortera bokningarna i ordning efter datum
  const sortedReservations = [...reservations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      <button onClick={() => setPage("start")}>Hem</button>
      {sortedReservations.map(reservation => (
        <div key={reservation.id}>
          <p>Namn: {reservation.name}</p>
          <p>Datum: {reservation.date}</p>
          <p>Tid: {reservation.time}</p>
          <p>Paket: {reservation.package}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default AllReservationsPage;