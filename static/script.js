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
