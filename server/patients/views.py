from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.utils.timezone import now
from .models import Patient, SensorData,Doctor,Exercise
from datetime import timedelta
from django.views.decorators.csrf import csrf_exempt
import datetime
import jwt
from django.contrib.auth.hashers import check_password,make_password


SECRET_KEY = "Univercity of Morattuwa ".ljust(32)[:32]


def generate_token(email):
    """Generate a JWT token with an expiration time."""
    payload = {
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token


@csrf_exempt
def authenticate_patient(request):
    email = request.POST.get('email')
    password = request.POST.get('password')
    
    patient_exsist = Patient.objects.filter(email=email).exists()
    doctor_exsist = Doctor.objects.filter(email=email).exists()

    if not patient_exsist and not doctor_exsist:
        return JsonResponse({'message': 'missing', 'error':True}, status=401)
    elif patient_exsist:
        patient = Patient.objects.get(email=email)
        if check_password(password, patient.password):
            token = generate_token(patient.email)
            return JsonResponse({'message': 'success', 'id': patient.id, 'role': 'patient','token':token,'error':False}, status=200)
        else:
            return JsonResponse({'message': 'incorrent','error':True}, status=401)
    elif doctor_exsist:
        doctor = Doctor.objects.get(email=email)
        token = generate_token(doctor.email)
        if  check_password(password, doctor.password):
            return JsonResponse({'message': 'success', 'id': doctor.id, 'role': 'doctor','token':token,'error':False}, status=200)
        else:
            return JsonResponse({'message': 'incorrent','error':True}, status=401)


@csrf_exempt
def create_patient(request):
    email = request.POST.get('email')
    password = request.POST.get('password')
    hashed_password = make_password(password)
    patient = Patient.objects.create(email=email, password=hashed_password)
    return JsonResponse({'message': 'created', 'id': patient.id, 'role': 'patient','error':False}, status=200)

@csrf_exempt
def delete_patient(request):
    patient_id = request.POST.get('patient_id')
    patient = Patient.objects.get(id=patient_id)
    patient.delete()
    return JsonResponse({'status': 'deleted'}, status=200)


@csrf_exempt
def update_patient(request):
    patient_id = request.POST.get('patient_id')
    email = request.POST.get('email')
    password = request.POST.get('password')
    hashed_password = make_password(password)
    patient = Patient.objects.get(id=patient_id) 

    patient.email = email
    patient.password = hashed_password
    patient.save()
    return JsonResponse({'status': 'updated'}, status=200)

@csrf_exempt
def create_exercise(request):
    name = request.POST.get('name')
    url = request.POST.get('url')
    Exercise.objects.create(name=name,video_url=url)
    return JsonResponse({'message': 'created'}, status=200)

@csrf_exempt
def delete_exercise(request):
    exercise_id = request.POST.get('exercise_id')
    exercise = Exercise.objects.get(id=exercise_id)
    exercise.delete()
    return JsonResponse({'status': 'deleted'}, status=200)


@csrf_exempt
def update_exercise(request):
    exercise_id = request.POST.get('exercise_id')
    name = request.POST.get('name')
    url = request.POST.get('url')
    exercise = Exercise.objects.get(id=exercise_id) 

    exercise.name = name
    exercise.video_url = url
    exercise.save()
    return JsonResponse({'status': 'updated'}, status=200)

@csrf_exempt
def get_patients(request):
    patients = Patient.objects.all().values('id', 'email')  # Avoid exposing passwords
    return JsonResponse({'patients': list(patients)})

@csrf_exempt
def get_exercises(request):
    exercises = Exercise.objects.all().values('id', 'name', 'video_url')
    return JsonResponse({'exercises': list(exercises)})


def insert_sensor_data(request):
    patient_id = request.POST.get('patient_id')
    value = request.POST.get('value')

    patient = get_object_or_404(Patient, id=patient_id)
    SensorData.objects.create(patient=patient, value=value)
    return JsonResponse({'message': 'Sensor data stored'}, status=201)




# # 3. Query sensor data
# def query_sensor_data(request):
#     patient_id = request.GET.get('patient_id')
#     query_type = request.GET.get('type')  # 'day', 'week', or 'month'
#     date_filter = now()

#     if query_type == 'day':
#         date_filter -= timedelta(days=1)
#     elif query_type == 'week':
#         date_filter -= timedelta(weeks=1)
#     elif query_type == 'month':
#         date_filter -= timedelta(days=30)
#     else:
#         return JsonResponse({'message': 'Invalid query type'}, status=400)

#     patient = get_object_or_404(Patient, id=patient_id)
#     sensor_data = SensorData.objects.filter(patient=patient, timestamp__gte=date_filter).values('timestamp', 'value')

#     return JsonResponse({'patient_id': patient_id, 'sensor_data': list(sensor_data)}, status=200)
