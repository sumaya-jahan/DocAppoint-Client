"use client";
import { useEffect, useState } from "react";
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { const value = localStorage.getItem("docappoint-theme") === "dark";
    setDark(value); document.documentElement.dataset.theme = value ? "dark" : "light"; }, []);
  function toggle() { const next = !dark; setDark(next); document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("docappoint-theme", next ? "dark" : "light"); }
  return <button type="button" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    className="btn btn-ghost btn-sm border border-base-300">{dark ? "☀ Light" : "☾ Dark"}</button>;
}
