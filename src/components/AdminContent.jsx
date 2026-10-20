
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "../lib/auth-client";
import { API_URL } from "../lib/api";

const emptyDoctor = {
    name: "",
    specialty: "",
    location: "",
    fee: "",
    rating: "",
    image: "",
    images: "",
    description: "",
    experience: "",
    availability: "",
};

const fields = [
    "name",
    "specialty",
    "location",
    "fee",
    "rating",
    "image",
    "description",
    "experience",
    "availability",
];

function isHttpsURL(value) {
    try {
        const url = new URL(value);
        return url.protocol === "https:" && Boolean(url.hostname);
    } catch {
        return false;
    }
}

function normalizeExperience(value) {
    const match = String(value ?? "")
        .trim()
        .match(/^(\d+(?:\.\d+)?)\s*(?:years?|yrs?)?$/i);

    return match ? match[1] : "";
}

function validateDoctor(form) {
    const errors = {};

    for (const key of ["name", "specialty", "location"]) {
        const value = String(form[key] ?? "").trim();

        if (!value) {
            errors[key] = `${key} is required.`;
        } else if (value.length < 2) {
            errors[key] = "Enter at least 2 characters.";
        } else if (value.length > 120) {
            errors[key] = "Maximum 120 characters allowed.";
        }
    }

    const fee = String(form.fee ?? "").trim();

    if (!fee) {
        errors.fee = "Consultation fee is required.";
    } else if (
        !Number.isFinite(Number(fee)) ||
        !Number.isInteger(Number(fee)) ||
        Number(fee) < 0
    ) {
        errors.fee = "Enter a valid non-negative whole number.";
    }

    const rating = String(form.rating ?? "").trim();

    if (
        rating &&
        (!Number.isFinite(Number(rating)) ||
            Number(rating) < 0 ||
            Number(rating) > 5)
    ) {
        errors.rating = "Rating must be between 0 and 5.";
    }

    const experience = String(form.experience ?? "").trim();

    if (
        experience &&
        (!/^\d+(?:\.\d+)?$/.test(experience) ||
            Number(experience) > 100)
    ) {
        errors.experience =
            "Experience must be between 0 and 100.";
    }

    const mainImage = String(form.image ?? "").trim();

    if (mainImage && !isHttpsURL(mainImage)) {
        errors.image = "Enter a valid HTTPS image URL.";
    }

    const images = String(form.images ?? "")
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);

    if (images.length > 10) {
        errors.images = "Maximum 10 gallery images allowed.";
    } else if (images.some((url) => !isHttpsURL(url))) {
        errors.images = "Every image must have a valid HTTPS URL.";
    }

    if (String(form.description ?? "").length > 2000) {
        errors.description = "Maximum 2000 characters allowed.";
    }

    return errors;
}

function Bar({ label, count, max }) {
    return (
        <div className="space-y-1 mb-3">
            <div className="flex justify-between gap-3 text-sm">
                <span>{label || "Unknown"}</span>
                <strong>{count}</strong>
            </div>

            <div className="h-4 rounded bg-base-300 overflow-hidden">
                <div
                    className="h-full bg-primary"
                    style={{
                        width: `${(Number(count) / Math.max(1, max)) * 100}%`,
                    }}
                />
            </div>
        </div>
    );
}

function StatCards({ overview }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
                ["Doctors", overview.doctors],
                ["Appointments", overview.appointments],
                ["Users", overview.users],
                ["Messages", overview.contacts],
            ].map(([label, value]) => (
                <div
                    key={label}
                    className="rounded-xl bg-base-200 p-5"
                >
                    <p>{label}</p>
                    <strong className="text-3xl">{value ?? 0}</strong>
                </div>
            ))}
        </div>
    );
}

