import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [facts, setFacts] = useState<{ info: string; source: string }[]>([]);
  const [listening, setListening] = useState(false);

  if (!listening) {
    const events = new EventSource("http://localhost:3001/events");

    events.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);

      setFacts((facts) => facts.concat(parsedData));
    };

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
            <td>{fact.info}</td>
            <td>{fact.source}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;
