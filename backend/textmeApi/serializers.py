from rest_framework import serializers
from .models import User, Kart

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'balance')

class KartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kart
        fields = ('id', 'typeName', 'hourly_price')