function ReportContent({ overview, onRefresh, onExport, loading }) {
    if (!overview) {
        return <p>Loading reports...</p>;
    }

    const months = overview.byMonth || [];
    const specialties = overview.bySpecialty || [];
    const statuses = overview.byStatus || [];

    const maxMonth = Math.max(
        1,
        ...months.map((item) => Number(item.count) || 0)
    );

    const maxSpecialty = Math.max(
        1,
        ...specialties.map((item) => Number(item.count) || 0)
    );

    const totalStatus = statuses.reduce(
        (sum, item) => sum + Number(item.count || 0),
        0
    );

    const colors = ["#0d9488", "#2563eb", "#d97706", "#7c3aed"];

    let offset = 0;

    const pieStops = statuses
        .map((item, index) => {
            const start = offset;
            offset += totalStatus
                ? (Number(item.count || 0) / totalStatus) * 100
                : 0;

            return `${colors[index % colors.length]} ${start}% ${offset}%`;
        })
        .join(", ");

    const points = months
        .map((item, index) => {
            const x =
                months.length === 1
                    ? 50
                    : 5 + (index * 90) / (months.length - 1);

            const y =
                95 - (Number(item.count || 0) / maxMonth) * 85;

            return `${x},${y}`;
        })
        .join(" ");

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-2xl font-bold">Live Reports</h2>

                <div className="flex gap-2">
                    <button
                        className="btn btn-outline"
                        onClick={onRefresh}
                        disabled={loading}
                        type="button"
                    >
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={onExport}
                        disabled={loading}
                        type="button"
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            <StatCards overview={overview} />

            <div className="grid md:grid-cols-2 gap-5">
                <section className="bg-base-200 rounded-xl p-5">
                    <h3 className="font-bold mb-4">
                        Monthly Appointments
                    </h3>

                    {months.length ? (
                        <>
                            <svg
                                viewBox="0 0 100 100"
                                width="100%"
                                height="200"
                                role="img"
                                aria-label="Monthly appointment line chart"
                            >
                                <path
                                    d="M5 95 H95"
                                    stroke="currentColor"
                                    strokeWidth="0.5"
                                    fill="none"
                                />

                                <polyline
                                    points={points}
                                    fill="none"
                                    stroke="#0d9488"
                                    strokeWidth="1.7"
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>

                            <div className="text-sm">
                                {months.map((item) => (
                                    <Bar
                                        key={item._id}
                                        label={item._id}
                                        count={item.count}
                                        max={maxMonth}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <p>No monthly data available.</p>
                    )}
                </section>

                <section className="bg-base-200 rounded-xl p-5">
                    <h3 className="font-bold mb-4">
                        Doctors by Specialty
                    </h3>

                    {specialties.length ? (
                        specialties.map((item) => (
                            <Bar
                                key={item._id}
                                label={item._id}
                                count={item.count}
                                max={maxSpecialty}
                            />
                        ))
                    ) : (
                        <p>No specialty data available.</p>
                    )}
                </section>

                <section className="bg-base-200 rounded-xl p-5">
                    <h3 className="font-bold mb-4">
                        Appointment Status
                    </h3>

                    {totalStatus > 0 ? (
                        <>
                            <div
                                role="img"
                                aria-label="Appointment status pie chart"
                                className="w-40 h-40 rounded-full mx-auto mb-5"
                                style={{
                                    background: `conic-gradient(${pieStops})`,
                                }}
                            />

                            {statuses.map((item, index) => (
                                <div
                                    key={item._id}
                                    className="flex justify-between mb-2 text-sm"
                                >
                                    <span>
                                        <span
                                            className="inline-block w-3 h-3 mr-2"
                                            style={{
                                                background:
                                                    colors[index % colors.length],
                                            }}
                                        />
                                        {item._id}
                                    </span>

                                    <strong>{item.count}</strong>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>No appointment status data available.</p>
                    )}
                </section>
            </div>
        </div>
    );
}

function SettingsContent({ user, navigate }) {
    return (
        <section className="space-y-5">
            <h2 className="text-2xl font-bold">
                Admin Settings
            </h2>

            <div className="bg-base-200 rounded-xl p-5 space-y-3">
                <h3 className="font-semibold text-lg">
                    Account Information
                </h3>
                <p>Name: {user?.name || "Not provided"}</p>
                <p>Email: {user?.email || "Not available"}</p>

                <Link href="/dashboard" className="btn btn-primary">
                    Edit Profile
                </Link>
            </div>

            <div className="bg-base-200 rounded-xl p-5 space-y-3">
                <h3 className="font-semibold text-lg">
                    Account Security
                </h3>

                <Link
                    href="/forgot-password"
                    className="btn btn-outline"
                >
                    Reset Password
                </Link>
            </div>

            <div className="bg-base-200 rounded-xl p-5 space-y-3">
                <h3 className="font-semibold text-lg">
                    Doctor Management
                </h3>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate("Doctors")}
                >
                    Manage Doctors
                </button>
            </div>

            <div className="bg-base-200 rounded-xl p-5 space-y-3">
                <h3 className="font-semibold text-lg">
                    Reports
                </h3>

                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => navigate("Reports")}
                >
                    Open Reports
                </button>
            </div>

            <div className="bg-base-200 rounded-xl p-5 space-y-3">
                <h3 className="font-semibold text-lg">
                    Messages
                </h3>

                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => navigate("Messages")}
                >
                    View Messages
                </button>
            </div>
        </section>
    );
}

export default function AdminContent() {
    const { data: session, isPending } = useSession();

    const [role, setRole] = useState(null);
    const [section, setSection] = useState("Overview");
    const [overview, setOverview] = useState(null);
    const [table, setTable] = useState(null);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const [doctorSortBy, setDoctorSortBy] = useState("name");
    const [doctorOrder, setDoctorOrder] = useState("asc");

    const [userSortBy, setUserSortBy] = useState("createdAt");
    const [userOrder, setUserOrder] = useState("desc");

    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ ...emptyDoctor });
    const [fieldErrors, setFieldErrors] = useState({});

    const [busy, setBusy] = useState(false);
    const [reportBusy, setReportBusy] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const formRef = useRef(null);

    async function request(path, options = {}) {
        const response = await fetch(`${API_URL}${path}`, {
            credentials: "include",
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                data.message || `Request failed (${response.status})`
            );
        }

        return data;
    }

    useEffect(() => {
        if (!session?.user) {
            setRole(null);
            return;
        }

        let active = true;

        request("/api/me/role")
            .then((value) => {
                if (active) setRole(value.role);
            })
            .catch(() => {
                if (active) setRole("user");
            });

        return () => {
            active = false;
        };
    }, [session?.user?.id]);

    useEffect(() => {
        if (role !== "admin") return;

        let active = true;

        request("/api/admin/overview")
            .then((data) => {
                if (active) setOverview(data);
            })
            .catch((err) => {
                if (active) setError(err.message);
            });

        return () => {
            active = false;
        };
    }, [role, success]);

    useEffect(() => {
        if (
            role !== "admin" ||
            ["Overview", "Reports", "Settings"].includes(section)
        ) {
            return;
        }

        let active = true;
        setBusy(true);

        const endpoint =
            section === "Doctors"
                ? "doctors"
                : section === "Users"
                    ? "users"
                    : "contacts";

        const query = new URLSearchParams({
            page: String(page),
        });

        if (section === "Doctors") {
            if (search.trim()) {
                query.set("search", search.trim());
            }

            query.set("sortBy", doctorSortBy);
            query.set("order", doctorOrder);
        }

        if (section === "Users") {
            query.set("sortBy", userSortBy);
            query.set("order", userOrder);
        }

        request(`/api/admin/${endpoint}?${query.toString()}`)
            .then((data) => {
                if (active) setTable(data);
            })
            .catch((err) => {
                if (active) setError(err.message);
            })
            .finally(() => {
                if (active) setBusy(false);
            });

        return () => {
            active = false;
        };
    }, [
        role,
        section,
        page,
        search,
        doctorSortBy,
        doctorOrder,
        userSortBy,
        userOrder,
        success,
    ]);

    useEffect(() => {
        if (editing !== null && section === "Doctors") {
            formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [editing, section]);

    function navigate(tab) {
        setSection(tab);
        setPage(1);
        setSearch("");
        setTable(null);
        setError("");
        setSuccess("");
        setEditing(null);
        setFieldErrors({});
    }

    function updateField(key, value) {
        setForm((previous) => ({
            ...previous,
            [key]: value,
        }));

        setFieldErrors((previous) => ({
            ...previous,
            [key]: undefined,
        }));

        setError("");
    }

    function openAdd() {
        setForm({ ...emptyDoctor });
        setFieldErrors({});
        setEditing({});
        setError("");
        setSuccess("");
    }

    function openEdit(doctor) {
        const values = Object.fromEntries(
            Object.keys(emptyDoctor).map((key) => {
                let value = doctor[key] ?? "";

                if (key === "images") {
                    value = Array.isArray(doctor.images)
                        ? doctor.images.join("\n")
                        : "";
                }

                if (key === "availability") {
                    value = Array.isArray(doctor.availability)
                        ? doctor.availability.join("\n")
                        : doctor.availability ?? "";
                }

                if (key === "experience") {
                    value = normalizeExperience(doctor.experience);
                }

                return [key, value];
            })
        );

        setForm(values);
        setFieldErrors({});
        setEditing(doctor);
        setError("");
        setSuccess("");
    }

    async function save(event) {
        event.preventDefault();

        if (busy) return;

        const errors = validateDoctor(form);
        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            setError("Please correct the highlighted fields.");
            setSuccess("");
            return;
        }

        setBusy(true);
        setError("");
        setSuccess("");

        try {
            const images = [
                ...new Set(
                    String(form.images ?? "")
                        .split(/\r?\n/)
                        .map((value) => value.trim())
                        .filter(Boolean)
                ),
            ];

            const input = {
                ...form,
                name: String(form.name).trim(),
                specialty: String(form.specialty).trim(),
                location: String(form.location).trim(),
                fee: Number(form.fee),
                images,
            };

            if (String(form.rating).trim()) {
                input.rating = Number(form.rating);
            } else {
                delete input.rating;
            }

            if (String(form.experience).trim()) {
                input.experience = Number(form.experience);
            } else {
                delete input.experience;
            }

            const slots = String(form.availability ?? "")
                .split(/\r?\n/)
                .map((item) => item.trim())
                .filter(Boolean);

            if (slots.length) {
                input.availability = Array.isArray(editing?.availability)
                    ? slots
                    : slots.join("\n");
            } else {
                delete input.availability;
            }

            if (!input.image) delete input.image;
            if (!input.description) delete input.description;

            const isEdit = Boolean(editing?.id);

            await request(
                isEdit
                    ? `/api/admin/doctors/${editing.id}`
                    : "/api/admin/doctors",
                {
                    method: isEdit ? "PATCH" : "POST",
                    body: JSON.stringify(input),
                }
            );

            setEditing(null);
            setForm({ ...emptyDoctor });
            setFieldErrors({});
            setSuccess(
                isEdit
                    ? "Doctor updated successfully!"
                    : "Doctor added successfully!"
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    async function remove(id) {
        if (!window.confirm("Delete this doctor permanently?")) {
            return;
        }

        setBusy(true);
        setError("");
        setSuccess("");

        try {
            await request(`/api/admin/doctors/${id}`, {
                method: "DELETE",
            });

            setEditing(null);
            setSuccess("Doctor deleted successfully!");
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    async function refreshReports() {
        setReportBusy(true);
        setError("");

        try {
            const data = await request("/api/admin/overview");
            setOverview(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setReportBusy(false);
        }
    }

    function exportCSV() {
        if (!overview) return;

        const rows = [
            ["Report", "Category", "Count"],
            ["Summary", "Doctors", overview.doctors],
            ["Summary", "Appointments", overview.appointments],
            ["Summary", "Users", overview.users],
            ["Summary", "Messages", overview.contacts],
            ...(overview.byMonth || []).map((item) => [
                "Monthly Appointments",
                item._id,
                item.count,
            ]),
            ...(overview.bySpecialty || []).map((item) => [
                "Doctor Specialties",
                item._id,
                item.count,
            ]),
            ...(overview.byStatus || []).map((item) => [
                "Appointment Status",
                item._id,
                item.count,
            ]),
        ];

        const csv = rows
            .map((row) =>
                row
                    .map((cell) => {
                        const value = String(cell ?? "");
                        const safe = /^\s*[=+\-@]/.test(value)
                            ? `'${value}`
                            : value;

                        return `"${safe.replaceAll('"', '""')}"`;
                    })
                    .join(",")
            )
            .join("\r\n");

        const blob = new Blob(["\uFEFF", csv], {
            type: "text/csv;charset=utf-8",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "docappoint-reports.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    if (isPending || (session?.user && role === null)) {
        return <p className="p-8">Checking access...</p>;
    }

    if (!session?.user) {
        return (
            <p className="p-8">
                Please{" "}
                <Link href="/login" className="link">
                    sign in
                </Link>{" "}
                to continue.
            </p>
        );
    }

    if (role !== "admin") {
        return (
            <section className="max-w-xl mx-auto p-8">
                <h1 className="text-2xl font-bold">
                    Admin access required
                </h1>

                <p>
                    Your account does not have administrator permissions.
                </p>

                <Link href="/dashboard" className="btn mt-4">
                    Return to dashboard
                </Link>
            </section>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-6">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-6">
                <aside className="bg-base-200 rounded-xl p-3 flex flex-col gap-2">
                    {[
                        "Overview",
                        "Doctors",
                        "Users",
                        "Reports",
                        "Messages",
                        "Settings",
                    ].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            className={`btn justify-start ${section === tab
                                    ? "btn-primary"
                                    : "btn-ghost"
                                }`}
                            onClick={() => navigate(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </aside>

                <main className="min-w-0 space-y-6">
                    {error && (
                        <div className="alert alert-error" role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success" role="status">
                            {success}
                        </div>
                    )}

                    {section === "Overview" && (
                        <>
                            {!overview ? (
                                <p>Loading statistics...</p>
                            ) : (
                                <>
                                    <StatCards overview={overview} />

                                    <ReportContent
                                        overview={overview}
                                        onRefresh={refreshReports}
                                        onExport={exportCSV}
                                        loading={reportBusy}
                                    />
                                </>
                            )}
                        </>
                    )}

                    {section === "Doctors" && (
                        <>
                            <div className="flex flex-wrap gap-3 items-end justify-between">
                                <label className="form-control">
                                    <span className="label-text">
                                        Search Doctor
                                    </span>

                                    <input
                                        className="input input-bordered"
                                        value={search}
                                        onChange={(event) => {
                                            setSearch(event.target.value);
                                            setPage(1);
                                        }}
                                        placeholder="Doctor name"
                                    />
                                </label>

                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={openAdd}
                                >
                                    Add Doctor
                                </button>
                            </div>

                            {editing !== null && (
                                <form
                                    ref={formRef}
                                    onSubmit={save}
                                    noValidate
                                    className="bg-base-200 rounded-xl p-5 grid sm:grid-cols-2 gap-4"
                                >
                                    <h2 className="col-span-full text-xl font-bold">
                                        {editing?.id
                                            ? "Edit Doctor"
                                            : "Add New Doctor"}
                                    </h2>

                                    {fields.map((key) => {
                                        const label =
                                            key.charAt(0).toUpperCase() +
                                            key.slice(1);

                                        const isNumber = [
                                            "fee",
                                            "rating",
                                            "experience",
                                        ].includes(key);

                                        const isMultiline = [
                                            "description",
                                            "availability",
                                        ].includes(key);

                                        return (
                                            <label
                                                key={key}
                                                className="form-control flex flex-col gap-1"
                                            >
                                                <span className="label-text font-medium">
                                                    {label}
                                                    {[
                                                        "name",
                                                        "specialty",
                                                        "location",
                                                        "fee",
                                                    ].includes(key) && " *"}
                                                </span>

                                                {isMultiline ? (
                                                    <textarea
                                                        className={`textarea textarea-bordered w-full min-h-24 ${fieldErrors[key]
                                                                ? "textarea-error"
                                                                : ""
                                                            }`}
                                                        value={form[key] ?? ""}
                                                        maxLength={
                                                            key === "description"
                                                                ? 2001
                                                                : undefined
                                                        }
                                                        onChange={(event) =>
                                                            updateField(
                                                                key,
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder={
                                                            key === "availability"
                                                                ? "One availability slot per line"
                                                                : "Doctor description"
                                                        }
                                                        aria-invalid={Boolean(fieldErrors[key])}
                                                    />
                                                ) : (
                                                    <input
                                                        className={`input input-bordered w-full ${fieldErrors[key]
                                                                ? "input-error"
                                                                : ""
                                                            }`}
                                                        type={
                                                            isNumber
                                                                ? "number"
                                                                : key === "image"
                                                                    ? "url"
                                                                    : "text"
                                                        }
                                                        min={
                                                            isNumber ? 0 : undefined
                                                        }
                                                        max={
                                                            key === "rating"
                                                                ? 5
                                                                : key === "experience"
                                                                    ? 100
                                                                    : undefined
                                                        }
                                                        step={
                                                            key === "rating"
                                                                ? "0.1"
                                                                : key === "fee"
                                                                    ? "1"
                                                                    : "any"
                                                        }
                                                        value={form[key] ?? ""}
                                                        onChange={(event) =>
                                                            updateField(
                                                                key,
                                                                event.target.value
                                                            )
                                                        }
                                                        aria-invalid={Boolean(fieldErrors[key])}
                                                    />
                                                )}

                                                {fieldErrors[key] && (
                                                    <span
                                                        className="text-error text-sm"
                                                        role="alert"
                                                    >
                                                        {fieldErrors[key]}
                                                    </span>
                                                )}
                                            </label>
                                        );
                                    })}

                                    <label className="form-control col-span-full flex flex-col gap-2">
                                        <span className="label-text font-medium">
                                            Gallery Images (one HTTPS URL per line)
                                        </span>

                                        <textarea
                                            className={`textarea textarea-bordered w-full min-h-32 ${fieldErrors.images
                                                    ? "textarea-error"
                                                    : ""
                                                }`}
                                            value={form.images}
                                            onChange={(event) =>
                                                updateField(
                                                    "images",
                                                    event.target.value
                                                )
                                            }
                                            placeholder={
                                                "https://example.com/photo-1.jpg\nhttps://example.com/photo-2.jpg"
                                            }
                                            aria-invalid={Boolean(fieldErrors.images)}
                                        />

                                        <span className="text-sm opacity-70">
                                            Maximum 10 gallery images.
                                        </span>

                                        {fieldErrors.images && (
                                            <span
                                                className="text-error text-sm"
                                                role="alert"
                                            >
                                                {fieldErrors.images}
                                            </span>
                                        )}
                                    </label>

                                    <div className="col-span-full flex gap-3">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={busy}
                                        >
                                            {busy
                                                ? "Saving..."
                                                : editing?.id
                                                    ? "Update Doctor"
                                                    : "Save Doctor"}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn"
                                            disabled={busy}
                                            onClick={() => {
                                                setEditing(null);
                                                setFieldErrors({});
                                                setError("");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="bg-base-200 rounded-xl p-4 flex flex-wrap gap-3">
                                <label className="form-control flex-1 min-w-36">
                                    <span className="label-text">
                                        Sort Doctors By
                                    </span>

                                    <select
                                        className="select select-bordered w-full"
                                        value={doctorSortBy}
                                        onChange={(event) => {
                                            setDoctorSortBy(event.target.value);
                                            setPage(1);
                                        }}
                                    >
                                        <option value="name">Name</option>
                                        <option value="specialty">Specialty</option>
                                        <option value="location">Location</option>
                                        <option value="fee">Consultation Fee</option>
                                        <option value="rating">Rating</option>
                                    </select>
                                </label>

                                <label className="form-control flex-1 min-w-36">
                                    <span className="label-text">Order</span>

                                    <select
                                        className="select select-bordered w-full"
                                        value={doctorOrder}
                                        onChange={(event) => {
                                            setDoctorOrder(event.target.value);
                                            setPage(1);
                                        }}
                                    >
                                        <option value="asc">
                                            Ascending (A-Z / Low-High)
                                        </option>
                                        <option value="desc">
                                            Descending (Z-A / High-Low)
                                        </option>
                                    </select>
                                </label>
                            </div>
                        </>
                    )}

                    {section === "Users" && (
                        <div className="bg-base-200 rounded-xl p-4 flex flex-wrap gap-3">
                            <label className="form-control flex-1 min-w-36">
                                <span className="label-text">
                                    Sort Users By
                                </span>

                                <select
                                    className="select select-bordered w-full"
                                    value={userSortBy}
                                    onChange={(event) => {
                                        setUserSortBy(event.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <option value="createdAt">
                                        Registration Date
                                    </option>
                                    <option value="name">Name</option>
                                    <option value="email">Email</option>
                                </select>
                            </label>

                            <label className="form-control flex-1 min-w-36">
                                <span className="label-text">Order</span>

                                <select
                                    className="select select-bordered w-full"
                                    value={userOrder}
                                    onChange={(event) => {
                                        setUserOrder(event.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <option value="desc">Descending</option>
                                    <option value="asc">Ascending</option>
                                </select>
                            </label>
                        </div>
                    )}

                    {["Doctors", "Users", "Messages"].includes(section) && (
                        <>
                            <div className="overflow-x-auto rounded-xl border border-base-300">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            {(
                                                section === "Doctors"
                                                    ? [
                                                        "Name",
                                                        "Specialty",
                                                        "Location",
                                                        "Fee",
                                                        "Actions",
                                                    ]
                                                    : section === "Users"
                                                        ? [
                                                            "Name",
                                                            "Email",
                                                            "Verified",
                                                            "Joined",
                                                        ]
                                                        : [
                                                            "Name",
                                                            "Email",
                                                            "Subject",
                                                            "Date",
                                                        ]
                                            ).map((item) => (
                                                <th key={item}>{item}</th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {(table?.items || []).map((row) => (
                                            <tr key={row._id}>
                                                {section === "Doctors" ? (
                                                    <>
                                                        <td>{row.name}</td>
                                                        <td>{row.specialty}</td>
                                                        <td>{row.location}</td>
                                                        <td>{row.fee}</td>
                                                        <td>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-xs"
                                                                    onClick={() => openEdit(row)}
                                                                >
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-xs btn-error"
                                                                    disabled={busy}
                                                                    onClick={() => remove(row.id)}
                                                                >
                                                                    Delete
                                                                </button>

                                                                <Link
                                                                    className="btn btn-xs"
                                                                    href={`/doctor/${row.id}`}
                                                                >
                                                                    View
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : section === "Users" ? (
                                                    <>
                                                        <td>{row.name}</td>
                                                        <td>{row.email}</td>
                                                        <td>
                                                            {row.emailVerified ? "Yes" : "No"}
                                                        </td>
                                                        <td>
                                                            {row.createdAt
                                                                ? new Date(
                                                                    row.createdAt
                                                                ).toLocaleDateString()
                                                                : "—"}
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>{row.name}</td>
                                                        <td>{row.email}</td>
                                                        <td>{row.subject}</td>
                                                        <td>
                                                            {row.createdAt
                                                                ? new Date(
                                                                    row.createdAt
                                                                ).toLocaleDateString()
                                                                : "—"}
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {busy && (
                                    <p className="p-4">Loading...</p>
                                )}

                                {!busy && table?.items?.length === 0 && (
                                    <p className="p-4">No records found.</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    className="btn"
                                    disabled={busy || page <= 1}
                                    onClick={() =>
                                        setPage((current) => current - 1)
                                    }
                                >
                                    Previous
                                </button>

                                <span>
                                    Page {page} of{" "}
                                    {Math.max(1, table?.pages || 1)}
                                </span>

                                <button
                                    type="button"
                                    className="btn"
                                    disabled={
                                        busy || page >= (table?.pages || 1)
                                    }
                                    onClick={() =>
                                        setPage((current) => current + 1)
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}

                    {section === "Reports" && (
                        <ReportContent
                            overview={overview}
                            onRefresh={refreshReports}
                            onExport={exportCSV}
                            loading={reportBusy}
                        />
                    )}

                    {section === "Settings" && (
                        <SettingsContent
                            user={session.user}
                            navigate={navigate}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
