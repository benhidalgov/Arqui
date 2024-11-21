from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    # Asegúrate de que esta línea esté en tu archivo de URLs
    path('', views.index, name='index'),  # Redirigir a la vista de inicio
    path('login/', views.login_view, name='login'),
    path('registro/', views.registro_view, name='registro'),
    path('quienes-somos/', views.quienes_somos_view, name='quienes_somos'),
    path('contacto/', views.contacto_view, name='contacto'),
    path('agenda/', views.agenda_view, name='agenda'),
    # Cambié esta línea para que apunte a 'index_view'
    path('index/', views.index_view, name='index'),
    path('agendar-cita/', views.agendar_cita_view, name='agendar_cita'),
    path('crud/', views.paciente_crud, name='crud'),  # Lista de pacientes
    path('crud/crear/', views.crear_paciente,
         name='crear_paciente'),  # Crear paciente
    path('crud/<str:rut>/editar/', views.editar_paciente,
         name='editar_paciente'),  # Editar paciente
    path('crud/<str:rut>/eliminar/', views.eliminar_paciente,
         name='eliminar_paciente'),  # Eliminar paciente
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    path('crud/crear/', views.crear_paciente, name='crear_paciente'),
]
