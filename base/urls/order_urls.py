from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from base.views import order_views

urlpatterns = [
    path('', order_views.getOrders, name="orders"),
    path('add/', order_views.addOrderItems, name="orders_add"),
    path('myorders/', order_views.getUserOrders, name="user_orders"),
    path('<int:pk>/', order_views.getOrderById, name="get_order"),
    path('<int:pk>/pay/', order_views.updateToPaid, name="pay_order"),
    path('<int:pk>/deliver/', order_views.updateToDelivered, name="deliver_order"),
]