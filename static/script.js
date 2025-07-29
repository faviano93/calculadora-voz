function reconocerVoz() {
    const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    reconocimiento.lang = "es-ES";

    reconocimiento.onresult = function(evento) {
        const texto = evento.results[0][0].transcript.toLowerCase();
        document.getElementById("expresion").value = texto;

        if (texto.includes("calcular")) {
            calcular();
        }
    };

    reconocimiento.onerror = function(evento) {
        alert("Error al reconocer la voz: " + evento.error);
    };

    reconocimiento.start();
}

function calcular() {
    const expresion = document.getElementById("expresion").value.toLowerCase();

    let operacion = expresion
        .replace(/más/g, "+")
        .replace(/mas/g, "+")
        .replace(/menos/g, "-")
        .replace(/por/g, "*")
        .replace(/entre/g, "/")
        .replace(/dividido/g, "/");

    try {
        let resultado = eval(operacion);
        document.getElementById("resultado").innerText = `Resultado: ${resultado}`;
        hablar(`El resultado es ${resultado}`);
    } catch (error) {
        document.getElementById("resultado").innerText = "Ocurrió un error al calcular.";
        hablar("Ocurrió un error al calcular");
    }
}

function hablar(texto) {
    const sintetizador = window.speechSynthesis;
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    sintetizador.speak(mensaje);
}
