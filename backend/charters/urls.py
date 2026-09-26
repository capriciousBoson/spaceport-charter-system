from django.urls import path

from charters.views import BookingView, BookingDetailView,ShipListView, ShipDetailView, ShipAvailabilityView

urlpatterns = [
    path("ships/", ShipListView.as_view()),
    path("ships/<int:ship_id>/", ShipDetailView.as_view()),
    path("bookings/", BookingView.as_view()),
    path("bookings/<int:booking_id>/", BookingDetailView.as_view()),
    path("availability/", ShipAvailabilityView.as_view())
]