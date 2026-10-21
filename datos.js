console.log("datos.js recibido");

function dmsADecimal(direccion, grados, minutos, segundos) {
    let decimal = parseFloat(grados) + (parseFloat(minutos) / 60) + (parseFloat(segundos) / 3600);
    if (direccion) {
        direccion = direccion.toUpperCase();
        if (direccion === 'S' || direccion === 'O' || direccion === 'W') {
            decimal = -decimal;
        }
    }
    return decimal;
}

function generarEnlaceGoogleMaps() {
    const inputGPS = document.getElementById("coordenadasGPS").value.trim()
        .replace(/[º˚]/g, "°")
        .replace(/[’′‘]/g, "'")
        .replace(/[”″“]/g, '"');
    const enlaceMapa = document.getElementById("enlaceMapa");
    const errorGPS = document.getElementById("errorGPS");

    if (!enlaceMapa) return;

    if (inputGPS === "") {
        enlaceMapa.style.display = "none";
        if (errorGPS) errorGPS.style.display = "none";
        return;
    }

    let latitud = null;
    let longitud = null;

    const regexDMS = /^([NSEOW])?\s*(\d+)°\s*(\d+)'\s*(\d+(?:\.\d+)?)"\s*([NSEOW])?\s*,\s*([NSEOW])?\s*(\d+)°\s*(\d+)'\s*(\d+(?:\.\d+)?)"\s*([NSEOW])?$/i;
    const matchDMS = inputGPS.match(regexDMS);

    const regexDecimal = /^([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)$/;
    const matchDecimal = inputGPS.match(regexDecimal);

    if (matchDMS) {
        const dirLat = matchDMS[1] || matchDMS[5] || 'N';
        const dirLon = matchDMS[6] || matchDMS[10] || 'E';

        latitud = dmsADecimal(dirLat, matchDMS[2], matchDMS[3], matchDMS[4]);
        longitud = dmsADecimal(dirLon, matchDMS[7], matchDMS[8], matchDMS[9]);
    } else if (matchDecimal) {
        latitud = parseFloat(matchDecimal[1]);
        longitud = parseFloat(matchDecimal[2]);
    }

    if (latitud !== null && longitud !== null && !isNaN(latitud) && !isNaN(longitud) &&
        latitud >= -90 && latitud <= 90 && longitud >= -180 && longitud <= 180) {

        const latFixed = parseFloat(latitud.toFixed(6));
        const lonFixed = parseFloat(longitud.toFixed(6));

        const urlGoogleMaps = `https://maps.google.com/maps?q=${latFixed},${lonFixed}`;

        enlaceMapa.href = urlGoogleMaps;
        enlaceMapa.textContent = `Ver posición (${latFixed}, ${lonFixed}) en Google Maps`;
        enlaceMapa.style.display = "inline";
        if (errorGPS) errorGPS.style.display = "none";
    } else {
        enlaceMapa.style.display = "none";
        if (errorGPS) errorGPS.style.display = "inline";
    }
}


function validarEmailCadenas() {
    const emailInput = document.getElementById("email").value.trim();
    const resultado = document.getElementById("resultadoEmail");

    if (emailInput === "") {
        resultado.style.color = "red";
        resultado.textContent = "Por favor, introduce un correo electrónico.";
        return;
    }

    // No espacios
    if (emailInput.includes(" ")) {
        resultado.style.color = "red";
        resultado.textContent = "Resultado (Sin Regex): Dirección Inválida";
        return;
    }

    // exactamente una '@'
    const primeraArroba = emailInput.indexOf("@");
    const ultimaArroba = emailInput.lastIndexOf("@");

    if (primeraArroba === -1 || primeraArroba !== ultimaArroba) {
        resultado.style.color = "red";
        resultado.textContent = "Resultado (Sin Regex): Dirección Inválida";
        return;
    }

    // Dividir en usuario y dominio
    const usuario = emailInput.substring(0, primeraArroba);
    const dominio = emailInput.substring(primeraArroba + 1);

    // El usuario no vacío
    if (usuario.length === 0) {
        resultado.style.color = "red";
        resultado.textContent = "Resultado (Sin Regex): Dirección Inválida";
        return;
    }

    // El dominio debe tener al menos un punto y no empezar ni terminar con punto
    if (!dominio.includes(".") || dominio.startsWith(".") || dominio.endsWith(".")) {
        resultado.style.color = "red";
        resultado.textContent = "Resultado (Sin Regex): Dirección Inválida";
        return;
    }

    // Comprobar que ninguna de las partes del dominio esté vacía 
    const partesDominio = dominio.split(".");
    for (let i = 0; i < partesDominio.length; i++) {
        if (partesDominio[i].length === 0) {
            resultado.style.color = "red";
            resultado.textContent = "Resultado (Sin Regex): Dirección Inválida";
            return;
        }
    }

    const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const permitidos = letras + "0123456789-";
    let valido = true;

    const tld =partesDominio[partesDominio.length -1];
    if (tld.length <2) valido =false;
    for (let i=0; i<tld.length;i++){
        if(!letras.includes(tld[i]))valido=false;
    }

    for (let i=0;i<partesDominio.length -1;i++){
        for(let j=0; j<partesDominio[i].length; j++){
            if(!permitidos.includes(partesDominio[i][j]))valido=false;
        }
    }
    if(!valido){
        resultado.style.color ="red";
        resultado.textContent = "Resultado (sin regex): dirección inválida";
        return;
    }

    // Si todo ok
    resultado.style.color = "green";
    resultado.textContent = "Resultado (Sin Regex): Dirección Válida";


}

// Validar Email CON Expresiones Regulares
function validarEmailRegex() {
    const emailInput = document.getElementById("email").value.trim();
    const resultado = document.getElementById("resultadoEmail");

    if (emailInput === "") {
        resultado.style.color = "red";
        resultado.textContent = "Por favor, introduce un correo electrónico.";
        return;
    }

    // Expresión regular que valida: usuario@dominio.tld
    const regexEmail = /^[^\s@]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    if (regexEmail.test(emailInput)) {
        resultado.style.color = "green";
        resultado.textContent = "Resultado (Con Regex): Dirección Válida";
    } else {
        resultado.style.color = "red";
        resultado.textContent = "Resultado (Con Regex): Dirección Inválida";
    }
}


let expresionActual = "";
let unidadActual = "°C";
let resultadoMostrado=false;

function presionarNumero(valor) {
    if (expresionActual==="Error" || resultadoMostrado) {
        expresionActual="";
        resultadoMostrado=false;
    }
    if (expresionActual === "0" && valor !== ".") {
        expresionActual = valor;
    } else {
        expresionActual += valor;
    }
    actualizarPantalla();
}

function presionarOperador(op) {
    if (expresionActual ==="Error")expresionActual="";
    resultadoMostrado=false;
    if (expresionActual==="" &&op==="-"){
        expresionActual="-";
        actualizarPantalla();
        return;
    }
    if (expresionActual==="" || expresionActual ==="-") return;
    expresionActual += " " + op + " ";
    actualizarPantalla();
}

function limpiarPantalla() {
    expresionActual = "";
    resultadoMostrado=false;
    actualizarPantalla();
}

function actualizarPantalla() {
    const pantallaValor = document.getElementById("valorPantalla");
    const pantallaUnidad = document.getElementById("unidadPantalla");

    if (pantallaValor) {
        pantallaValor.textContent = expresionActual || "0";
    }
    if (pantallaUnidad) {
        pantallaUnidad.textContent = unidadActual;
    }
}

function calcularResultado() {
    try {
        if (!expresionActual || expresionActual ==="Error") return;
        let resultado = evaluarExpresion(expresionActual);
        
        if (isNaN(resultado) || !isFinite(resultado)) {
            expresionActual = "Error";
        } else {
            // Redondear a 2 decimales
            expresionActual = Number.isInteger(resultado) ? resultado.toString() : parseFloat(resultado.toFixed(2)).toString();
        }
    } catch (e) {
        expresionActual = "Error";
    }
    resultadoMostrado=true;
    actualizarPantalla();
}

//Convierte la cifra actual en pantalla entre Celsius (°C), Fahrenheit (°F) y Kelvin (K)
 
function convertirA(nuevaUnidad) {
    // Si hay un cálculo pendiente, evaluarlo primero
    if (expresionActual && expresionActual !== "Error") {
        calcularResultado();
    }

    let valor = parseFloat(expresionActual);
    if (isNaN(valor)) return;
    
    let unifActualClean = unidadActual.replace("°", "");

    //Convertir a Celsius 
    let enCelsius = valor;
    if (unifActualClean === "F") {
        enCelsius = (valor - 32) * (5 / 9);
    } else if (unifActualClean === "K") {
        enCelsius = valor - 273.15;
    }
    if (Math.round(enCelsius*100)/100<-273.15){
        expresionActual="Error";
        resultadoMostrado=true;
        actualizarPantalla();
        return;
    }
    if (unifActualClean===nuevaUnidad)return;

    //Convertir desde Celsius a la nueva unidad destino
    let resultadoFinal = enCelsius;
    if (nuevaUnidad === "F") {
        resultadoFinal = (enCelsius * (9 / 5)) + 32;
        unidadActual = "°F";
    } else if (nuevaUnidad === "K") {
        resultadoFinal = enCelsius + 273.15;
        unidadActual = "K";
    } else if (nuevaUnidad === "C") {
        resultadoFinal = enCelsius;
        unidadActual = "°C";
    }

    expresionActual = parseFloat(resultadoFinal.toFixed(2)).toString();
    resultadoMostrado = true;
    actualizarPantalla();
}

function evaluarExpresion(texto){
    const tokens =texto.match(/\d+(?:\.\d+)?|\.\d+|[+\-*/()]/g);
    if (!tokens||tokens.join("") !==texto.replace(/\s+/g, "")){
        throw new Error("Expresión no válida");
    }
    let pos=0;
    
    function expresion (){
        let valor = termino ();
        while (tokens[pos]==="+" || tokens[pos]==="-"){
            const op = tokens[pos++];
            const der =termino();
            valor = (op ==="+") ? valor +der: valor-der;
        }
        return valor;
    }

    function termino(){
        let valor =factor();
        while(tokens[pos]==="*"|| tokens[pos]==="/"){
            const op= tokens[pos++];
            const der =factor();
            valor = (op==="*")? valor *der: valor/der;
        }
        return valor;
    }

    function factor() {
        const t = tokens[pos++];
        if (t === "-") return -factor();
        if (t === "+") return factor();
        if (t === "(") {
            const v = expresion();
            if (tokens[pos++] !== ")") throw new Error("Falta )");
            return v;
        }
        if (t === undefined || isNaN(parseFloat(t))) {
            throw new Error("Expresión no válida");
        }
        return parseFloat(t);
    }

    const resultado = expresion();
    if (pos !== tokens.length) throw new Error("Expresión no válida");
    return resultado;
}