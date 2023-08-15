import { useState } from "react";
import "./App.css";

function App() {
  const [facts, setFacts] = useState<string[]>([]);
  const [listening, setListening] = useState(false);

  if (!listening) {
    const events = new EventSource(
      "http://localhost:3001/join-room/730bd5ac-bba1-4690-8c8e-df50855ec7c7"
    );

    // events.addEventListener("eventsource", (e) => {
    //   console.log(e);
    // });

    events.onopen = (evt) => {
      console.log(evt);
    };

    events.onmessage = (event) => {
      console.log(event.data);
      const parsedData = JSON.parse(event.data);
      console.log(parsedData);
      setFacts(parsedData);
    };

    events.onerror = (evt) => {
      console.log(evt);
    };

    // console.log(events.onmessage);

    // console.log(events);

    setListening(true);
  }

  // useEffect(() => {
  //   let ignore = false;

  //   if (!listening && !ignore) {
  //     const events = new EventSource("http://localhost:3001/events");

  //     events.onmessage = (event) => {
  //       const parsedData = JSON.parse(event.data);

  //       setFacts((facts) => facts.concat(parsedData));
  //     };

  //     setListening(true);
  //   }

  //   return () => {
  //     ignore = true;
  //   };
  // }, []);

  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>Fact</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        {facts.map((fact, i) => (
          <tr key={i}>
            <td>{fact}</td>
            <td>{fact}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;
