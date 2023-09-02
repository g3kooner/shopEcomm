from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, User, Order, OrderItem, ShippingAddress

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']

    def get_name(self, object):
        name = object.first_name
        if name == '':
            name = object.email
        return name

    def get__id(self, object):
        return object.id

    def get_isAdmin(self, object):
        return object.is_staff

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, object):
        token = RefreshToken.for_user(object)
        return str(token.access_token)

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, object):
        orderItems = object.orderitem_set.all()
        serializer = OrderItemSerializer(orderItems, many=True)
        return serializer.data

    def get_shippingAddress(self, object):
        try:
            address = ShippingAddressSerializer(object.shippingaddress, many=False).data
        except:
            address = False
        items = object.orderitem_set.all()
        return address

    def get_user(self, object):
        user = object.user
        serializer = UserSerializer(user, many=False)
        return serializer.data