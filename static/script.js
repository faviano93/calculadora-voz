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

// Función para transformar texto a expresión matemática
function transformarExpresion(texto) {
    return texto
        .toLowerCase()
        .replace(/más/g, "+")
        .replace(/menos/g, "-")
        .replace(/por/g, "*")
        .replace(/entre|dividido/g, "/")
        .replace(/igual/g, "=")
        .replace(/ /g, "");
}

// Función para calcular la expresión
function calcular() {
    const input = document.getElementById('expresion').value;
    const expresion = transformarExpresion(input);

    fetch('/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expresion: expresion })
    })
    .then(response => response.json())
    .then(data => {
        if (data.resultado !== undefined) {
            document.getElementById('resultado').innerText = data.resultado;
            hablar("El resultado es " + data.resultado);
        } else {
            document.getElementById('resultado').innerText = "Error al calcular";
            hablar("Ocurrió un error al calcular.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('resultado').innerText = "Error al calcular";
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

    if (transcripcion.toLowerCase().includes("calcular")) {
        calcular();
    }
});

document.getElementById('btnHablar').addEventListener('click', () => {
    recognition.start();
});
