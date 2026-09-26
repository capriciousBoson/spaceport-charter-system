from datetime import datetime

from django.db.models import Count, Q, Prefetch
from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from charters.models import CENTRAL, CLOSING_TIME, OPENING_TIME, REFUEL_BUFFER, Ship, Booking
from charters.serializers import (
    BookingSerializer, 
    ShipSerializer, 
    ShipAvailabilityQuerySerializer,
    BookingListQuerySerializer,)

class BookingPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100

class ShipListView(APIView):
    def get(self, request):
        ships = Ship.objects.annotate(booking_count=Count("bookings")).order_by("id")
        return Response(ShipSerializer(ships, many=True).data)

class ShipDetailView(APIView):
    def get(self, request, ship_id):
        ships = Ship.objects.annotate(booking_count=Count("bookings"))
        ship = get_object_or_404(ships, pk=ship_id)
        return Response(ShipSerializer(ship).data)




class BookingView(APIView):
    def get(self, request):
        query = BookingListQuerySerializer(data=request.query_params)
        query.is_valid(raise_exception=True)

        bookings = Booking.objects.order_by("-start_time", "-id")
        if "ship" in query.validated_data:
            bookings = bookings.filter(ship=query.validated_data["ship"])

        paginator = BookingPagination()
        page = paginator.paginate_queryset(bookings, request, view=self)
        return paginator.get_paginated_response(BookingSerializer(page, many=True).data)


    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class BookingDetailView(APIView):
    def get(self, request, booking_id):
        booking = get_object_or_404(Booking, pk=booking_id)
        return Response(BookingSerializer(booking).data)

class ShipAvailabilityView(APIView):
    def get(self, request):
        query = ShipAvailabilityQuerySerializer(data=request.query_params)
        query.is_valid(raise_exception=True)

        ship, day = query.validated_data["ship"], query.validated_data["date"]

        day_open =  datetime.combine(day, OPENING_TIME, tzinfo=CENTRAL)
        day_close = datetime.combine(day, CLOSING_TIME, tzinfo=CENTRAL)

        bookings = ship.bookings.filter(
            start_time__lt=day_close,
            end_time__gt=day_open
        ).order_by("start_time")

        return Response([
            {
                "start": max(b.start_time - REFUEL_BUFFER, day_open),
                "end": min(b.end_time + REFUEL_BUFFER, day_close),
            }
            for b in bookings
        ])

    