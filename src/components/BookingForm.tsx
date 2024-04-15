import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Reservation } from './FetchReservation';
import { v4 as uuidv4 } from 'uuid';

type BookingFormProps = {
    reservations: Reservation[];
    reload: () => void;
    setPage: (page: string) => void;
};

const useAvailableTimes = (reservations: Reservation[], selectedDay: Date | null) => {
    const [availableTimes, setAvailableTimes] = useState<Array<{time: string, package: string}>>([]);
    const times = useMemo(() => ['Fm', 'Em', 'Kväll'], []);
    const packages = useMemo(() => ['Kall', 'Varm'], []);

    useEffect(() => {
      if (selectedDay) {
        const bookingsForDate = reservations.filter(r => new Date(r.date).toDateString() === selectedDay.toDateString());
        const newAvailableTimes  = [];

        for (const time of times) {
          for (const pkg of packages) {
            if (!bookingsForDate.some(b => b.time === time && b.package === pkg)) {
              newAvailableTimes.push({ time, package: pkg });
            }
          }
        }

        setAvailableTimes(newAvailableTimes);
      }
    }, [selectedDay, reservations, times, packages]);

    return availableTimes;
};


const BookingForm: React.FC<BookingFormProps> = ({ reservations, reload, setPage }) => {
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [name, setName] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const availableTimes = useAvailableTimes(reservations, selectedDay);


    const times = ['Fm', 'Em', 'Kväll'];
    const packages = ['Kall', 'Varm'];

    const handleDayClick = (date: Date) => {
    setSelectedDay(date);
    };

    const handleDateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Månader är 0-indexerade i JavaScript
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
    };




    const saveReservation = async (newBooking: Reservation) => {
        try {
            await fetch ("http://localhost:3000/reservations", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(newBooking)
            });

            // Hämta den uppdaterade listan av bokningar
            const response = await fetch("http://localhost:3000/reservations");
            const updatedReservations = await response.json();

            return updatedReservations;

            } catch (error) {
                console.error("Failed to save reservation:", error);
            }
    }


    const handleBooking = async () => {
        if (!selectedDay || !name || !selectedTime || !selectedPackage) return;
        const date = handleDateToString(selectedDay); // Formatera datumet till "YYYY-MM-DD"

        if (reservations.some(b => b.name === name && new Date(b.date).toDateString() === selectedDay.toDateString())) {
            alert('Fel: Samma namn kan inte boka mer än en gång per dag.');
            return;
        }

        if (reservations.some(b => new Date(b.date).toDateString() === selectedDay.toDateString() && b.time === selectedTime && b.package === selectedPackage)) {
            alert('Fel: Den valda tiden och paketet har redan bokats för detta datum.');
            return;
        }


        const id = uuidv4(); // Generera ett unikt ID

        const newBooking: Reservation = { id, name, date, time: selectedTime, package: selectedPackage };
        await saveReservation(newBooking);

        // Rensa alla inputfält och gjorda klick
        setSelectedDay(null);
        setName('');
        setSelectedTime(null);
        setSelectedPackage(null);

        reload(); // Uppdatera bokningarna
    };

    return (
        <div>
            <button onClick={() => setPage("start")}>Hem</button>
            <button onClick={() => setPage("allreservations")}>Se bokade tider</button><br />


            <DatePicker selected={selectedDay} onChange={handleDayClick} placeholderText='Klicka för att välja datum' /><br />
            {selectedDay && (
            <>
                <div>
                    <label htmlFor="time">Tid: </label><br />
                    <select id="time" onChange={e => setSelectedTime(e.target.value)}>
                    <option value="">Välj tid</option>
                    {times.map(time => (
                    <option key={time} value={time}>{time}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="package">Välj vilket paket: </label><br />
                    <select id="package" onChange={e => setSelectedPackage(e.target.value as 'Kall' | 'Varm')}>
                    <option value="">Välj paket</option>
                    {packages.map(pkg => (
                    <option key={pkg} value={pkg}>{pkg}</option>
                    ))}
                    </select>
                </div>
            </>
            )}
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Namn på bokningen" />
            <br /><button onClick={handleBooking}>Boka</button>
            <h3>Lediga tider:</h3>
            {availableTimes.map(({ time, package: pkg }, index) => (
            <div key={index}>
                <p>Tid: {time}</p>
                <p>Paket: {pkg}</p>
                <hr />

            </div>

            ))}
        </div>
    );
};

export default BookingForm;
