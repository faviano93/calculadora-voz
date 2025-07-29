function reconocerVoz() {
    const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    reconocimiento.lang = "es-ES";

    reconocimiento.onresult = function(event) {
        const texto = event.results[0][0].transcript.toLowerCase();
        document.getElementById("expresion").value = texto;
        calcular(); // calcular automáticamente al reconocer
    };

    reconocimiento.start();
}

function calcular() {
    let expresion = document.getElementById("expresion").value.toLowerCase();

    // Diccionario para reemplazar palabras por símbolos matemáticos
    const reemplazos = {
        "más": "+",
        "menos": "-",
        "por": "*",
        "entre": "/",
        "dividido entre": "/",
        "dividido": "/",
        "x": "*"
    };

    for (let palabra in reemplazos) {
        let regex = new RegExp(`\\b${palabra}\\b`, "g");
        expresion = expresion.replace(regex, reemplazos[palabra]);
    }

    // Reemplazar números escritos con palabras por dígitos (opcional: básico)
    const numeros = {
        "uno": "1", "dos": "2", "tres": "3", "cuatro": "4", "cinco": "5",
        "seis": "6", "siete": "7", "ocho": "8", "nueve": "9", "diez": "10",
        "cero": "0"
    };
    for (let palabra in numeros) {
        let regex = new RegExp(`\\b${palabra}\\b`, "g");
        expresion = expresion.replace(regex, numeros[palabra]);
    }

    try {
        const resultado = eval(expresion);
        if (isNaN(resultado)) throw "Expresión inválida";

        document.getElementById("resultado").textContent = "Resultado: " + resultado;
        hablar("El resultado es " + resultado);
    } catch (error) {
        document.getElementById("resultado").textContent = "Ocurrió un error al calcular.";
        hablar("Ocurrió un error al calcular");
    }
}

function hablar(texto) {
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    speechSynthesis.speak(mensaje);
}
