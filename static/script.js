function reconocerVoz() {
    const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    reconocimiento.lang = "es-ES";

    reconocimiento.onresult = function (event) {
        const texto = event.results[0][0].transcript.toLowerCase();
        document.getElementById("expresion").value = texto;
        calcular();
    };

    reconocimiento.start();
}

function calcular() {
    let expresion = document.getElementById("expresion").value.toLowerCase();

    // Diccionarios de reemplazo
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
        "seno de": "Math.sin(grados_a_radianes(",
        "coseno de": "Math.cos(grados_a_radianes(",
        "tangente de": "Math.tan(grados_a_radianes(",
        "pi": "Math.PI",
        "e": "Math.E"
    };

    // Reemplazo de palabras por números
    const numeros = {
        "uno": "1", "dos": "2", "tres": "3", "cuatro": "4", "cinco": "5",
        "seis": "6", "siete": "7", "ocho": "8", "nueve": "9", "diez": "10",
        "once": "11", "doce": "12", "cero": "0"
    };

    // Reemplazar palabras por símbolos y funciones
    for (let palabra in reemplazos) {
        const regex = new RegExp(palabra, "g");
        expresion = expresion.replace(regex, reemplazos[palabra]);
    }

    for (let palabra in numeros) {
        const regex = new RegExp(`\\b${palabra}\\b`, "g");
        expresion = expresion.replace(regex, numeros[palabra]);
    }

    // Cierra funciones trigonométricas si fueron abiertas
    expresion = expresion.replace(/Math\.(sin|cos|tan)\(grados_a_radianes\(([^()]+)\)/g, "Math.$1(grados_a_radianes($2))");

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

function hablar(texto) {
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    speechSynthesis.speak(mensaje);
}
