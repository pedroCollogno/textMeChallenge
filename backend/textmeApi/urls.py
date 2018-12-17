from django.conf.urls import url

from . import views

urlpatterns = [
    url("home", views.home, name="home"),
    url("login", views.log_in),
    url("register", views.register_user),
    url("test_users", views.all_users)
]