import json
from datetime import datetime
from django.db import transaction
from charters.models import Booking, Ship

@transaction.atomic
def seed_db(seed_data_path):
    with open(seed_data_path, encoding="utf-8-sig") as f:
        data  = json.load(f)

    # Handle repeated seeding
    Booking.objects.all().delete()
    Ship.objects.all().delete()

    Ship.objects.bulk_create(
        Ship(
            id=s["id"],
            name=s["name"]
        )
        for s in data["ships"]
    )

    Booking.objects.bulk_create(
        Booking(
            ship_id=b["shipId"],
            pilot_name=b["pilotName"],
            start_time=datetime.fromisoformat(b["startTime"]),
            end_time=datetime.fromisoformat(b["endTime"])
        )
        for b in data["bookings"]
    )
if __name__ == "__main__":
    seed_db(seed_data_path='charters/seed.json')