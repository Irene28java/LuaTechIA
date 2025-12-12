// frontend/src/pages/Chat.jsx
import { useState } from "react";
import Topbar from "../components/Topbar";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import Sidebar from "../components/sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Subscription from "./Subscription.jsx";
import { generateEvaluationPDF } from "../api/pdf.js";
import Modal from "../components/Modal.jsx";


export default function ChatAdvanced() {
  const { user: authUser } = useAuth(); // usuario autenticado
  const [user, setUser] = useState(authUser || null); 
  const [role, setRole] = useState("niño");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Sidebar
  const [age, setAge] = useState(8);
  const [subject, setSubject] = useState("naturales");
  const [specialNeeds, setSpecialNeeds] = useState([]);

  // Modal de suscripción
  const [showSubscription, setShowSubscription] = useState(false);
  const handleUpgrade = () => setShowSubscription(true);

  // ---------------------------------------------
  // Enviar mensajes
  // ---------------------------------------------
  const getTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const sendMessage = (text, roleMessage = "user") => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: roleMessage, text, time: getTime() }]);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage(text, "user");

    if (detectExamRequest(text)) {
      autoGenerateExam(text);
    }

    setInput("");
  };

  // ---------------------------------------------
  // Procesar exámenes → PDF
  // ---------------------------------------------
  const processAssistantMessage = async (assistantMsg) => {
    if (assistantMsg.type === "exam") {
      await generateEvaluationPDF({
        title: assistantMsg.title || "Evaluación",
        student: user?.name || "Alumno",
        age: age,
        subject: assistantMsg.subject || subject,
        evaluationData: assistantMsg.questions,
        notes: assistantMsg.notes || "",
      });
    }
  };

  // ---------------------------------------------
  // Templates y carpetas
  // ---------------------------------------------
  const handleTemplate = (template) => {
    sendMessage(`Generando ${template} para ${subject}...`, "system");
    setTimeout(() => {
      sendMessage(`Aquí tienes tu ${template} de ${subject}: [Contenido generado automáticamente]`, "assistant");
    }, 1000);
  };

  const handleFolder = (folder) => {
    sendMessage(`Abriste la carpeta: ${folder}`, "system");

    // Exámenes
    if (folder === "Exámenes") {
      sendMessage(`Generando examen de ${subject} con 20 preguntas...`, "system");
      setTimeout(() => {
        const examMsg = {
          role: "assistant",
          type: "exam",
          title: `Examen de ${subject}`,
          subject: subject,
          notes: "Examen generado automáticamente.",
          questions: Array.from({ length: 20 }).map((_, i) => ({
            q: `Pregunta ${i + 1}: Explica lo relacionado con ${subject}.`,
            a: "Respuesta esperada..."
          }))
        };
        sendMessage("Tu examen está listo. Generando PDF...", "assistant");
        processAssistantMessage(examMsg);
      }, 1200);
    }

    // Deberes
    if (folder === "Deberes") {
      sendMessage(`Generando actividades de ${subject}...`, "system");
      setTimeout(() => {
        sendMessage(`Actividades de ${subject} listas para Deberes: [Lista generada]`, "assistant");
      }, 1200);
    }

    // Clases
    if (folder === "Clases") {
      sendMessage(`Preparando pizarra para la clase de ${subject}...`, "system");
      setTimeout(() => {
        sendMessage(`Pizarra lista: [Ideas y actividades]`, "assistant");
      }, 1200);
    }

    // Proyecto escolar
    if (folder === "Proyecto escolar") {
      sendMessage(`Ideas para proyecto escolar de ${subject}...`, "system");
      setTimeout(() => {
        sendMessage(`[Proyecto generado con tareas de ${subject}]`, "assistant");
      }, 1200);
    }
  };

  // ---------------------------------------------
  // Detectar pedidos de examen
  // ---------------------------------------------
  const detectExamRequest = (text) => {
    const lower = text.toLowerCase();
    const triggers = ["examen","prueba","evaluación","test","hazme un examen","crea un examen","generar examen"];
    return triggers.some(t => lower.includes(t));
  };

  const autoGenerateExam = (userText) => {
    let numQuestions = 20;
    const match = userText.match(/(\d+)\s*(preguntas|items|cuestiones)/i);
    if (match) numQuestions = Math.max(20, parseInt(match[1]));

    const examMsg = {
      role: "assistant",
      type: "exam",
      title: `Examen de ${subject}`,
      subject: subject,
      notes: "Examen generado automáticamente.",
      questions: Array.from({ length: numQuestions }).map((_, i) => ({
        q: `Pregunta ${i + 1}: Explica lo relacionado con ${subject}.`,
        a: "Respuesta esperada..."
      }))
    };

    sendMessage(`Generando examen de ${subject} con ${numQuestions} preguntas...`, "system");
    setTimeout(() => {
      sendMessage("Tu examen está listo. Generando PDF...", "assistant");
      processAssistantMessage(examMsg);
    }, 900);
  };

  // ---------------------------------------------
  // Render
  // ---------------------------------------------
  return (
    <div className="w-full h-screen flex bg-gradient-to-br from-[#f4dbe7] to-[#e5d4f6] p-4">
      
      {/* Sidebar */}
      <Sidebar
        age={age}
        subject={subject}
        specialNeeds={specialNeeds}
        onChangeAge={setAge}
        onChangeSubject={setSubject}
        onToggleNeed={(n) =>
          setSpecialNeeds((prev) =>
            prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
          )
        }
        onSelectFolder={handleFolder}
        onSelectTemplate={handleTemplate}
      />

      {/* Chat */}
      <main
        className="
          flex-1 h-full ml-4 rounded-3xl 
          bg-white/30 backdrop-blur-2xl 
          border border-white/40 shadow-2xl 
          p-6 flex flex-col
        "
      >
        <Topbar
          user={authUser || user}
          role={role}
          onChangeRole={setRole}
          onLoginClick={() => setUser({ name: 'Usuario', age })}
          onUpgradeClick={handleUpgrade} // botón mejorar plan
        />

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scroll">
          {messages.map((m, i) => (
            <ChatBubble key={i} {...m} />
          ))}
        </div>

        {/* Input */}
        <div className="mt-4">
          <ChatInput input={input} setInput={setInput} onSend={handleSend} />
        </div>
      </main>

      {/* Modal de suscripción tipo ChatGPT */}
      {showSubscription && (
        <Modal onClose={() => setShowSubscription(false)}>
          <Subscription onClose={() => setShowSubscription(false)}/>
            </Modal>
      )}
    </div>
  );
}
