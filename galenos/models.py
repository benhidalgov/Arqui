from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


class Usuario(AbstractUser):
    ROLES = (
        ('admin', 'Administrador'),
        ('normal', 'Usuario Normal'),
    )
    role = models.CharField(max_length=10, choices=ROLES, default='normal')

    # Solucionar conflictos de grupos y permisos
    groups = models.ManyToManyField(
        Group,
        related_name='usuario_groups',  # Cambia el related_name
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='usuario_permissions',  # Cambia el related_name
        blank=True,
    )

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Paciente(models.Model):
    rut = models.CharField(max_length=12, unique=True)  # Ejemplo: 12345678-9
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200)
    fecha_nacimiento = models.DateField()

    def __str__(self):
        return f"{self.nombre} - {self.rut}"
