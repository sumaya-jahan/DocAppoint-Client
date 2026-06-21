const bookings = [
    {
        id: 1,
        doctor: "Dr. Ayesha Rahman",
        date: "12 May 2026",
        time: "10:30 AM",
    },
    {
        id: 2,
        doctor: "Dr. Mahmud Hasan",
        date: "18 May 2026",
        time: "02:00 PM",
    },
    {
        id: 3,
        doctor: "Dr. Nusrat Jahan",
        date: "25 May 2026",
        time: "04:30 PM",
    },
];

const MyBookings = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">
                My Bookings
            </h2>

            <div className="space-y-4">
                {bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="card bg-base-100 shadow-xl"
                    >
                        <div className="card-body">
                            <h3 className="card-title">
                                {booking.doctor}
                            </h3>

                            <p>Date: {booking.date}</p>
                            <p>Time: {booking.time}</p>

                            <div className="flex gap-3 mt-4">
                                <button className="btn btn-primary">
                                    Update
                                </button>

                                <button className="btn btn-error">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBookings;