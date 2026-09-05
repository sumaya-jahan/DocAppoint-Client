import DoctorDetailsContent from "../../../components/DoctorDetailsContent";

export const metadata = {
    title: "Doctor Details",
    description:
        "View doctor details, experience, availability, fees, and appointment information.",
};

export default async function DoctorDetailsPage({ params }) {
    const { id } = await params;

    return <DoctorDetailsContent doctorId={id} />;
}