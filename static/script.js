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
