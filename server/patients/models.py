from django.db import models

# Patient model
class Patient(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=35)  # Use hashed passwords in production
    
    def __str__(self):
        return self.email


# Doctor model
class Doctor(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=35)

    def __str__(self):
        return self.name


# Sensor data model
class SensorData(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="sensor_data")
    timestamp = models.DateTimeField(auto_now_add=True)
    value = models.FloatField()


# Exercise model
class Exercise(models.Model):
    name = models.CharField(max_length=100) 
    video_url = models.URLField()        
    
    def __str__(self):
        return self.name


class ExerciseAssignment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="exercise_assignments")
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="exercise_assignments")
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name="exercise_assignments")
    repetitions = models.PositiveIntegerField()  # Number of repetitions/sets
    created_at = models.DateTimeField(auto_now_add=True)  # Record creation time
    updated_at = models.DateTimeField(auto_now=True)      # Record update time

    def __str__(self):
        return f"{self.patient.email} - {self.exercise.name} - {self.repetitions} reps"
