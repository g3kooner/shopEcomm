from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from base.views import product_views

urlpatterns = [
    path('', product_views.getProducts, name="products"),
    path('create/', product_views.createProduct, name="product_create"),
    path('upload/', product_views.uploadImage, name="image_upload"),
    path('top/', product_views.getTopProducts, name="top_products"),
    path('<str:pk>/', product_views.getProduct, name="product"),
    path('update/<str:pk>/', product_views.updateProduct, name="product_update"),
    path('delete/<str:pk>/', product_views.deleteProduct, name="product_delete"),
] 