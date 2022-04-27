const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const pdf = require("html-pdf");
const fs = require("fs");
require("firebase/firestore");
const firebase = require("firebase");
require("firebase/firestore");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "ld780009@gmail.com",
    pass: "panaarrsaqqnsbhf",
  },
});

const firebaseConfig = {
  apiKey: "AIzaSyDiIKpOQNMLK1Bps-FSkXV8jiY_UJO8xQ4",
  authDomain: "carrito-46e66.firebaseapp.com",
  databaseURL: "https://carrito-46e66-default-rtdb.firebaseio.com",
  projectId: "carrito-46e66",
  storageBucket: "carrito-46e66.appspot.com",
  messagingSenderId: "14714150482",
  appId: "1:14714150482:web:b78c8456c60c9a6bbe098b",
  measurementId: "G-8GCRN20B3N",
};

let productos = {};
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
let username = "";
const app = express();
const port = process.env.PORT || "3000";
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '/src')));
app.use(express.static(path.join(__dirname, '/public')));



app.get('/', function(request, response){
  getProductos()
  response.render('index.html',{
    productos
  });
});

app.get('/admin.html', function(request, response){
  response.sendFile(__dirname + '/admin.html');
});
app.use(express.static(path.join(__dirname, 'js/')));


const getProductos = () => {
  db.collection("productos")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        productos[doc.data().id] = doc.data();
      });
    });
};

getProductos();
app.listen(port, () => {
  console.log(`Me estoy ejecuntando en ${port}`);
});

app.get("/productos", function (req, res) {
  res.json(productos);
});

app.post("/registro", function (req, res) {
  let rg = registro(req.body.email, req.body.password);
  let registroPromise = Promise.resolve(rg);
  registroPromise.then((value) => {
    res.json(value);
  });
});

app.post("/login", function (req, res) {
  let log = login(req.body.email, req.body.password);
  let loginPromise = Promise.resolve(log);
  loginPromise.then((value) => {
    res.json(value);
  });
});

app.get("/logout", function (req, res) {
  logout();
  res.json({ msj: "Sesión cerrada" });
});

app.post("/email", function (req, res) {
  crearPdf(req.body);
});

app.post("/loginAdmin", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  if (email == "admin@gmail.com") {
    let log = login(req.body.email, req.body.password);
    let loginPromise = Promise.resolve(log);
    loginPromise.then((value) => {
      if (req.body.email == "admin@gmail.com") {
        res.json(pedidos);
      }
    });
  } else {
    res.json({ noadmin: "Este usuario no es email" });
  }
});

app.post("/pagar/:metodo", function (req, res) {
  const metodo = req.params.metodo;
  const carrito = req.body;
  pagar(carrito, metodo);
});

const emailBienvenidad = (email) => {
  try {
    transporter.sendMail({
      from: '"Tiendita Cervecera" <ld780009@gmail.com>',
      to: email,
      subject: "Bienvenido a la Tiendita Cervecera",
      text: "Hola, bienvenido a nuestra comunidad!",
    });
  } catch (e) {
    console.log(e);
  }
};

const email = () => {
  try {
    transporter.sendMail({
      from: '"Tiendita Cervecera" <ld780009@gmail.com>',
      to: "lduarteperez2@gmail.com",
      subject: "Factura de pago en Tiendita Cervecera",
      text: "Hola, Gracias por tu compra, te enviamos tu factura!",
      attachments: [
        {
          filename: "factura.pdf",
          path: "facturacion/factura.pdf",
          contentType: "application/pdf",
        },
      ],
    });
  } catch (e) {
    console.log(e);
  }
};
let pedidos = {};

const getPedido = () => {
  db.collection("pedidos")
    .get()
    .then((querySnapshot) => {
      let cont = 0;
      querySnapshot.forEach((doc) => {
        pedidos[cont] = doc.data();
        cont++;
      });
    });
};
getPedido();

const observador = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var uid = user.uid;
      username = user.email;
    
      activoUser = 1;
    } else {
      username = "";
      activoUser = 0;
    }
  });
};
observador();

const registro = async (email, password) => {
  try {
    const authResult = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    emailBienvenidad(email);
    return authResult;
  } catch (error) {
    return error;
  }
};

const login = async (email, password) => {
  try {
    const authResult = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    activoUser = 1;
    return authResult;
  } catch (error) {
    return error;
  }
};

const logout = () => {
  firebase.auth().signOut();
  activoUser = 0;
};

const crearPdf = (pedido) => {
  var pdf = require("html-pdf");
  let fecha = pedido.date;
  fecha.setDate(fecha.getDate() + 3);
  let y = fecha.getFullYear();
  let m = fecha.getMonth() + 1;
  let d = fecha.getDate();
  var contenido = `
    <h1 style='text-align:center'>Tiendita cervecera</h1>
    <img style=' display: block;margin: 0px auto;' src='https://media-cdn.tripadvisor.com/media/photo-s/19/7d/16/46/our-craft-beers-pamela.jpg'  >
    <h2 style='text-align:center' >Factura digital</h2>
    <p style='text-align:center'>Productos comprados ${pedido.detalle}</p>
    <p style='text-align:center'>No. de productos comprados: <span>${
      pedido.cantidad
    }</span> </p>
    <p style='text-align:center'>Subtotal comprado: $<span> ${
      pedido.precio
    }</span></p>
    <p style='text-align:center'>Envío : <span>${pedido.envio}</span></span></p>
    <p style='text-align:center'>Total comprado+iva: $<span> ${
      pedido.iva
    }</span></p>
    <p style='text-align:center'>Método de pago : <span>${
      pedido.metodo
    }</span></span></p>
    <p style='text-align:center'>Su pedido llegará: <span> ${
      d + "-" + m + "-" + y
    }</span></p>
    <h1 style='text-align:center'>Gracias por tu compra</h1>
    <h2 style='text-align:center'>DISFRUTALO!!</h2>
    `;

  pdf
    .create(contenido)
    .toFile("./facturacion/factura.pdf", function (err, res) {
      if (err) {
        console.log(err);
      } else {
        email(pedido.user);
      }
    });
};

const pagar = (carrito, metodo) => {
  let pedido = {};
  let date = new Date();
  pedido.date = date;
  pedido.user = username;
  pedido.precio = 0;
  pedido.cantidad = 0;
  pedido.detalle = "";
  Object.values(carrito).forEach((producto) => {
    pedido.precio = producto.precio * producto.cantidad + pedido.precio;
    pedido.cantidad = pedido.cantidad + producto.cantidad;
    pedido.detalle += producto.nombre + " ";
  });
  pedido.iva = pedido.precio + pedido.precio * 0.19;
  if (pedido.iva >= 100000) {
    pedido.envio = "Gratis";
  } else {
    pedido.envio = 10000;
    pedido.iva = pedido.iva + pedido.envio;
  }
  pedido.metodo = metodo;

  db.collection("pedidos").add(pedido);
  crearPdf(pedido);
};
