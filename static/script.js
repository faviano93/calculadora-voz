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
    expresion = expresion.replace(/coma/g, '.');

    try {
        const resultado = procesarTextoReconocido(expresion);
        if (isNaN(resultado)) throw "Expresión inválida";

        document.getElementById("resultado").textContent = "Resultado: " + resultado;
        hablar("El resultado es " + resultado);
    } catch (error) {
        console.error("Error al calcular:", error);
        document.getElementById("resultado").textContent = "Ocurrió un error al calcular.";
        hablar("Ocurrió un error al calcular");
    }
}

function procesarTextoReconocido(texto) {
    const reemplazos = {
        "más": "+", "menos": "-", "por": "*", "x": "*",
        "entre": "/", "dividido entre": "/", "dividido por": "/", "dividido": "/"
    };

    const numeros = {
        "uno": "1", "dos": "2", "tres": "3", "cuatro": "4", "cinco": "5",
        "seis": "6", "siete": "7", "ocho": "8", "nueve": "9", "diez": "10",
        "once": "11", "doce": "12", "trece": "13", "catorce": "14", "quince": "15",
        "dieciséis": "16", "diecisiete": "17", "dieciocho": "18", "diecinueve": "19", "veinte": "20",
        "cero": "0"
    };

    for (let palabra in reemplazos) {
        texto = texto.replace(new RegExp(palabra, "g"), reemplazos[palabra]);
    }

    for (let palabra in numeros) {
        texto = texto.replace(new RegExp(`\\b${palabra}\\b`, "g"), numeros[palabra]);
    }

    if (texto.includes('raíz cuadrada de')) {
        const numero = parseFloat(texto.split('raíz cuadrada de')[1]);
        return Math.sqrt(numero);
    }

    if (texto.includes('elevado a')) {
        const [base, exponente] = texto.split('elevado a').map(x => parseFloat(x));
        return Math.pow(base, exponente);
    }

    if (texto.includes('logaritmo natural de')) {
        const numero = parseFloat(texto.split('logaritmo natural de')[1]);
        return Math.log(numero);
    }

    if (texto.includes('logaritmo de')) {
        const numero = parseFloat(texto.split('logaritmo de')[1]);
        return Math.log10(numero);
    }

    if (texto.includes('seno de')) {
        const angulo = parseFloat(texto.split('seno de')[1]);
        return Math.sin(grados_a_radianes(angulo));
    }

    if (texto.includes('coseno de')) {
        const angulo = parseFloat(texto.split('coseno de')[1]);
        return Math.cos(grados_a_radianes(angulo));
    }

    if (texto.includes('tangente de')) {
        const angulo = parseFloat(texto.split('tangente de')[1]);
        return Math.tan(grados_a_radianes(angulo));
    }

    if (texto.includes('factorial de')) {
        const numero = parseInt(texto.split('factorial de')[1]);
        return factorial(numero);
    }

    if (texto.includes('por ciento de')) {
        const [porcentaje, total] = texto.split('por ciento de').map(x => parseFloat(x));
        return (porcentaje / 100) * total;
    }

    return eval(texto);
}

function grados_a_radianes(grados) {
    return grados * Math.PI / 180;
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

function hablar(texto) {
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    speechSynthesis.speak(mensaje);
}
