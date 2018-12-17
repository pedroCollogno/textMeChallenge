# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from .models import User, Kart, Booking
from .serializers import UserSerializer, KartSerializer, BookingSerializer
import datetime

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
            return HttpResponse(user.checkPassword(data["password"]))
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
                return JsonResponse(serializer.data, status = 201)
        return JsonResponse(serializer.errors, status = 400)

@csrf_exempt
def add_booking(request) :
    if request.method == "POST" :
        data = JSONParser().parse(request)
        serializer = BookingSerializer(data = data)
        if serializer.is_valid() :
            try :
                d = datetime.datetime.strptime(data["beginning_time"], "%Y-%m-%d %H:%M")
                print(d)
                booking = Booking.objects.get(user = data["user"], beginning_time__year = d.year, beginning_time__month = d.month, beginning_time__day = d.day, beginning_time__hour = d.hour)
                return HttpResponse("User " + str(booking.user.id) + " has already booked kart " + str(booking.kart.id) + " for " + booking.beginning_time.__str__())
            except Booking.DoesNotExist :
                serializer.save()
                return JsonResponse(serializer.data, status = 201)
        return JsonResponse(serializer.errors, status = 400)

def all_karts(request) :
    if request.method == "GET" :
        karts = Kart.objects.all()
        serializer = KartSerializer(karts, many=True)
        return JsonResponse(serializer.data, status=201, safe=False)

"""
DEBUGGING
"""

def home(request) :
    return HttpResponse("This is API home.")

@csrf_exempt
def add_kart(request) :
    if request.method == "POST" :
        data = JSONParser().parse(request)
        serializer = KartSerializer(data = data)
        if serializer.is_valid() :
            serializer.save()
            return JsonResponse(serializer.data, status = 201)
        return JsonResponse(serializer.errors, status = 400)

def all_users(request) :
    if request.method == "GET" :
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return JsonResponse(serializer.data, status=201, safe=False)

def all_bookings(request) :
    if request.method == "GET" :
        bookings = Booking.objects.all()
        serializer = BookingSerializer(bookings, many=True)
        return JsonResponse(serializer.data, status=201, safe=False)
