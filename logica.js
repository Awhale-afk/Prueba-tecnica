let inputNombre = document.getElementById('nombre')
let btnEnviar = document.getElementById('btnEnviar')
let inputProducto = document.getElementById('productoId')
let inputComentarios = document.getElementById('feedback') //Se obtienen los inputs del front//

btnEnviar.addEventListener('click', function (c) { //event.listener relacionado con el botón de enviar para recoger los datos y enviarlos a Google Sheets//
    
    c.preventDefault();

    let valorNombre = inputNombre.value
    let valorProducto = inputProducto.value
    let valorComentarios = inputComentarios.value

    //console.log(`${valorNombre} + ${valorProducto} + ${valorComentarios}`);// console.log para probar que el input recoja los datos

    if (valorProducto == "" || valorNombre == "" || valorComentarios == ""){ //En caso de que uno o más campos estén vacios el programa no permite enviar datos//
        alert('No se puede enviar un campo vacío')                          //Con esto se evita el uso de tokens de manera innecesaria 
        return
    }else{

        alert("Sus comentarios han sido recibidos");
        const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbxBHOaRdCr7qfotrunHBG2psZoDEyxtEq-b_PSS4wCehFI4_msLb3t3PL2ss9s1DBGX/exec" //URL de Apps Script//

        let datos = new URLSearchParams(); //creación de objeto que contiene la información del formulario//
        datos.append("valorNombre", valorNombre);
        datos.append("valorProducto", valorProducto);
        datos.append("valorComentarios", valorComentarios); 

        fetch(URL_SCRIPT, {
            method: 'POST',
            body: datos.toString(),
            mode: 'cors',           //Los datos enviados se convierten a string en forma de URL para que sean legibles para la red//
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
        .then(res => res.json())
        .then(res => console.log("Respuesta del servidor:", res))
        .catch(err => console.log("Petición enviada"));
    }

});

    
    
