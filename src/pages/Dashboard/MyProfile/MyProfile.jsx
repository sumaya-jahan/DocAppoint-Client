const MyProfile = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">
                My Profile
            </h2>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                    <img
                        src="https://i.pravatar.cc/150"
                        alt="profile"
                        className="w-28 h-28 rounded-full"
                    />

                    <h3 className="text-2xl font-bold">
                        Sumaya Jahan
                    </h3>

                    <p>sumaya@gmail.com</p>

                    <button className="btn btn-primary mt-4">
                        Update Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;