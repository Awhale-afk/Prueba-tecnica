const GEMINI_API_KEY = "AIzaSyDzBd3EUW5FR4ADPl7SgLAXNhcUWR2UQP0"; //API KEY de GEMINI//
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY; //Hace el direccionamiento del modelo de IA que se va a utilizar para el procesamiento de los datos y su conexión con la API KEY para desarrollo //

function doPost(e) { //Función que envía el dato de fecha y hora cuando recibe el input del formulario (con la variable marcaTiempo)
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); //Permite la comunicacion con la hoja de cálculo//
  var data = e.parameter; //Variable que contiene la información del objeto e que recibe la variable "datos"  del documento JavaScript del formulario//
  var marcaTiempo = new Date();
  var Sentimiento = "Error";
  var Resumen = "No se pudo generar";

  try { //Bloque que analiza el contenido de columna Comentarios. Si ocurre algún error con el tiempo de respuesta de Gemini se deja por default los valores Neutro y Sin resumen en los campos respectivos //
    
    var analisis = analisisComentarios(data.valorComentarios); 
    if (analisis) {
      Sentimiento = analisis.Sentimiento || "Neutro";
      Resumen = analisis.Resumen || "Sin resumen";
    }
  } catch (error) {
    console.error("Fallo en el análisis: " + error);
  }

  sheet.appendRow([ //Inserta los datos en el orden descrito conforme el mismo que tienen las columnas en la hoja de cálculo//
    marcaTiempo, 
    data.valorNombre, 
    data.valorProducto, 
    data.valorComentarios, 
    Sentimiento, 
    Resumen
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({"result": "success"})) //Devuelve una respuesta de éxito cuando se completa la operación//
    .setMimeType(ContentService.MimeType.JSON);
}

function analisisComentarios(valorComentarios) { //Función que integra a Gemini en la hoja de cálculo para el resumen y análisis del sentimiento//
  const prompt = `Analiza el siguiente comentario de un cliente: "${valorComentarios}." 
  Responde ÚNICAMENTE con un objeto JSON plano, sin bloques de código, sin la palabra "json" y sin texto extra.
  Formato: {"Sentimiento": "Positivo/Neutro/Negativo", "Resumen": "Tu resumen corto aquí"}`;

  const payload = {
    "contents": [{
      "parts": [{"text": prompt}] //Paquete que se le envía a Gemini y contiene el prompt para su funcionamiento//
    }]
  };

  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload), //Aquí se especifica el método para enviar el paquete y se gestionan excepciones Http (Errores de la API de Gemini en caso de que ocurra)
    "muteHttpExceptions": true
  };

  try {
    const response = UrlFetchApp.fetch(GEMINI_URL, options);
    const responseText = response.getContentText();
    const jsonResponse = JSON.parse(responseText); //Convierte el texto en un objeto de Js//
    
    
    let textoIA = jsonResponse.candidates[0].content.parts[0].text; //Dado que el mensaje que da Gemini es por lo general largo, se filtra con los parámetros candidates[0].content.parts[0].text//
    
    
    textoIA = textoIA.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    
    const objetoFinal = JSON.parse(textoIA);
    return objetoFinal;

  } catch (e) {
    console.error("Error de Gemini: " + e);
    return null;
  }
};
