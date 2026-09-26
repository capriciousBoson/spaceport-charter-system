from datetime import time, timedelta
from django.db import models
from zoneinfo import ZoneInfo


CENTRAL = ZoneInfo("America/Chicago")
OPENING_TIME = time(6)
CLOSING_TIME = time(22)
REFUEL_BUFFER = timedelta(minutes=30)

class Ship(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Booking(models.Model):
    ship = models.ForeignKey(
        Ship, 
        on_delete=models.CASCADE, 
        related_name="bookings"
        )
    
    pilot_name = models.CharField(max_length=100)

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return f"{self.ship} | {self.start_time} - {self.end_time}"
        
