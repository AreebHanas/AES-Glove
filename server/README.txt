cd server
python manage.py runserver 8001
daphne -b 127.0.0.1 -p 8000 AES_Glove.asgi:application


Note:  Ensure that Redis is installed on your computer and added to your system's environment variables.