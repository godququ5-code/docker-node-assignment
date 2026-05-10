import { useEffect, useState } from "react";
import { CheckCircle2, RefreshCcw, Send, Server, TerminalSquare } from "lucide-react";

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }

  return payload;
}

export default function App() {
  const [health, setHealth] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("Hello from the Dockerized client");
  const [author, setAuthor] = useState("Student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadSystem() {
    setLoading(true);
    setError("");

    try {
      const [healthPayload, messagesPayload] = await Promise.all([
        fetchJson("/api/health"),
        fetchJson("/api/messages")
      ]);

      setHealth(healthPayload);
      setMessages(messagesPayload.messages);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitMessage(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await fetchJson("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ author, text })
      });
      setText("");
      await loadSystem();
    } catch (requestError) {
      setError(requestError.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSystem();
  }, []);

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="title-block">
          <div className="mark" aria-hidden="true">
            <Server size={30} />
          </div>
          <div>
            <p className="eyebrow">Docker Compose system</p>
            <h1>Node.js backend and React client</h1>
          </div>
        </div>

        <div className="status-grid">
          <article className="panel status-panel">
            <div className="panel-heading">
              <CheckCircle2 size={22} />
              <h2>Backend status</h2>
            </div>
            <dl>
              <div>
                <dt>State</dt>
                <dd>{health?.status || "checking"}</dd>
              </div>
              <div>
                <dt>Service</dt>
                <dd>{health?.service || "server"}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{health ? new Date(health.timestamp).toLocaleString() : "waiting"}</dd>
              </div>
            </dl>
            <button className="icon-button" onClick={loadSystem} disabled={loading} title="Refresh status">
              <RefreshCcw size={18} />
              Refresh
            </button>
          </article>

          <article className="panel command-panel">
            <div className="panel-heading">
              <TerminalSquare size={22} />
              <h2>Container check</h2>
            </div>
            <code>curl http://localhost:8080/api/health</code>
            <p>{error ? error : "The client reaches the backend through the Compose network."}</p>
          </article>
        </div>

        <section className="panel">
          <div className="panel-heading">
            <Send size={22} />
            <h2>Messages from API</h2>
          </div>

          <form className="message-form" onSubmit={submitMessage}>
            <input
              aria-label="Author"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="Author"
            />
            <input
              aria-label="Message"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Message"
            />
            <button className="icon-button primary" type="submit" disabled={loading || !text.trim()} title="Send message">
              <Send size={18} />
              Send
            </button>
          </form>

          <div className="message-list">
            {messages.map((message) => (
              <article className="message" key={message.id}>
                <strong>{message.author}</strong>
                <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                <p>{message.text}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
