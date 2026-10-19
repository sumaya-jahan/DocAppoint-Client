
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "../lib/auth-client";
import { API_URL } from "../lib/api";

const colors = ["#0d9488", "#2563eb", "#d97706", "#7c3aed"];

const empty = {
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

const doctorFields = [
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

function normalizeExperience(input) {
    if (input === null || input === undefined || input === "") {
        return "";
    }

    const match = String(input)
        .trim()
        .match(/^(\d+(?:\.\d+)?)\s*(?:years?|yrs?)?$/i);

    return match ? match[1] : "";
}

function normalizeAvailability(input) {
    if (Array.isArray(input)) {
        return input.join("\n");
    }

    return typeof input === "string" ? input : "";
}

function ReportBar({ name, count, max }) {
    return (
        <div className="mb-4">
            <div className="mb-1 flex justify-between gap-3 text-sm">
                <span>{name}</span>
                <strong>{count}</strong>
            </div>
            <div className="h-5 overflow-hidden rounded bg-base-300">
                <div
                    className="h-full bg-primary"
                    style={{
                        width: `${(count / Math.max(1, max)) * 100}%`,
                    }}
                />
            </div>
        </div>
    );
}

function AdminSettings({ user, onNavigate }) {
    return (
        <section className="space-y-5">
            <h2 className="text-2xl font-bold">Admin Settings</h2>

            <div className="rounded-xl bg-base-200 p-5 space-y-3">
                <h3 className="text-lg font-semibold">Account Information</h3>
                <p><strong>Name:</strong> {user?.name || "Not provided"}</p>
                <p className="break-all">
                    <strong>Email:</strong> {user?.email || "Not available"}
                </p>
                <Link href="/dashboard" className="btn btn-primary">
                    Edit Profile
                </Link>
            </div>

            <div className="rounded-xl bg-base-200 p-5 space-y-3">
                <h3 className="text-lg font-semibold">Account Security</h3>
                <p>Reset your password using your registered email.</p>
                <Link href="/forgot-password" className="btn btn-outline">
                    Reset Password
                </Link>
            </div>

            <div className="rounded-xl bg-base-200 p-5 space-y-3">
                <h3 className="text-lg font-semibold">Doctor Management</h3>
                <p>Add, edit and manage doctor information.</p>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => onNavigate("Doctors")}
                >
                    Manage Doctors
                </button>
            </div>

            <div className="rounded-xl bg-base-200 p-5 space-y-3">
                <h3 className="text-lg font-semibold">Reports</h3>
                <p>View live reports and export data as CSV.</p>
                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => onNavigate("Reports")}
                >
                    Open Reports
                </button>
            </div>

            <div className="rounded-xl bg-base-200 p-5 space-y-3">
                <h3 className="text-lg font-semibold">Messages</h3>
                <p>View messages received through the Contact form.</p>
                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => onNavigate("Messages")}
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
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ ...empty });
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

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Request failed");
        }

        return data;
    }

    async function loadOverview() {
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

    useEffect(() => {
        if (!session?.user) return;

        request("/api/me/role")
            .then((value) => setRole(value.role))
            .catch(() => setRole("user"));
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
            ["Overview", "Settings", "Reports"].includes(section)
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

        if (section === "Doctors" && search) {
            query.set("search", search);
        }

        request(`/api/admin/${endpoint}?${query}`)
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
    }, [role, section, page, search, success]);

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
    }

    function openAdd() {
        setForm({ ...empty });
        setEditing({});
        setError("");
        setSuccess("");
    }

    function openEdit(doctor) {
        const values = Object.fromEntries(
            Object.keys(empty).map((key) => {
                let current = doctor[key] ?? "";

                if (key === "images") {
                    current = Array.isArray(doctor.images)
                        ? doctor.images.join("\n")
                        : "";
                } else if (key === "availability") {
                    current = normalizeAvailability(doctor.availability);
                } else if (key === "experience") {
                    current = normalizeExperience(doctor.experience);
                }

                return [key, current];
            })
        );

        setForm(values);
        setEditing(doctor);
        setError("");
        setSuccess("");

        requestAnimationFrame(() => {
            formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        });
    }

    async function save(event) {
        event.preventDefault();
        setBusy(true);
        setError("");
        setSuccess("");

        try {
            const imageURLs = [
                ...new Set(
                    String(form.images || "")
                        .split(/\r?\n/)
                        .map((url) => url.trim())
                        .filter(Boolean)
                ),
            ];

            if (imageURLs.length > 10) {
                throw new Error("Maximum 10 gallery images allowed.");
            }

            if (imageURLs.some((url) => !/^https:\/\/\S+$/i.test(url))) {
                throw new Error(
                    "Each gallery image must have a valid HTTPS URL."
                );
            }

            if (String(form.fee).trim() === "") {
                throw new Error("Doctor fee is required.");
            }

            const input = {
                ...form,
                fee: Number(form.fee),
                images: imageURLs,
            };

            if (String(form.rating).trim() !== "") {
                input.rating = Number(form.rating);
            } else {
                delete input.rating;
            }

            // Fix legacy experience values such as "12 Years".
            const experience = normalizeExperience(form.experience);

            if (experience !== "") {
                input.experience = Number(experience);
            } else {
                delete input.experience;
            }

            // Keep legacy array availability when editing.
            if (String(form.availability).trim()) {
                const lines = String(form.availability)
                    .split(/\r?\n/)
                    .map((item) => item.trim())
                    .filter(Boolean);

                if (Array.isArray(editing?.availability)) {
                    input.availability = lines;
                } else {
                    input.availability = lines.join("\n");
                }
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
            setForm({ ...empty });

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

    function exportCSV() {
        if (!overview) return;

        const months = overview.byMonth || [];
        const specialties = overview.bySpecialty || [];
        const statuses = overview.byStatus || [];

        const rows = [
            ["Report", "Category", "Count"],
            ["Summary", "Doctors", overview.doctors],
            ["Summary", "Appointments", overview.appointments],
            ["Summary", "Users", overview.users],
            ["Summary", "Messages", overview.contacts],
            ...months.map((item) => [
                "Monthly Appointments",
                item._id,
                item.count,
            ]),
            ...specialties.map((item) => [
                "Doctor Specialties",
                item._id,
                item.count,
            ]),
            ...statuses.map((item) => [
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
        return <p className="p-8">Checking access…</p>;
    }

    if (!session?.user) {
        return (
            <p className="p-8">
                Please{" "}
                <Link className="link" href="/login">
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
                <p>Your account does not have administrator permissions.</p>
                <Link className="btn mt-4" href="/dashboard">
                    Return to dashboard
                </Link>
            </section>
        );
    }

    const months = (overview?.byMonth || []).map((item) => ({
        name: item._id,
        count: item.count,
    }));

    const specialty = (overview?.bySpecialty || []).map(
        (item) => ({
            name: item._id,
            count: item.count,
        })
    );

    const status = (overview?.byStatus || []).map((item) => ({
        name: item._id,
        count: item.count,
    }));

    const maxMonth = Math.max(
        1,
        ...months.map((item) => item.count)
    );

    const maxSpecialty = Math.max(
        1,
        ...specialty.map((item) => item.count)
    );

    const points = months
        .map((item, index) => {
            const x =
                months.length === 1
                    ? 50
                    : 5 + (index * 90) / (months.length - 1);

            const y = 95 - (item.count / maxMonth) * 85;

            return `${x},${y}`;
        })
        .join(" ");

    const totalStatus = status.reduce(
        (sum, item) => sum + item.count,
        0
    );

    let pieOffset = 0;

    const pieStops = status
        .map((item, index) => {
            const start = pieOffset;

            pieOffset += totalStatus
                ? (item.count / totalStatus) * 100
                : 0;

            return `${colors[index % colors.length]} ${start}% ${pieOffset}%`;
        })
        .join(",");

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
                            className={`btn justify-start ${section === tab ? "btn-primary" : "btn-ghost"
                                }`}
                            onClick={() => navigate(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </aside>

                <main className="min-w-0 space-y-6">
                    {error && (
                        <p role="alert" className="alert alert-error">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p role="status" className="alert alert-success">
                            {success}
                        </p>
                    )}

                    {section === "Overview" && (
                        <>
                            {!overview ? (
                                <p>Loading real-time statistics…</p>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                        {[
                                            ["Doctors", overview.doctors],
                                            ["Appointments", overview.appointments],
                                            ["Users", overview.users],
                                            ["Messages", overview.contacts],
                                        ].map(([label, number]) => (
                                            <div
                                                key={label}
                                                className="card bg-base-200 p-5"
                                            >
                                                <p>{label}</p>
                                                <strong className="text-3xl">
                                                    {number}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="bg-base-200 rounded-xl p-4">
                                            <h2 className="font-semibold mb-3">
                                                Appointments by month (line chart)
                                            </h2>

                                            {months.length ? (
                                                <>
                                                    <svg
                                                        viewBox="0 0 100 100"
                                                        width="100%"
                                                        height="220"
                                                        role="img"
                                                        aria-label="Monthly appointments line chart"
                                                    >
                                                        <path
                                                            d="M 5 95 H 95"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="0.4"
                                                        />

                                                        <polyline
                                                            points={points}
                                                            fill="none"
                                                            stroke={colors[0]}
                                                            strokeWidth="1.7"
                                                            vectorEffect="non-scaling-stroke"
                                                        />
                                                    </svg>

                                                    <p className="text-sm">
                                                        {months
                                                            .map(
                                                                (item) =>
                                                                    `${item.name}: ${item.count}`
                                                            )
                                                            .join(" · ")}
                                                    </p>
                                                </>
                                            ) : (
                                                <p>No appointments with dates yet.</p>
                                            )}
                                        </div>

                                        <div className="bg-base-200 rounded-xl p-4">
                                            <h2 className="font-semibold mb-3">
                                                Doctors by specialty (bar chart)
                                            </h2>

                                            {specialty.length ? (
                                                specialty.map((item) => (
                                                    <ReportBar
                                                        key={item.name}
                                                        name={item.name}
                                                        count={item.count}
                                                        max={maxSpecialty}
                                                    />
                                                ))
                                            ) : (
                                                <p>No doctor specialties yet.</p>
                                            )}
                                        </div>

                                        <div className="bg-base-200 rounded-xl p-4">
                                            <h2 className="font-semibold mb-3">
                                                Appointment status (pie chart)
                                            </h2>

                                            {totalStatus ? (
                                                <>
                                                    <div
                                                        role="img"
                                                        aria-label="Status distribution pie chart"
                                                        className="w-48 h-48 rounded-full mx-auto"
                                                        style={{
                                                            background: `conic-gradient(${pieStops})`,
                                                        }}
                                                    />

                                                    <div className="mt-3">
                                                        {status.map((item, index) => (
                                                            <div
                                                                key={item.name}
                                                                className="flex justify-between gap-3"
                                                            >
                                                                <span>
                                                                    <span
                                                                        className="inline-block w-3 h-3 mr-2"
                                                                        style={{
                                                                            background:
                                                                                colors[
                                                                                index % colors.length
                                                                                ],
                                                                        }}
                                                                    />
                                                                    {item.name}
                                                                </span>
                                                                <span>{item.count}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <p>No appointment statuses yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {section === "Doctors" && (
                        <>
                            <div className="flex flex-wrap gap-3 items-end justify-between">
                                <label className="form-control">
                                    <span className="label-text">
                                        Search doctor
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
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={openAdd}
                                >
                                    Add doctor
                                </button>
                            </div>

                            {editing !== null && (
                                <form
                                    ref={formRef}
                                    onSubmit={save}
                                    className="bg-base-200 rounded-xl p-5 grid sm:grid-cols-2 gap-3"
                                >
                                    <h2 className="col-span-full text-xl font-bold">
                                        {editing?.id
                                            ? "Edit Doctor"
                                            : "Add New Doctor"}
                                    </h2>

                                    {doctorFields.map((key) => (
                                        <label
                                            key={key}
                                            className="form-control"
                                        >
                                            <span className="label-text capitalize">
                                                {key}
                                            </span>

                                            {key === "availability" ? (
                                                <textarea
                                                    className="textarea textarea-bordered w-full min-h-24"
                                                    value={form.availability ?? ""}
                                                    onChange={(event) =>
                                                        setForm((previous) => ({
                                                            ...previous,
                                                            availability: event.target.value,
                                                        }))
                                                    }
                                                    placeholder="One availability slot per line"
                                                />
                                            ) : (
                                                <input
                                                    className="input input-bordered w-full"
                                                    type={
                                                        [
                                                            "fee",
                                                            "rating",
                                                            "experience",
                                                        ].includes(key)
                                                            ? "number"
                                                            : key === "image"
                                                                ? "url"
                                                                : "text"
                                                    }
                                                    min={
                                                        [
                                                            "fee",
                                                            "rating",
                                                            "experience",
                                                        ].includes(key)
                                                            ? 0
                                                            : undefined
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
                                                            : ["fee", "experience"].includes(key)
                                                                ? "1"
                                                                : undefined
                                                    }
                                                    required={[
                                                        "name",
                                                        "specialty",
                                                        "location",
                                                        "fee",
                                                    ].includes(key)}
                                                    value={form[key] ?? ""}
                                                    onChange={(event) =>
                                                        setForm((previous) => ({
                                                            ...previous,
                                                            [key]: event.target.value,
                                                        }))
                                                    }
                                                />
                                            )}
                                        </label>
                                    ))}

                                    <label className="form-control col-span-full">
                                        <span className="label-text font-semibold">
                                            Gallery Images (one HTTPS URL per line)
                                        </span>

                                        <textarea
                                            className="textarea textarea-bordered w-full min-h-32"
                                            value={form.images}
                                            onChange={(event) =>
                                                setForm((previous) => ({
                                                    ...previous,
                                                    images: event.target.value,
                                                }))
                                            }
                                            placeholder={
                                                "https://example.com/photo-1.jpg\nhttps://example.com/photo-2.jpg"
                                            }
                                            aria-describedby="gallery-help"
                                        />

                                        <span
                                            id="gallery-help"
                                            className="text-sm text-base-content/70 mt-1"
                                        >
                                            Add up to 10 different image URLs.
                                            Use photos you have permission to use.
                                            The main Image URL is kept separately.
                                        </span>
                                    </label>

                                    <div className="col-span-full flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={busy}
                                            className="btn btn-primary"
                                        >
                                            {busy
                                                ? "Saving…"
                                                : editing?.id
                                                    ? "Update Doctor"
                                                    : "Save Doctor"}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn"
                                            disabled={busy}
                                            onClick={() => setEditing(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}

                    {["Doctors", "Users", "Messages"].includes(section) && (
                        <>
                            <div className="overflow-x-auto bg-base-100 rounded-xl border border-base-300">
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
                                            ).map((label) => (
                                                <th key={label}>{label}</th>
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
                                                                    onClick={() => remove(row.id)}
                                                                    disabled={busy}
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
                                    <p className="p-4">Loading…</p>
                                )}

                                {!busy && table?.items?.length === 0 && (
                                    <p className="p-4">No records found.</p>
                                )}
                            </div>

                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    className="btn"
                                    disabled={page <= 1 || busy}
                                    onClick={() =>
                                        setPage((previous) => previous - 1)
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
                                        page >= (table?.pages || 1) || busy
                                    }
                                    onClick={() =>
                                        setPage((previous) => previous + 1)
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}

                    {section === "Reports" && (
                        <div className="space-y-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-2xl font-bold">
                                    Live Reports
                                </h2>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        disabled={reportBusy}
                                        onClick={loadOverview}
                                    >
                                        {reportBusy
                                            ? "Refreshing…"
                                            : "Refresh Reports"}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        disabled={!overview || reportBusy}
                                        onClick={exportCSV}
                                    >
                                        Export CSV
                                    </button>
                                </div>
                            </div>

                            {!overview ? (
                                <p>Loading reports…</p>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                        {[
                                            ["Total Doctors", overview.doctors],
                                            [
                                                "Total Appointments",
                                                overview.appointments,
                                            ],
                                            ["Total Users", overview.users],
                                            [
                                                "Contact Messages",
                                                overview.contacts,
                                            ],
                                        ].map(([label, value]) => (
                                            <div
                                                key={label}
                                                className="rounded-xl bg-base-200 p-5"
                                            >
                                                <p className="text-sm">{label}</p>
                                                <strong className="text-3xl">
                                                    {value}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid gap-5 lg:grid-cols-2">
                                        <div className="rounded-xl bg-base-200 p-5">
                                            <h3 className="mb-4 text-lg font-bold">
                                                Monthly Appointments
                                            </h3>

                                            {months.length === 0 ? (
                                                <p>No monthly data available.</p>
                                            ) : (
                                                months.map((item) => (
                                                    <ReportBar
                                                        key={item.name}
                                                        name={item.name}
                                                        count={item.count}
                                                        max={maxMonth}
                                                    />
                                                ))
                                            )}
                                        </div>

                                        <div className="rounded-xl bg-base-200 p-5">
                                            <h3 className="mb-4 text-lg font-bold">
                                                Doctors by Specialty
                                            </h3>

                                            {specialty.length === 0 ? (
                                                <p>No specialty data available.</p>
                                            ) : (
                                                specialty.map((item) => (
                                                    <ReportBar
                                                        key={item.name}
                                                        name={item.name}
                                                        count={item.count}
                                                        max={maxSpecialty}
                                                    />
                                                ))
                                            )}
                                        </div>

                                        <div className="rounded-xl bg-base-200 p-5 lg:col-span-2">
                                            <h3 className="mb-4 text-lg font-bold">
                                                Appointment Status Report
                                            </h3>

                                            {status.length === 0 ? (
                                                <p>
                                                    No appointment status data available.
                                                </p>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="table table-zebra w-full">
                                                        <thead>
                                                            <tr>
                                                                <th>Status</th>
                                                                <th>Appointments</th>
                                                                <th>Percentage</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {status.map((item) => (
                                                                <tr key={item.name}>
                                                                    <td>{item.name}</td>
                                                                    <td>{item.count}</td>
                                                                    <td>
                                                                        {totalStatus
                                                                            ? (
                                                                                (item.count /
                                                                                    totalStatus) *
                                                                                100
                                                                            ).toFixed(1)
                                                                            : "0.0"}
                                                                        %
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {section === "Settings" && (
                        <AdminSettings
                            user={session?.user}
                            onNavigate={navigate}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
