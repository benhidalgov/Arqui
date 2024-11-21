from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404, render, redirect
# Si usas un formulario para crear o editar paciente
from .forms import PacienteForm
from .models import Paciente
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required, user_passes_test
from django.urls import reverse_lazy
from django.http import HttpResponse
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.http import HttpResponse


from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.http import HttpResponse


from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.http import HttpResponse

def index(request):
    # Lógica para la página de inicio
    return render(request, 'index.html')  # Asegúrate de que index.html exista
def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        # Autenticación del usuario
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)

            # Si el usuario es administrador (ejemplo, staff)
            if user.is_staff:
                # Redirigir al CRUD para administradores
                return redirect('crud_pacientes')

            # Si el usuario es un paciente o cualquier otro usuario
            return redirect('index')  # Redirigir al inicio para todos

        else:
            return HttpResponse("Credenciales incorrectas", status=400)

    return render(request, 'login.html')


def registro_view(request):
    return render(request, 'registro.html')

# Función que verifica si el usuario es administrador


def es_admin(user):
    return user.is_superuser

# Vistas de CRUD para pacientes


class PacienteListView(LoginRequiredMixin, ListView):
    model = Paciente
    template_name = 'dj/crud.html'
    context_object_name = 'pacientes'


class PacienteCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Paciente
    fields = ['rut', 'nombre', 'direccion', 'fecha_nacimiento']
    template_name = 'dj/paciente_form.html'
    success_url = reverse_lazy('crud')

    def test_func(self):
        return self.request.user.role == 'admin'


class PacienteUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Paciente
    fields = ['rut', 'nombre', 'direccion', 'fecha_nacimiento']
    template_name = 'dj/paciente_form.html'
    success_url = reverse_lazy('crud')

    def test_func(self):
        return self.request.user.role == 'admin'


class PacienteDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Paciente
    template_name = 'dj/paciente_confirm_delete.html'
    success_url = reverse_lazy('crud')

    def test_func(self):
        return self.request.user.role == 'admin'

# Vista para mostrar todos los pacientes


@login_required
def paciente_list(request):
    pacientes = Paciente.objects.all()
    if request.method == 'POST':
        form = PacienteForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('paciente_list')
    else:
        form = PacienteForm()
    return render(request, 'paciente_list.html', {'form': form, 'pacientes': pacientes})

# Vista para editar un paciente


@login_required
def paciente_edit(request, pk):
    paciente = get_object_or_404(Paciente, pk=pk)
    if request.method == 'POST':
        form = PacienteForm(request.POST, instance=paciente)
        if form.is_valid():
            form.save()
            return redirect('paciente_list')
    else:
        form = PacienteForm(instance=paciente)
    return render(request, 'paciente_edit.html', {'form': form, 'paciente': paciente})

# Vista para eliminar un paciente


@login_required
def paciente_delete(request, pk):
    paciente = get_object_or_404(Paciente, pk=pk)
    paciente.delete()
    return redirect('crud')  # Redirigir a la lista de pacientes

# Vista CRUD de pacientes (solo administradores)


@user_passes_test(es_admin)
@login_required
def paciente_crud(request):
    pacientes = Paciente.objects.all()
    return render(request, 'galenos/crud.html', {'pacientes': pacientes})

# Función para registrar un nuevo usuario


def quienes_somos_view(request):
    return render(request, 'quienes_somos.html')


def contacto_view(request):
    return render(request, 'contacto.html')


def agenda_view(request):
    return render(request, 'agenda.html')


def index_view(request):
    return render(request, 'index.html')


def agendar_cita_view(request):
    if request.method == "POST":
        nombre = request.POST.get('nombre')
        email = request.POST.get('email')
        telefono = request.POST.get('telefono')
        medico = request.POST.get('medico')
        fecha = request.POST.get('fecha')
        hora = request.POST.get('hora')

        return HttpResponse(f"Cita agendada con éxito para {nombre} el {fecha} a las {hora}.")
    else:
        return redirect('agenda')


@login_required
def crear_paciente(request):
    if request.method == 'POST':
        form = PacienteForm(request.POST)
        if form.is_valid():
            form.save()
            # Redirige al CRUD de pacientes después de guardar
            return redirect('crud')
    else:
        form = PacienteForm()
    return render(request, 'crear_paciente.html', {'form': form})
# Add this view to your views.py file


@login_required
def editar_paciente(request, rut):
    paciente = get_object_or_404(Paciente, rut=rut)
    if request.method == 'POST':
        form = PacienteForm(request.POST, instance=paciente)
        if form.is_valid():
            form.save()
            return redirect('crud')  # Redirect after saving
    else:
        form = PacienteForm(instance=paciente)
    return render(request, 'editar_paciente.html', {'form': form, 'paciente': paciente})


@login_required
def eliminar_paciente(request, rut):
    # Get the patient object using 'rut' as the unique identifier
    paciente = get_object_or_404(Paciente, rut=rut)
    paciente.delete()  # Delete the patient from the database
    # Redirect to the list of patients (or any other page you prefer)
    return redirect('crud')
