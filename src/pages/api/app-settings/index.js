/**
 * App Settings API Endpoint
 * Returns global application settings including pricing and calendar slots
 */

export default function handler(req, res) {
  if (req.method === "GET") {
    const settings = [
      {
        "id": 2,
        "name": "bookingCalenderSlotSettings",
        "value": {
          "sundayOff": true,
          "saturdayOff": true,
          "fullClosedDates": [],
          "maxBookingsLimitPerDay": 3,
          "maxBookingLimitOverride": [
            {
              "date": "",
              "limit": 0
            }
          ]
        },
        "createdAt": "2026-03-04T19:43:06.450Z",
        "updatedAt": "2026-03-04T19:43:06.450Z"
      },
      {
        "id": 3,
        "name": "cronSettings",
        "value": {
          "recurringInvoicingDaysBeforeBooking": 3
        },
        "createdAt": "2026-03-12T12:15:32.745Z",
        "updatedAt": "2026-03-12T12:15:32.745Z"
      },
      {
        "id": 1,
        "name": "priceSettings",
        "value": {
          "SQM_TO_SQFT": 10.764,
          "petSurcharge": 5,
          "parkingSurcharge": 10,
          "taxRatePercentage": 25,
          "drivingFeeForOneTimeServices": 10
        },
        "createdAt": "2026-02-18T18:54:07.767Z",
        "updatedAt": "2026-03-30T15:52:21.281Z"
      }
    ];

    return res.status(200).json(settings);
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
