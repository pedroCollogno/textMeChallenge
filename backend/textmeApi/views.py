# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from rest_framework_jwt.settings import api_settings
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from .models import User, Kart, Booking
from .serializers import UserSerializer, KartSerializer, BookingSerializer
import datetime

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
jwt_decode_handler = api_settings.JWT_DECODE_HANDLER

@csrf_exempt
def log_in(request) :
    if request.method == "POST" :
        data = JSONParser().parse(request)
        serializer = UserSerializer(data = data)
        if serializer.is_valid() :
            try :
                user = User.objects.get(email = data["email"])
            except User.DoesNotExist :
                return HttpResponse("This account doesn't exist")
            if user.check_password(data["password"]) :
                payload = jwt_payload_handler(user.id)
                token = jwt_encode_handler(payload)
                serializer = UserSerializer(user)
                data = serializer.data
                data["token"] = token
                return JsonResponse(data)
            return HttpResponse("Wrong password")
        return JsonResponse(serializer.errors, status = 400)

@csrf_exempt
def register_user(request) :
    if request.method == "POST" :
        data = JSONParser().parse(request)
        serializer = UserSerializer(data = data)
        if serializer.is_valid() :
            try :
                user = User.objects.get(email = data["email"])
                return HttpResponse("This account already exists")
            except User.DoesNotExist :
                serializer.save()
                user = User.objects.get(email = data["email"])
                serializer = UserSerializer(user)
                data = serializer.data
                payload = jwt_payload_handler(data["id"])
                token = jwt_encode_handler(payload)
                data["token"] = token
                return JsonResponse(data, status = 201)
        return JsonResponse(serializer.errors, status = 400)

def all_karts(request) :
    if request.method == "GET" :
        karts = Kart.objects.all()
        serializer = KartSerializer(karts, many=True)
        return JsonResponse(serializer.data, status=201, safe=False)

@csrf_exempt
def user_bookings(request, user_id) :
    if request.method == "POST" :
        try :
            data = JSONParser().parse(request)
        except :
            return HttpResponse("No token given")
        try :
            if int(jwt_decode_handler(data["token"])["payload"])==int(user_id) :
                bookings = Booking.objects.filter(user__id = user_id)
                serializer = BookingSerializer(bookings, many=True)
                return JsonResponse(serializer.data, status=201, safe=False)
            return HttpResponse("You are not authorized")
        except :
            return HttpResponse("Invalid token")

@csrf_exempt
def user_balance(request, user_id) :
    if request.method == "POST" :
        try :
            data = JSONParser().parse(request)
        except :
            return HttpResponse("No token given")
        try :
            user = User.objects.get(id = user_id)
        except User.DoesNotExist :
            return HttpResponse(status=404)
        try :
            if int(jwt_decode_handler(data["token"])["payload"])==int(user_id) :
                serializer = UserSerializer(user)
                return JsonResponse(serializer.data, status=201)
            return HttpResponse("You are not authorized")
        except :
            return HttpResponse("Invalid token")

@csrf_exempt
def increase_user_balance(request, user_id) :
    if request.method == "POST" :
        try :
            user = User.objects.get(id = user_id)
        except User.DoesNotExist :
            return HttpResponse(status=404)
        data = JSONParser().parse(request)
        try :
            if int(jwt_decode_handler(data["token"])["payload"])==int(user_id) :            
                user.credit(int(data["amount"]))
                serializer = UserSerializer(user)
                return JsonResponse(serializer.data, status=201)
            return HttpResponse("You are not authorized")
        except :
            return HttpResponse("Invalid token")


@csrf_exempt
def booked_karts(request) :
    if request.method == "POST" :
        data = JSONParser().parse(request)
        d = datetime.datetime.strptime(data["beginning_time"], "%Y-%m-%d %H")
        bookings = Booking.objects.filter(beginning_time__year = d.year, beginning_time__month = d.month, beginning_time__day = d.day, beginning_time__hour = d.hour)
        serializer = BookingSerializer(bookings, many=True)
        return JsonResponse(serializer.data, status=201, safe=False)

@csrf_exempt
def add_booking(request) :
    if request.method == "POST" :
        data = JSONParser().parse(request)
        try :
            if int(jwt_decode_handler(data["token"])["payload"])==int(data["user"]) :
                serializer = BookingSerializer(data = data)
                if serializer.is_valid() :
                    try :
                        d = datetime.datetime.strptime(data["beginning_time"], "%Y-%m-%d %H:%M")
                        booking = Booking.objects.get(user = data["user"], beginning_time__year = d.year, beginning_time__month = d.month, beginning_time__day = d.day, beginning_time__hour = d.hour)
                        return HttpResponse("You already have a booking for " + booking.beginning_time.__str__())
                    except Booking.DoesNotExist :
                        serializer.save()
                        return JsonResponse(serializer.data, status = 201)
                return JsonResponse(serializer.errors, status = 400)
            return HttpResponse("You are not authorized")
        except :
            return HttpResponse("Invalid token")


@csrf_exempt
def modify_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return HttpResponse(status=404)
    if request.method == 'POST':
        data = JSONParser().parse(request)
        try :
            if int(jwt_decode_handler(data["token"])["payload"])==int(data["user"]) :
                d = datetime.datetime.strptime(data["beginning_time"], "%Y-%m-%d %H:%M")
                booking.reschedule(d)
                serializer = BookingSerializer(booking)
                return JsonResponse(serializer.data, status=201)
            return HttpResponse("You are not authorized")
        except :
            return HttpResponse("Invalid token")

@csrf_exempt
def delete_booking(request, booking_id):
    if request.method == 'POST':
        try :
            data = JSONParser().parse(request)
        except :
            return HttpResponse("No token given")
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return HttpResponse(status=404)
        serializer = BookingSerializer(booking)
        try :
            if int(jwt_decode_handler(data["token"])["payload"])==int(serializer.data["user"]) :
                booking.delete()
                return HttpResponse(status=204)
            return HttpResponse("You are not authorized")
        except :
            return HttpResponse("Invalid token")


@csrf_exempt
def booking_detail(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = BookingSerializer(booking)
        try :
            if int(jwt_decode_handler(data["token"])["payload"])==int(serializer.data["user"]) :
                return JsonResponse(serializer.data)
            return HttpResponse("You are not authorized")
        except :
            return HttpResponse("Invalid token")


"""
DEBUGGING
"""

def reset(request) :
    users = User.objects.all()
    bookings = Booking.objects.all()
    while True :
        try :
            bookings[0].delete()
        except :
            try :
                users[0].delete()
            except :
                break
    return HttpResponse("All has been cleansed")

@csrf_exempt
def add_kart(request) :
    if request.method == "POST" :
        data = JSONParser().parse(request)
        serializer = KartSerializer(data = data)
        if serializer.is_valid() :
            serializer.save()
            return JsonResponse(serializer.data, status = 201)
        return JsonResponse(serializer.errors, status = 400)

