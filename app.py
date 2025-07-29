# archivo: app.py
from flask import Flask, request, render_template
import re

app = Flask(__name__)

def procesar_operacion(texto):
    texto = texto.replace("más", "+")
    texto = texto.replace("menos", "-")
    texto = texto.replace("por", "*")
    texto = texto.replace("entre", "/")

    patron = r'(\d+)\s*([\+\-\*/])\s*(\d+)'
    coincidencia = re.search(patron, texto)
    if coincidencia:
        num1 = int(coincidencia.group(1))
        oper = coincidencia.group(2)
        num2 = int(coincidencia.group(3))

        try:
            if oper == '+':
                resultado = num1 + num2
            elif oper == '-':
                resultado = num1 - num2
            elif oper == '*':
                resultado = num1 * num2
            elif oper == '/':
                if num2 == 0:
                    return "No se puede dividir por cero."
                resultado = num1 / num2
            return f"El resultado es {resultado}"
        except Exception as e:
            return f"Error: {e}"
    else:
        return "No entendí la operación."

@app.route('/', methods=['GET', 'POST'])
def home():
    resultado = ""
    if request.method == 'POST':
        operacion = request.form['operacion']
        resultado = procesar_operacion(operacion)
    return render_template('index.html', resultado=resultado)

if __name__ == '__main__':
    app.run()
