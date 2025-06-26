import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const inputRef = useRef();

  function sendMessage() {
    const message = inputRef.current.value;

    socket.send(message);

    inputRef.current.value = "";
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    setSocket(ws);

    ws.onmessage = (e) => {
      console.log(e.data);
      setMessages((prevMessages) => [...prevMessages, e.data]);
    };

    return () => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  }, []);

  return (
    <>
      <div>
        <input type="text" placeholder="send message" ref={inputRef} />
        <button onClick={sendMessage}>send</button>
        <ul>
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
