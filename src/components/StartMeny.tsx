type StartMenyProps = {
  setPage: (page: string) => void;
};

const StartMeny: React.FC<StartMenyProps> = ({ setPage }) => {


      return (
        <div>
            <h1>Välkommen till Sams Spa</h1>
            <h2>Gör ditt val nedan </h2>
            <button onClick={() => { setPage("booking"); console.log("Button clicked"); }}>Gå till bokningssidan</button>
            <button onClick={() => setPage("allreservations")}>Se bokade tider</button>
        </div>
  );
};

export default StartMeny;
