<!-- HTML -->
<label>O habla tu operaci贸n:</label><br>
<button type="button" onclick="reconocerVoz()">馃帳 Hablar</button><br><br>
<input type="text" id="expresion" name="operacion" placeholder="Escribe o di tu operaci贸n">
<button id="btnCalcular" onclick="calcular()">Calcular</button>
<p id="resultado"></p>

<script>
// Reconocimiento de voz
function reconocerVoz() {
    const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    reconocimiento.lang = "es-ES";

    reconocimiento.onresult = function(event) {
        const resultado = event.results[0][0].transcript.toLowerCase();
        document.getElementById('expresion').value = resultado;

        // Si el usuario dice "calcular", se hace clic autom谩ticamente
        if (resultado.includes("calcular")) {
            document.getElementById('btnCalcular').click();
        }
    };

    reconocimiento.onerror = function(event) {
        console.error("Error al reconocer voz:", event.error);
    };

    reconocimiento.start();
}

// S铆ntesis de voz
function hablar(texto) {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    speechSynthesis.speak(utterance);
}

// Enviar operaci贸n al servidor y mostrar resultado
function calcular() {
    const expresion = document.getElementById('expresion').value;

    fetch('/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expresion: expresion })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('resultado').innerText = 'Resultado: ' + data.resultado;
        hablar("El resultado es " + data.resultado);
    })
    .catch(error => {
        console.error('Error:', error);
        hablar("Ocurri贸 un error al calcular.");
    });
}
</script>
function reconocerVoz() {
    const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    reconocimiento.lang = 'es-ES';

    reconocimiento.start();

    reconocimiento.onresult = function(evento) {
        const texto = evento.results[0][0].transcript;
        document.getElementById("expresion").value = texto;
    };

    reconocimiento.onerror = function(evento) {
        alert("Error al reconocer la voz: " + evento.error);
    };
}

function calcular() {
    const expresion = document.getElementById("expresion").value.toLowerCase();

    // Convertir palabras a s铆mbolos matem谩ticos b谩sicos
    let operacion = expresion
        .replace(/m谩s/g, "+")
        .replace(/menos/g, "-")
        .replace(/por/g, "*")
        .replace(/entre/g, "/")
        .replace(/dividido/g, "/");

    try {
        let resultado = eval(operacion);
        document.getElementById("resultado").innerText = `Resultado: ${resultado}`;
        hablar(`El resultado es ${resultado}`);
    } catch (error) {
        document.getElementById("resultado").innerText = "Ocurri贸 un error al calcular.";
        hablar("Ocurri贸 un error al calcular");
    }
}

function hablar(texto) {
    const sintetizador = window.speechSynthesis;
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    sintetizador.speak(mensaje);
}

