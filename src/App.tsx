import React, { useState, useEffect } from 'react';
import useFetchReservation from'./components/FetchReservation';
import StartMeny from "./components/StartMeny";
import BookingForm from "./components/BookingForm";
import AllReservationsPage from "./components/pages/AllReservationsPage";
import './App.css';



const App: React.FC = () => {
  const { reservations, reload }  = useFetchReservation();
  const [page, setPage] = useState<string>("start");

  useEffect(() =>{
    
    let pageUrl = page;

    if(!pageUrl){
      const queryParameters = new URLSearchParams(window.location.search);
      const getUrl = queryParameters.get("page");
    
      if(getUrl){
        pageUrl = getUrl;
        setPage(getUrl)
      } else {
        pageUrl = "start"
      }
    }

    window.history.pushState(
      null,
      "",
      "?page=" + pageUrl
    )

  }, [page])


  


  return (
    <div>
      {page === "start" && <StartMeny setPage={setPage} />}
      {page === "booking" && <BookingForm reservations={reservations} reload={reload} setPage={setPage} />}
      {page === "allreservations" && <AllReservationsPage reservations={reservations} setPage={setPage} />}
    </div>
  );
};

export default App;