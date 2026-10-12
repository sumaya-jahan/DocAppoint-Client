"use client";
import { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";
import { API_URL } from "../lib/api";
export default function AllAppointmentsContent() {
 const [search,setSearch]=useState(""); const [specialty,setSpecialty]=useState(""); const [location,setLocation]=useState("");
 const [sort,setSort]=useState("rating"); const [page,setPage]=useState(1); const [result,setResult]=useState({items:[],pages:0,total:0});
 const [loading,setLoading]=useState(true); const [error,setError]=useState(""); const [submitted,setSubmitted]=useState("");
 useEffect(()=> { const controller=new AbortController();
   async function load(){setLoading(true);setError("");try{
    const qs=new URLSearchParams({search:submitted,specialty,location,sort,page:String(page),limit:"8"});
    const res=await fetch(`${API_URL}/api/doctors?${qs}`,{signal:controller.signal});
    if(!res.ok)throw Error("Unable to load doctors");setResult(await res.json());
   }catch(e){if(e.name!=="AbortError")setError(e.message)}finally{if(!controller.signal.aborted)setLoading(false)}}load();
   return()=>controller.abort();},[submitted,specialty,location,sort,page]);
 return <section className="min-h-screen bg-base-200 px-4 py-12"><div className="mx-auto max-w-7xl">
  <h1 className="text-center text-4xl font-bold">Find a Doctor</h1><p className="my-4 text-center">Explore doctors by specialty, location and rating.</p>
  <form onSubmit={e=>{e.preventDefault();setPage(1);setSubmitted(search.trim())}} className="my-8 grid gap-3 md:grid-cols-5">
   <div><label className="label" htmlFor="doctor-search">Doctor name</label><input id="doctor-search" className="input w-full" value={search} maxLength={100} onChange={e=>setSearch(e.target.value)}/></div>
   <div><label className="label" htmlFor="specialty">Specialty</label><input id="specialty" className="input w-full" value={specialty} maxLength={80} onChange={e=>{setPage(1);setSpecialty(e.target.value)}}/></div>
   <div><label className="label" htmlFor="location">Location</label><input id="location" className="input w-full" value={location} maxLength={80} onChange={e=>{setPage(1);setLocation(e.target.value)}}/></div>
   <div><label className="label" htmlFor="sort">Sort by</label><select id="sort" className="select w-full" value={sort} onChange={e=>{setPage(1);setSort(e.target.value)}}><option value="rating">Top rated</option><option value="feeLow">Fee: low to high</option><option value="feeHigh">Fee: high to low</option><option value="name">Name</option></select></div>
   <div className="flex items-end"><button className="btn btn-primary w-full" type="submit" disabled={loading}>{loading?"Searching…":"Search"}</button></div>
  </form>
  {error&&<p role="alert" className="alert alert-error">{error}</p>}
  {loading?<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{Array.from({length:8},(_,i)=><div key={i} className="skeleton h-96"/>)}</div>:
    <><p className="mb-4" role="status">{result.total} doctors found</p><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{result.items.map(doctor=><DoctorCard key={doctor._id||doctor.id} doctor={doctor}/>)}</div>
     {result.items.length===0&&<p className="py-12 text-center">No doctors match your search.</p>}
     <div className="mt-10 flex items-center justify-center gap-4"><button className="btn" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous</button><span>Page {page} of {Math.max(result.pages,1)}</span><button className="btn" disabled={page>=result.pages} onClick={()=>setPage(p=>p+1)}>Next</button></div></>}
 </div></section>;
}
