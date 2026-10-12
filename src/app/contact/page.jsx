"use client";
import {useState} from "react";
import {API_URL} from "../../lib/api";
export default function Contact(){const [state,setState]=useState("idle");const [message,setMessage]=useState("");
async function send(e){e.preventDefault();setState("loading");setMessage("");const form=e.currentTarget;
 const data=Object.fromEntries(new FormData(form).entries());try{const res=await fetch(`${API_URL}/api/contact`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
 const result=await res.json();if(!res.ok)throw Error(result.message||"Could not send");setState("success");setMessage(result.message);form.reset();}catch(err){setState("error");setMessage(err.message)}}
return <main className="mx-auto max-w-2xl px-4 py-16"><h1 className="text-4xl font-bold">Contact DocAppoint</h1><p className="my-4">Questions about finding doctors or managing appointments? Send our team a message.</p>
<form onSubmit={send} className="card bg-base-200 p-6 space-y-4">{[["name","Full name","text",2],["email","Email address","email",3],["subject","Subject","text",3]].map(([key,label,type,min])=><div key={key}><label className="label" htmlFor={key}>{label}</label><input className="input w-full" id={key} name={key} type={type} required minLength={min} maxLength={key==="email"?254:150}/></div>)}
<div><label className="label" htmlFor="message">Message</label><textarea className="textarea w-full" id="message" name="message" required minLength={10} maxLength={3000} rows={5}/></div>
<button className="btn btn-primary" disabled={state==="loading"}>{state==="loading"?"Sending…":"Send message"}</button>{message&&<p role="status" className={state==="error"?"text-error":"text-success"}>{message}</p>}</form></main>}
