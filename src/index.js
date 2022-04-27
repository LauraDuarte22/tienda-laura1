let userActive = 0;

document.addEventListener("DOMContentLoaded", (e) => {
  addProductos();
});

let p = {};
const productos = document.getElementById("productos");

const addProductos = () => {
  fetch("/productos")
    .then(function (response) {
      response
        .json()
        .then(function (data) {
          Object.values(data).forEach((producto) => {
            const template =
              document.getElementById("template-productos").content;
            const fragmento = document.createDocumentFragment();
            template.querySelector("img").setAttribute("src", producto.img);
            template.querySelector("h5").textContent = producto.nombre;
            template.querySelector("p span").textContent = producto.precio;
            template.querySelector("button").dataset.id = producto.id;
            template.querySelector("button").id = producto.id;
            const clone = template.cloneNode(true);
            fragmento.appendChild(clone);
            productos.appendChild(fragmento);
            p[producto.id] = { ...producto };
          });
        })
        .catch(function (e) {
          console.log(e);
        });
    })
    .catch(function (e) {
      console.log(e);
    });
};

let carrito = {};

const addItem = (id) => {
  Object.values(p).forEach((producto) => {
    if (producto.id === parseInt(id)) {
      producto.cantidad = 1;
      if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
      }
      carrito[producto.id] = { ...producto };
      addCarrito();
    }
  });
};

