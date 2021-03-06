# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import datetime
from security import pwd_context

class User(models.Model) :
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=10000)
    balance = models.IntegerField(default=5)
    has_set_password = models.BooleanField(default=False)

    def __str__(self) :
        return self.email

    def spend(self, amount) :
        if amount <= self.balance :
            self.balance -= amount
        self.save()

    def credit(self, amount) :
        self.balance += amount
        self.save()

    def encode_password(self, password) :
        return pwd_context.encrypt(password)

    def set_password(self, password) :
        self.password = self.encode_password(password)
    
    def check_password(self, password) :
        return pwd_context.verify(password, self.password)

    def save(self, *args, **kwargs) :
        if not self.has_set_password :
            self.has_set_password = True
            self.set_password(self.password)
        super(User, self).save(*args, **kwargs)


HOURLY_PRICES = {"S" : 10, "CC" : 15, "BF" : 25}

class Kart(models.Model) :
    type_name = models.CharField(max_length=50)
    hourly_price = models.IntegerField(default=10)

    def save(self, *args, **kwargs) :
        self.hourly_price = HOURLY_PRICES[self.type_name]
        super(Kart, self).save(*args, **kwargs)

TYPE_NAMES = { "S" : "Standard", "CC" : "Cat Cruiser", "BF" : "Blue Falcon"}

class Booking(models.Model) :
    kart = models.ForeignKey(Kart, on_delete=models.CASCADE)
    kart_type = models.CharField(max_length=50, default="Standard")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    beginning_time = models.DateTimeField(default = datetime.datetime(2018, 1, 1, 0))
    end_time = models.DateTimeField(default = datetime.datetime(2018, 1, 1, 1))
    book_set = models.CharField(max_length=50, default="1-1-2018-01-01T00:00")
    has_been_created = models.BooleanField(default = False)


    def set_end_time(self) :
        y, m, d, end_hour = self.beginning_time.year, self.beginning_time.month, self.beginning_time.day, self.beginning_time.hour + 1
        if end_hour == 24 : 
            end_hour = 0
            d += 1
        if d == 31 :
            d = 1
            m += 1
        if m == 13 :
            m = 1
            y += 1
        end_time = datetime.datetime(y, m, d, end_hour)
        self.end_time = end_time

    def reschedule(self, new_beginning_time) :
        self.beginning_time = new_beginning_time
        self.save()

    def save(self, *args, **kwargs) :
        self.set_end_time()
        if not self.has_been_created :
            self.has_been_created = True
            self.kart_type = TYPE_NAMES[self.kart.type_name]
            self.kart = Kart.objects.get(id=self.kart.id)
            self.user = User.objects.get(id=self.user.id)
            self.user.spend(self.kart.hourly_price)
        super(Booking, self).save(*args, **kwargs)