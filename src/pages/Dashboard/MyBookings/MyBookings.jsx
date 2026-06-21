const MyBookings = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">
                My Bookings
            </h2>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h3 className="card-title">
                        Dr. Ayesha Rahman
                    </h3>

                    <p>Date: 12 May 2026</p>
                    <p>Time: 10:30 AM</p>

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
        </div>
    );
};

export default MyBookings;