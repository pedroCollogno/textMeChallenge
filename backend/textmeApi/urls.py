from django.conf.urls import url

from . import views

urlpatterns = [
    url("login", views.log_in),
    url("register", views.register_user),
    url("kart_fleet", views.all_karts),
    url("add_booking", views.add_booking),
    url("home", views.home, name="home"),
    url("add_kart", views.add_kart),
    url("test_users", views.all_users),
    url("all_bookings", views.all_bookings),
]