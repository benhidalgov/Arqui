document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Evitar envío de formulario por defecto

      const usernameField = document.getElementById("username");
      const passwordField = document.getElementById("password");

      // Verificar que los campos no estén vacíos
      if (usernameField && passwordField) {
        const username = usernameField.value;
        const password = passwordField.value;

        // Lógica de validación aquí
        if (username && password) {
          // Puedes agregar lógica de validación o redirección aquí
          // Por ejemplo, redirigir al usuario dependiendo del tipo
          window.location.href = "/crud"; // Reemplaza con la URL correspondiente
        } else {
          alert("Por favor, ingresa un usuario y una contraseña válidos.");
        }
      } else {
        console.error(
          "Los campos de usuario o contraseña no están disponibles"
        );
      }
    });
  } else {
    console.error("Formulario de inicio de sesión no encontrado");
  }
});
document.addEventListener("DOMContentLoaded", function () {
  // Lógica para el formulario de inicio de sesión
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Evitar el envío del formulario por defecto

      const username = document.getElementById("id_username").value;
      const password = document.getElementById("id_password").value;

      // Verificar si las credenciales son correctas
      if (username === "admin" && password === "admin123") {
        // Redirigir a la página del CRUD del admin
        window.location.href = "/crud/dashboard"; // Ajusta esta URL según sea necesario
      } else {
        // Mostrar un mensaje de error si las credenciales son incorrectas
        alert("Credenciales incorrectas. Por favor, intenta nuevamente.");
      }
    });
  } else {
    console.log("Formulario de inicio de sesión no encontrado");
  }

  // Función para cargar pacientes desde la base de datos (vía Django)
  const cargarPacientes = () => {
    const tableBody = document.getElementById("pacientesTableBody");
    tableBody.innerHTML = ""; // Limpiar contenido previo

    pacientes.forEach((paciente, index) => {
      const row = `
          <tr>
            <td>${paciente.rut}</td>
            <td>${paciente.nombre}</td>
            <td>${paciente.direccion}</td>
            <td>${paciente.fecha_nacimiento}</td>
            <td>
              <a href="/crud/${paciente.rut}/editar/" class="btn btn-primary btn-edit">Editar</a>
              <a href="/crud/${paciente.rut}/eliminar/" class="btn btn-danger btn-delete">Eliminar</a>
            </td>
          </tr>
        `;
      tableBody.innerHTML += row;
    });
  };

  // Función para renderizar la tabla de pacientes
  const renderPacientes = () => {
    const tableBody = document.getElementById("pacientesTableBody");
    tableBody.innerHTML = ""; // Limpiar contenido previo

    pacientes.forEach((paciente, index) => {
      const row = `
          <tr>
            <td>${paciente.rut}</td>
            <td>${paciente.nombre}</td>
            <td>${paciente.direccion}</td>
            <td>${paciente.fecha_nacimiento}</td>
            <td>
              <button class="btn btn-primary btn-edit" data-index="${index}">Editar</button>
              <button class="btn btn-danger btn-delete" data-index="${index}">Eliminar</button>
            </td>
          </tr>
        `;
      tableBody.innerHTML += row;
    });
  };

  // Validación del formulario
  const validatePacienteForm = (rut, nombre, direccion, fechaNacimiento) => {
    if (!rut || !nombre || !direccion || !fechaNacimiento) {
      alert("Todos los campos son obligatorios.");
      return false;
    }

    // Validar formato básico de RUT chileno
    const rutRegex = /^[0-9]+-[0-9Kk]$/;
    if (!rutRegex.test(rut)) {
      alert("El RUT no es válido.");
      return false;
    }

    // Validar dígito verificador del RUT
    if (!validateRutChecksum(rut)) {
      alert("El RUT tiene un dígito verificador incorrecto.");
      return false;
    }

    return true;
  };

  // Función para validar el dígito verificador del RUT
  const validateRutChecksum = (rut) => {
    const [numero, digitoVerificador] = rut.split("-");
    let suma = 0;
    let multiplicador = 2;

    // Calcular suma según el algoritmo del RUT chileno
    for (let i = numero.length - 1; i >= 0; i--) {
      suma += parseInt(numero[i], 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvCalculado = 11 - (suma % 11);
    const dv =
      dvCalculado === 11
        ? "0"
        : dvCalculado === 10
        ? "K"
        : dvCalculado.toString();

    return dv.toUpperCase() === digitoVerificador.toUpperCase();
  };

  // Enviar formulario
  document
    .getElementById("pacienteForm")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Prevenir recarga de página

      const rut = document.getElementById("id_rut").value.trim();
      const nombre = document.getElementById("id_nombre").value.trim();
      const direccion = document.getElementById("id_direccion").value.trim();
      const fechaNacimiento = document.getElementById(
        "id_fecha_nacimiento"
      ).value;

      if (!rut || !nombre || !direccion || !fechaNacimiento) {
        alert("Todos los campos son obligatorios.");
        return;
      }

      const nuevoPaciente = { rut, nombre, direccion, fechaNacimiento };

      const index = document.getElementById("paciente-id").value;

      if (index === "") {
        // Crear nuevo paciente (enviar formulario a Django)
        document.getElementById("pacienteForm").action = "/crud/crear/";
        document.getElementById("pacienteForm").submit();
      } else {
        // Actualizar paciente existente (enviar formulario a Django)
        document.getElementById("pacienteForm").action = `/crud/${rut}/editar/`;
        document.getElementById("pacienteForm").submit();
      }

      document.getElementById("pacienteForm").reset(); // Limpiar formulario
      document.getElementById("paciente-id").value = ""; // Limpiar ID
    });

  // Manejo de eventos en la tabla de pacientes (editar y eliminar)
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-edit")) {
      const index = e.target.getAttribute("data-index");
      const paciente = pacientes[index];
      document.getElementById("id_rut").value = paciente.rut;
      document.getElementById("id_nombre").value = paciente.nombre;
      document.getElementById("id_direccion").value = paciente.direccion;
      document.getElementById("id_fecha_nacimiento").value =
        paciente.fecha_nacimiento;
      document.getElementById("paciente-id").value = index; // Almacenar el índice del paciente
    }

    if (e.target.classList.contains("btn-delete")) {
      const index = e.target.getAttribute("data-index");
      const paciente = pacientes[index];
      if (
        confirm(`¿Estás seguro de que quieres eliminar a ${paciente.nombre}?`)
      ) {
        fetch(`/api/pacientes/${paciente.rut}/eliminar/`, { method: "DELETE" })
          .then((response) => response.json())
          .then((data) => {
            alert(data.mensaje); // Mostrar mensaje de éxito
            cargarPacientes(); // Recargar la lista de pacientes
          })
          .catch(() => {
            alert("Error al eliminar el paciente.");
          });
      }
    }
  });

  // Cargar la lista de pacientes al iniciar la página
  cargarPacientes();
});
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Evitar envío de formulario por defecto

      const usernameField = document.getElementById("id_username");
      const passwordField = document.getElementById("id_password");
      const userTypeField = document.getElementById("user-type");

      // Asegurarse de que los campos existan
      if (!usernameField || !passwordField || !userTypeField) {
        console.error("Faltan campos en el formulario");
        return;
      }

      const username = usernameField.value;
      const password = passwordField.value;
      const userType = userTypeField.value;

      // Verificar que los campos no estén vacíos
      if (username && password) {
        if (userType === "admin") {
          // Redirigir a la página de admin
          window.location.href = "/crud"; // Ajusta la ruta según sea necesario
        } else if (userType === "paciente") {
          // Redirigir a la página de paciente
          window.location.href = "/index"; // Ajusta la ruta según sea necesario
        } else {
          console.error("Tipo de usuario no válido");
        }
      } else {
        console.error("Usuario o contraseña no proporcionados");
      }
    });
  } else {
    console.error("Formulario de inicio de sesión no encontrado");
  }
});
