from rest_framework import serializers
from charters.models import CENTRAL, OPENING_TIME, CLOSING_TIME, REFUEL_BUFFER, Ship, Booking

class ShipSerializer(serializers.ModelSerializer):
    booking_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Ship
        fields = ["id", "name", "booking_count"]

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["id", "ship", "pilot_name", "start_time", "end_time"]

    def validate(self, attrs):
        ship, start, end = attrs["ship"], attrs["start_time"], attrs["end_time"]

        if start >=end:
            raise serializers.ValidationError("end time must be after start  time.")

        local_start, local_end = start.astimezone(CENTRAL), end.astimezone(CENTRAL)
        if (
            local_start.date() != local_end.date()
            or local_start.time() < OPENING_TIME
            or local_end.time() > CLOSING_TIME
        ):
            raise serializers.ValidationError(
                "Bookings must fall within operating hours: 6:00 AM to 10:00 PM Central Time"
            )

        conflict = Booking.objects.filter(
            ship=ship,
            start_time__lt = end + REFUEL_BUFFER,
            end_time__gt=start - REFUEL_BUFFER
        ).exists()

        if conflict:
            raise serializers.ValidationError(
                "This ship is already booked within 30 minutes of the requested time."
            )

        return attrs

class ShipAvailabilityQuerySerializer(serializers.Serializer):
    ship = serializers.PrimaryKeyRelatedField(queryset=Ship.objects.all())
    date = serializers.DateField()

class BookingListQuerySerializer(serializers.Serializer):
    ship = serializers.PrimaryKeyRelatedField(queryset=Ship.objects.all(), required=False)


# class ShipBookingsSerializer(serializers.ModelSerializer):
#     bookings = BookingSerializer(many=True, read_only=True)

#     class Meta:
#         model = Ship
#         fields = ["id", "name", "bookings"]
