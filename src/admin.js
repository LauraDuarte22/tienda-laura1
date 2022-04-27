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
          data = "";
        } else {
          swal("", "Registro exitoso!", "success");
          addData(chart(), "1", data);
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
    td2.appendChild(document.createTextNode(producto.detalle));
    td3.appendChild(document.createTextNode(producto.envio));
    td4.appendChild(document.createTextNode(producto.iva));
    td5.appendChild(document.createTextNode(producto.metodo));
    td6.appendChild(document.createTextNode(producto.precio));
    td7.appendChild(document.createTextNode(producto.user));

    tablita.appendChild(tabla);
  });
};

const chart = () => {
  const gr = document.getElementById("myChart");
  var ctx = gr.getContext('2d');
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Pedidos,
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255,99,132,1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
};

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}
