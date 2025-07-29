function reconocerVoz() {
    const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    reconocimiento.lang = "es-ES";

    reconocimiento.onresult = function (event) {
        const texto = event.results[0][0].transcript.toLowerCase();
        document.getElementById("expresion").value = texto;
        calcular(texto);
    };

    reconocimiento.onerror = function (event) {
        console.error("Error de reconocimiento de voz:", event.error);
        hablar("Ocurrió un error al reconocer tu voz");
    };

    reconocimiento.start();
}

function calcular(entrada = null) {
    let expresion = entrada || document.getElementById("expresion").value.toLowerCase();

    const reemplazos = {
        "más": "+",
        "menos": "-",
        "por": "*",
        "x": "*",
        "entre": "/",
        "dividido entre": "/",
        "dividido por": "/",
        "dividido": "/",
        "elevado a": "**",
        "raíz cuadrada de": "Math.sqrt",
        "logaritmo de": "Math.log10",
        "logaritmo natural de": "Math.log",
        "seno de": "Math.sin(grados_a_radianes(",
        "coseno de": "Math.cos(grados_a_radianes(",
        "tangente de": "Math.tan(grados_a_radianes(",
        "valor absoluto de": "Math.abs",
        "pi": "Math.PI",
        "e": "Math.E"
    };

    const numeros = {
        "uno": "1", "dos": "2", "tres": "3", "cuatro": "4", "cinco": "5",
        "seis": "6", "siete": "7", "ocho": "8", "nueve": "9", "diez": "10",
        "once": "11", "doce": "12", "trece": "13", "catorce": "14", "quince": "15",
        "dieciséis": "16", "diecisiete": "17", "dieciocho": "18", "diecinueve": "19", "veinte": "20",
        "cero": "0"
    };

    for (let palabra in reemplazos) {
        const regex = new RegExp(palabra, "g");
        expresion = expresion.replace(regex, reemplazos[palabra]);
    }

    for (let palabra in numeros) {
        const regex = new RegExp(`\\b${palabra}\\b`, "g");
        expresion = expresion.replace(regex, numeros[palabra]);
    }

    // Cierra funciones trigonométricas abiertas
    expresion = expresion.replace(/Math\.(sin|cos|tan)\(grados_a_radianes\(([^()]+)\)/g, "Math.$1(grados_a_radianes($2))");

    // Factorial
    expresion = expresion.replace(/factorial de (\d+)/g, (_, num) => factorial(parseInt(num)));

    try {
        const resultado = eval(expresion);
        if (isNaN(resultado)) throw "Expresión inválida";

        document.getElementById("resultado").textContent = "Resultado: " + resultado;
        hablar("El resultado es " + resultado);
    } catch (error) {
        console.error("Error al calcular:", error);
        document.getElementById("resultado").textContent = "Ocurrió un error al calcular.";
        hablar("Ocurrió un error al calcular");
    }
}

function grados_a_radianes(grados) {
    return grados * Math.PI / 180;
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

function hablar(texto) {
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    speechSynthesis.speak(mensaje);
}