const footer = document.getElementById("footer-carrito");
const addFooter = () => {
  footer.innerHTML = " ";
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacio!</th>`;
    return;
  }
  const template = document.getElementById("template-footer").content;
  const fragmento = document.createDocumentFragment();
  const cantidad = Object.values(carrito).reduce(
    (a, { cantidad }) => a + cantidad,
    0
  );
  const precio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );
  let precioTotal = precio + precio * 0.19 + 10000;
  let envio = "$10000";
  if (precio > 100000) {
    envio = "Gratis";
    precioTotal -= 10000;
  }

  template.querySelectorAll("td")[0].textContent = cantidad;
  template.querySelectorAll("td")[1].textContent = precio;
  template.getElementById("productos").textContent = cantidad;
  template.getElementById("precio").textContent = precio;
  template.getElementById("envio").textContent = envio;
  template.getElementById("precioIva").textContent = precioTotal;
  const clone = template.cloneNode(true);
  fragmento.appendChild(clone);
  footer.appendChild(fragmento);
  const boton = document.getElementById("vaciar-carrito");
  boton.addEventListener("click", () => {
    carrito = {};
    addCarrito();
  });
};

const actionBotones = () => {
  const agregar = document.querySelectorAll("#items .btn-info");
  const eliminar = document.querySelectorAll("#items .btn-danger");

  agregar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const producto = carrito[btn.dataset.id];
      producto.cantidad = carrito[producto.id].cantidad + 1;
      carrito[btn.dataset.id] = { ...producto };
      addCarrito();
    });
  });

  eliminar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const producto = carrito[btn.dataset.id];
      producto.cantidad = carrito[producto.id].cantidad - 1;
      if (producto.cantidad == 0) {
        delete carrito[btn.dataset.id];
      } else {
        carrito[btn.dataset.id] = { ...producto };
      }
      addCarrito();
    });
  });
};

const items = document.getElementById("items");
const addCarrito = () => {
  items.innerHTML = "";
  const template = document.getElementById("template-carrito").content;
  const fragmento = document.createDocumentFragment();
  Object.values(carrito).forEach((producto) => {
    precio = producto.precio * producto.cantidad;
    template.querySelector("th").textContent = producto.nombre;
    template.querySelectorAll("td")[0].textContent = producto.cantidad;
    template.querySelectorAll("td")[1].textContent = precio;

    template.querySelector(".btn-info").dataset.id = producto.id;
    template.querySelector(".btn-danger").dataset.id = producto.id;

    const clone = template.cloneNode(true);
    fragmento.appendChild(clone);
  });
  items.appendChild(fragmento);
  addFooter();
  actionBotones();
};

const formulario = document.getElementById("Buscar");
const btn = document.getElementById("btn-buscar");

btn.addEventListener("click", () => {
  const texto = formulario.value.toLowerCase();
  let cont = 0;
  if (texto.length == 0) addProductos();
  Object.values(p).forEach((producto) => {
    let nombre = producto.Categoria;
    if (nombre.indexOf(texto) !== -1) {
      if (cont == 0) productos.innerHTML = "";
      if (nombre === texto) {
        const template = document.getElementById("template-productos").content;
        const fragmento = document.createDocumentFragment();
        template.querySelector("img").setAttribute("src", producto.img);
        template.querySelector("h5").textContent = producto.nombre;
        template.querySelector("p span").textContent = producto.precio;
        template.querySelector("button").dataset.id = cont;
        const clone = template.cloneNode(true);

        fragmento.appendChild(clone);
        productos.appendChild(fragmento);
        cont = cont + 1;
      }
    }
  });
  if (cont == 0 && texto.length != 0) {
     swal("Error","No tenemos esos productos","error");
  }
});

function registrar() {
  var email = document.getElementById("correo-registro").value;
  var password = document.getElementById("password-registro").value;
  var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  if (!regex.test(email)) {
    swal("Error","correo invalido","error");
  } else {
    fetch("/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    }).then(function (response) {
      response
        .json()
        .then(function (data) {
          if (data.hasOwnProperty("code")) {
             swal("Error",data.message,"error");
          } else {
            swal("Registro exitoso","Inicia sesión","success");
            activo()
          }
        })
        .catch(function (e) {
          console.log(e);
        });
    });
  }
}

function ingreso() {
  let email = document.getElementById("correo").value;
  let password = document.getElementById("password").value;
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  }).then(function (response) {
    response
      .json()
      .then(function (data) {
        console.log(data);
        if (data.hasOwnProperty("code")) {
            swal("Error",data.message,"error");
        } else {
         swal("Ingreso: ","Ingreso exitoso","success");
          userActive = 1;
          activo();
        }
      })
      .catch(function (e) {
        console.log(e);
      });
  });
}

const activo = () => {
  var contenido = document.getElementById("usuario-activo");
  var registro = document.getElementById("registro");
  var admin = document.getElementById("admin");
  admin.textContent =" ";
  registro.innerHTML = "";
  contenido.innerHTML = `
  <button id="logout"class="btn btn-info my-2 my-sm-0" onclick='logout()'>logout</button>
  `;
  activo.innerHTML = "Activo";

};

const logout = () => {
   var admin = document.getElementById("admin");
   admin.textContent ="perfil administrador";
  fetch("/productos")
    .then(function (response) {
      response.json().then(function () {
        const template = document.getElementById("template-registro").content;
        const li = document.getElementById("registro");
        const logout = document.getElementById("usuario-activo");
        const btn = document.getElementById("logout");
        logout.removeChild(btn);
        const fragmento = document.createDocumentFragment();
        const clone = template.cloneNode(true);
        fragmento.appendChild(clone);
        li.appendChild(fragmento);
        userActive = 0;
      });
    })
    .catch(function (e) {
      console.log(e);
    });
};
let selMetodo = "";

const pagar = () => {
  if (userActive == 1) {
    const metodo = document.querySelector('input[name="metodo"]:checked');
    if (metodo) {
      const fragmento = document.createDocumentFragment();
      const detalle = document.getElementById("detalle-metodo");
      const button = document.getElementById("btn-pagar");
      const padreBtn = button.parentNode;
      padreBtn.removeChild(button);
      selMetodo = metodo.value;
      if (selMetodo == "PSE") {
        const template = document.getElementById("template-pse").content;
        const clone = template.cloneNode(true);
        fragmento.appendChild(clone);

        detalle.appendChild(fragmento);
      }
      if (selMetodo == "TC") {
        const template = document.getElementById("template-tc").content;
        const clone = template.cloneNode(true);
        fragmento.appendChild(clone);
        detalle.appendChild(fragmento);
      }
    } else {
      swal("Error","Seleccione un método de pago","error");

    }
  } else swal("Error","Inicia sesión para realizar el pago","error");
};

const checkOut = () => {
  console.log(selMetodo);
  fetch(`/pagar/${selMetodo}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(carrito),
  }).then(function (response) {
      swal("Confirmación pago","Pago exitoso,la facturá se enviará a tu correo","success");
  }) .catch(function (e) {
        swal("error","Pago exitoso,la facturá se enviará a tu correo","success");
    });

};
