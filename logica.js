let inputNombre = document.getElementById('nombre')
let btnEnviar = document.getElementById('btnEnviar')
let inputProducto = document.getElementById('productoId')
let inputComentarios = document.getElementById('feedback')

btnEnviar.addEventListener('click', function (c) {
    
    
    c.preventDefault();

    let valorNombre = inputNombre.value
    let valorProducto = inputProducto.value
    let valorComentarios = inputComentarios.value

    //console.log(`${valorNombre} + ${valorProducto} + ${valorComentarios}`);// console.log para probar que el input recoja los datos

    if (valorProducto == "" || valorNombre == "" || valorComentarios == ""){
        alert('No se puede enviar un campo vacío')
        return
    }else{

        const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbxBHOaRdCr7qfotrunHBG2psZoDEyxtEq-b_PSS4wCehFI4_msLb3t3PL2ss9s1DBGX/exec"

        let datos = new URLSearchParams();
        datos.append("valorNombre", valorNombre);
        datos.append("valorProducto", valorProducto);
        datos.append("valorComentarios", valorComentarios);

        fetch(URL_SCRIPT, {
            method: 'POST',
            body: datos.toString(),
            mode: 'cors',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
        .then(res => res.json())
        .then(res => console.log("Respuesta del servidor:", res))
        .catch(err => console.log("Petición enviada"));
    }

});

    
    
