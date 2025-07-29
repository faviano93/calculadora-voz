// script.js

function hablar(texto) {
    const speech = new SpeechSynthesisUtterance();
    speech.lang = "es-ES";
    speech.text = texto;
    window.speechSynthesis.speak(speech);
}

function reconocerVoz() {
    const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    reconocimiento.lang = "es-ES";
    reconocimiento.start();

    reconocimiento.onresult = function (event) {
        const resultado = event.results[0][0].transcript;
        document.getElementById("expresion").value = resultado;
        hablar("¿Quieres que calcule eso? Di calcular o presiona el botón.");
    };

    reconocimiento.onerror = function () {
        hablar("Ocurrió un error al reconocer la voz.");
    };
}

function normalizarExpresion(expresion) {
    return expresion
        .toLowerCase()
        .replace(/por/g, '*')
        .replace(/más/g, '+')
        .replace(/menos/g, '-')
        .replace(/entre|dividido/g, '/')
        .replace(/x/g, '*')
        .replace(/,/g, '.');
}

function calcular() {
    let expresion = document.getElementById("expresion").value;

    try {
        let normalizada = normalizarExpresion(expresion);
        let resultado = eval(normalizada);

        if (isNaN(resultado)) {
            throw new Error("Expresión inválida");
        }

        const resultadoTexto = `El resultado es ${resultado}`;
        document.getElementById("resultado").innerText = resultadoTexto;
        hablar(resultadoTexto);
    } catch (error) {
        document.getElementById("resultado").innerText = "Ocurrió un error al calcular.";
        hablar("Ocurrió un error al calcular.");
    }
}
