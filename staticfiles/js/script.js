document.addEventListener("DOMContentLoaded", () => {
  // Datos de prueba para el CRUD
  let pacientes = [
    {
      rut: "12345678-9",
      nombre: "Juan Pérez",
      direccion: "Calle Falsa 123",
      fechaNacimiento: "1985-06-15",
    },
    {
      rut: "98765432-1",
      nombre: "María López",
      direccion: "Av. Principal 456",
      fechaNacimiento: "1990-08-20",
    },
  ];

  // Renderizar tabla de pacientes
  const renderPacientes = () => {
    const tableBody = document.getElementById("pacientesTableBody");
    tableBody.innerHTML = ""; // Limpiar tabla

    pacientes.forEach((paciente, index) => {
      const row = `
          <tr>
            <td>${paciente.rut}</td>
            <td>${paciente.nombre}</td>
            <td>${paciente.direccion}</td>
            <td>${paciente.fechaNacimiento}</td>
            <td>
              <button class="btn btn-primary btn-edit" data-index="${index}">Editar</button>
              <button class="btn btn-danger btn-delete" data-index="${index}">Eliminar</button>
            </td>
          </tr>
        `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  };

  // Validar formulario
  const validatePacienteForm = (rut, nombre, direccion, fechaNacimiento) => {
    if (!rut || !nombre || !direccion || !fechaNacimiento) {
      alert("Todos los campos son obligatorios.");
      return false;
    }

    // Validar formato de RUT chileno
    const rutRegex = /^[0-9]+-[0-9Kk]$/;
    if (!rutRegex.test(rut)) {
      alert("El RUT no es válido.");
      return false;
    }

    return true;
  };

  // Manejo del formulario de pacientes
  document.getElementById("pacienteForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const rut = document.getElementById("rut").value;
    const nombre = document.getElementById("nombre").value;
    const direccion = document.getElementById("direccion").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const index = document.getElementById("pacienteIndex").value;

    if (!validatePacienteForm(rut, nombre, direccion, fechaNacimiento)) return;

    const nuevoPaciente = { rut, nombre, direccion, fechaNacimiento };

    if (index === "") {
      // Crear nuevo paciente
      pacientes.push(nuevoPaciente);
    } else {
      // Actualizar paciente existente
      pacientes[index] = nuevoPaciente;
    }

    renderPacientes(); // Actualizar tabla
    e.target.reset(); // Limpiar formulario
    document.getElementById("pacienteIndex").value = ""; // Limpiar índice oculto
  });

  // Manejo de eventos en la tabla de pacientes
  document
    .getElementById("pacientesTableBody")
    .addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-edit")) {
        const index = e.target.dataset.index;
        const paciente = pacientes[index];

        // Llenar formulario con datos para editar
        document.getElementById("rut").value = paciente.rut;
        document.getElementById("nombre").value = paciente.nombre;
        document.getElementById("direccion").value = paciente.direccion;
        document.getElementById("fechaNacimiento").value =
          paciente.fechaNacimiento;
        document.getElementById("pacienteIndex").value = index;
      }

      if (e.target.classList.contains("btn-delete")) {
        const index = e.target.dataset.index;
        if (confirm("¿Estás seguro de eliminar este paciente?")) {
          pacientes.splice(index, 1); // Eliminar paciente
          renderPacientes(); // Actualizar tabla
        }
      }
    });

  // Renderizar tabla al cargar la página
  renderPacientes();
});
