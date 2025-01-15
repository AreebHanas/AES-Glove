from django.contrib import admin
from django.urls import path
from .views import authenticate_patient,create_patient,create_exercise,delete_patient,update_patient,delete_exercise,update_exercise,get_patients,get_exercises

urlpatterns = [
    path('authenticate', authenticate_patient),
    path("create_patient",create_patient),
    path("delete_patient",delete_patient),
    path("update_patient",update_patient),
    path("create_exercise",create_exercise),
    path("delete_exercise",delete_exercise),
    path("update_exercise",update_exercise),
    path("get_patients",get_patients),
    path("get_exercises",get_exercises)
]
