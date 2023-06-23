from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('registration/', views.registration_view, name='registration'),
    path('success/', views.success_view, name='success'),
]
