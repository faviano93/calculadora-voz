function enviarTexto() {
    const texto = document.getElementById("texto").value;

    fetch("/procesar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ texto: texto })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("respuesta").innerText = data.respuesta;
    })
    .catch(error => {
        console.error("Error al enviar:", error);
    });
}
function reconocerVoz() {
    const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    reconocimiento.lang = "es-ES";

    reconocimiento.onresult = function(event) {
        const texto = event.results[0][0].transcript;
        document.querySelector('input[name="operacion"]').value = texto;
    };

    reconocimiento.onerror = function(event) {
        console.error("Error al reconocer voz:", event.error);
    };

    reconocimiento.start();
}
// Función para hablar el resultado en voz alta
function hablar(texto) {
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = 'es-ES'; // Voz en español
    speechSynthesis.speak(voz);
}

// Función para calcular la expresión
function calcular() {
    const expresion = document.getElementById('expresion').value;

    fetch('/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expresion: expresion })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('resultado').innerText = data.resultado;
        hablar("El resultado es " + data.resultado); // Responde con voz
    })
    .catch(error => {
        console.error('Error:', error);
        hablar("Ocurrió un error al calcular.");
    });
}

// Comando por voz
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new window.SpeechRecognition();
recognition.lang = 'es-ES';
recognition.interimResults = false;

recognition.addEventListener('result', e => {
    const transcripcion = Array.from(e.results)
        .map(resultado => resultado[0])
        .map(resultado => resultado.transcript)
        .join('');

    document.getElementById('expresion').value = transcripcion;

    // Si dice "calcular", ejecuta automáticamente
    if (transcripcion.toLowerCase().includes("calcular")) {
        calcular();
    }
});

document.getElementById('btnHablar').addEventListener('click', () => {
    recognition.start();
});
