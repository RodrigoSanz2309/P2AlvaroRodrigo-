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
    const inputGPS = document.getElementById("coordenadasGPS").value.trim();
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

    const regexDMS = /([NSEOW])?\s*(\d+)°\s*(\d+)'\s*(\d+(?:\.\d+)?)"\s*([NSEOW])?\s*,\s*([NSEOW])?\s*(\d+)°\s*(\d+)'\s*(\d+(?:\.\d+)?)"\s*([NSEOW])?/i;
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