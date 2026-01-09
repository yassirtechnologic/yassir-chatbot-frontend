// ===============================
// CONFIG
// ===============================
const API_URL = "https://yassirbot-backend.onrender.com/api/chat";

// ===============================
// CHAT VISIBILITY
// ===============================
function openChat() {
  document.getElementById("chat-overlay").classList.remove("hidden");
}

function closeChat() {
  document.getElementById("chat-overlay").classList.add("hidden");
}

// ===============================
// SEND MESSAGE
// ===============================
async function sendMessage() {
  const input = document.getElementById("prompt");
  const messages = document.getElementById("messages");

  const userText = input.value.trim();
  if (!userText) return;

  // Mensaje usuario
  messages.innerHTML += `
    <div class="msg user">
      <strong>Tú:</strong> ${userText}
    </div>
  `;

  input.value = "";
  messages.scrollTop = messages.scrollHeight;

  const typingId = "typing-" + Date.now();

  // Indicador escribiendo
  messages.innerHTML += `
    <div class="msg bot" id="${typingId}">
      <em>Yassir está escribiendo...</em>
    </div>
  `;
  messages.scrollTop = messages.scrollHeight;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userText
      })
    });

    if (!response.ok) {
      throw new Error("Respuesta inválida del servidor");
    }

    const data = await response.json();

    const reply =
      data.reply ||
      data.response ||
      data.message ||
      "Lo siento, no pude responder en este momento.";

    document.getElementById(typingId).innerHTML = `
      <strong>Yassir:</strong> ${reply}
    `;

  } catch (error) {
    document.getElementById(typingId).innerHTML = `
      <strong>Yassir:</strong> ❌ Error al conectar con el servidor
    `;
    console.error("Chat error:", error);
  }

  messages.scrollTop = messages.scrollHeight;
}

// ===============================
// ENTER KEY SUPPORT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("prompt");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }
});
