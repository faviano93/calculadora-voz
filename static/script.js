const expresionInput = document.getElementById('expresion');
const resultadoInput = document.getElementById('resultado');

function transformarExpresion(texto) {
    return texto
        .toLowerCase()
        .replace(/más/g, '+')
        .replace(/menos/g, '-')
        .replace(/por/g, '*')
        .replace(/entre/g, '/')
        .replace(/dividido/g, '/')
        .replace(/calcular/g, '') // elimina 'calcular'
        .replace(/uno/g, '1')
        .replace(/dos/g, '2')
        .replace(/tres/g, '3')
        .replace(/cuatro/g, '4')
        .replace(/cinco/g, '5')
        .replace(/seis/g, '6')
        .replace(/siete/g, '7')
        .replace(/ocho/g, '8')
        .replace(/nueve/g, '9')
        .replace(/cero/g, '0')
        .replace(/\s+/g, '');
}

function calcular() {
    const expresion = expresionInput.value;

    fetch('/calcular', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expresion: expresion })
    })
    .then(res => res.json())
    .then(data => {
        if (data.resultado !== undefined) {
            resultadoInput.value = data.resultado;
            leerResultado(data.resultado);
        } else {
            resultadoInput.value = 'Error al calcular';
            leerResultado('Ocurrió un error al calcular');
        }
    })
    .catch(error => {
        resultadoInput.value = 'Error de conexión';
        leerResultado('Hubo un error de conexión');
    });
}

function leerResultado(texto) {
    const voz = new SpeechSynthesisUtterance();
    voz.lang = 'es-ES';
    voz.text = `El resultado es: ${texto}`;
    speechSynthesis.speak(voz);
}

// Reconocimiento de voz
const reconocimientoVoz = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new reconocimientoVoz();
recognition.lang = 'es-ES';
recognition.interimResults = false;

recognition.addEventListener('result', e => {
    const transcripcion = Array.from(e.results)
        .map(resultado => resultado[0])
        .map(resultado => resultado.transcript)
        .join('');

    const textoTransformado = transformarExpresion(transcripcion);
    expresionInput.value = textoTransformado;

    if (transcripcion.toLowerCase().includes("calcular")) {
        calcular();
    }
});

recognition.addEventListener('end', () => {
    recognition.stop();
});

document.getElementById('btnHablar').addEventListener('click', () => {
    recognition.start();
});

