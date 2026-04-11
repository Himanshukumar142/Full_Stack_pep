import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [backendMessage, setBackendMessage] = useState("");
  const [name, setName] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const getMessageFromBackend = async () => {
    try {
      // Force relative path to trigger Vercel vercel.json proxy
      const response = await fetch(`/api/message`);
      const data = await response.json();
      setBackendMessage(data.message);
    } catch (error) {
      setBackendMessage("Failed to connect backend");
      console.log(error.message);
    }
  };

  const sendNameToBackend = async (e) => {
    e.preventDefault();

    try {
      // Force relative path to trigger Vercel vercel.json proxy
      const response = await fetch(`/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      setResponseMessage(data.message);
    } catch (error) {
      setResponseMessage("Failed to send data to backend");
      console.log(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Frontend + Backend Starter</h1>
      <p className="subtitle">React frontend and Express backend connection demo</p>

      <div className="section">
        <h2>GET Request Demo</h2>
        <button onClick={getMessageFromBackend}>Get Message From Backend</button>
        <p>{backendMessage}</p>
      </div>

      <div className="section">
        <h2>POST Request Demo</h2>
        <form onSubmit={sendNameToBackend} className="form">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Send To Backend</button>
        </form>
        <p>{responseMessage}</p>
      </div>
    </div>
  );
}

export default App;