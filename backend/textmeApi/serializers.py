from rest_framework import serializers
from .models import User, Kart, Booking

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "password", "balance")

class KartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kart
        fields = ("id", "type_name", "hourly_price")

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ("id", "user", "kart","kart_type", "book_set",  "beginning_time", "end_time")