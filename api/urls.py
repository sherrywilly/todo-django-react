from api.views import TodoViewSet
from django.urls import path
from django.urls.conf import include
from rest_framework import routers
router = routers.DefaultRouter()
router.register('',TodoViewSet)
urlpatterns = [
    path('',include(router.urls)),
]
