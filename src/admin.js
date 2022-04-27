
const ingreso = () => {
  var email = document.getElementById("correo-admin").value;
  var password = document.getElementById("password-admin").value;
  fetch("/loginAdmin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  }).then(function (response) {
    response
      .json()
      .then(function (data) {
        if (data.hasOwnProperty("code") || data.hasOwnProperty("noadmin")) {
          swal("Error", "Este usuario no esa administrador", "error");
        } else {
          swal("", "Registro exitoso!", "success");
        table(data)
        }
      })
      .catch(function (e) {
        console.log(e);
      });
  });
};


const table = (data) => {
  var tablita = document.getElementById("tablita");
  var tabla = document.createElement("table");
  Object.values(data).forEach((producto) => {
    const tr = tabla.insertRow();
    const tr1 = tabla.insertRow();
    const tr2 = tabla.insertRow();
    const tr3 = tabla.insertRow();

    const td1 = tr.insertCell();
    const td2 = tr1.insertCell();
    const td3 = tr2.insertCell();
    const td4 = tr3.insertCell();
    const td5 = tr1.insertCell();
    const td6 = tr2.insertCell();
    const td7 = tr3.insertCell();

    td1.appendChild(document.createTextNode(producto.cantidad));
    td3.appendChild(document.createTextNode(producto.envio));
    td4.appendChild(document.createTextNode(producto.iva));
    td5.appendChild(document.createTextNode(producto.metodo));
    td6.appendChild(document.createTextNode(producto.precio));
    td7.appendChild(document.createTextNode(producto.user));

    tablita.appendChild(tabla);
  });
};

const chart = (data) => {
  console.log("aca entra");
  const gr = document.getElementById("myChart");
  var ctx = gr.getContext('2d');
  let pt ={}
  Object.values(data).forEach((producto) => {
        let detalle=producto.detalle;
    Object.values(detalle).forEach((dt,i) => {
      if(dt.prod)
      pt[i]=dt.producto
  });
  });
     console.log(pt);
 
}
  
