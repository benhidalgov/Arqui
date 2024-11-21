# Prototipo/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Esto incluye las URLs de la app 'galenos' directamente en la raíz
    path('', include('galenos.urls')),
    
]
