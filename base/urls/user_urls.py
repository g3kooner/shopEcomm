from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from base.views import user_views

urlpatterns = [
    path('login/', user_views.customTokenObtainPair.as_view(), name='token_obtain_pair'),
    path('register/', user_views.registerUser, name='register'),
    path('profile/', user_views.getUserProfile, name="user_profile"),
    path('profile/update/', user_views.updateUserProfile, name="update_user_profile"),
    path('', user_views.getUsers, name="users"),
    path('<int:pk>/', user_views.getUserById, name="user_id"),
    path('delete/<int:pk>/', user_views.deleteUser, name="user_delete"),
    path('update/<int:pk>/', user_views.updateUser, name="user_update"),
]