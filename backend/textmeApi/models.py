# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

class User(models.Model) :
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=10000)
    balance = models.IntegerField(default=5)

    def __str__(self) :
        return self.email

    def spend(self, amount) :
        if amount <= self.balance :
            self.balance -= amount

    def credit(self, amount) :
        self.balance += amount

    def encodePassword(self, password) :
        return password[:4]

    def setPassword(self, password) :
        self.password = self.encodePassword(password)
    
    def checkPassword(self, password) :
        return self.encodePassword(password) == self.password

    def save(self, *args, **kwargs) :
        self.setPassword(self.password)
        super(User, self).save(*args, **kwargs)

class Kart(models.Model) :
    TYPE_NAMES = (
        ("S", "Standard"),
        ("CC", "Cat Cruiser"),
        ("BF", "Blue Falcon")
    )
    typeName = models.CharField(max_length=50, choices=TYPE_NAMES)
    hourly_price = models.IntegerField()

class Booking(models.Model) :
    kart = models.ForeignKey(Kart, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    beginning_date = models.DateField()
    end_date = models.DateField()