import re
from django import forms
from django.contrib.auth.forms import AuthenticationForm
from .models import Paciente

# Formulario de Login personalizado


class CustomLoginForm(AuthenticationForm):
    def confirm_login_allowed(self, user):
        if not user.is_active:
            raise forms.ValidationError(
                "Esta cuenta está inactiva.", code='inactive')

# Formulario de Paciente


class PacienteForm(forms.ModelForm):
    class Meta:
        model = Paciente
        fields = ['rut', 'nombre', 'direccion', 'fecha_nacimiento']

    def clean_rut(self):
        rut = self.cleaned_data['rut']
        if not re.match(r'^\d{1,2}\.\d{3}\.\d{3}-[0-9Kk]$', rut):
            raise forms.ValidationError("El RUT no tiene un formato válido.")
        return rut


class PacienteForm(forms.ModelForm):
    class Meta:
        model = Paciente
        fields = ['rut', 'nombre', 'direccion', 'fecha_nacimiento']
