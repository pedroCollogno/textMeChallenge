# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from .models import User
from .serializers import UserSerializer
from .forms import UserForm

def home(request) :
    return HttpResponse("This is API home.")

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


def all_users(request) :
    if request.method == "GET" :
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return JsonResponse(serializer.data, status=201, safe=False)
