import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const inputRef = useRef();

  function sendMessage() {
    const message = inputRef.current.value;

    socket.send(message);

    console.log(messages);

    socket.onmessage = function (e) {
      console.log(e.data);

      setMessages([...messages, e.data]);
    };

    inputRef.current.value = "";
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    setSocket(ws);
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
