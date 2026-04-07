"use client";

import { useMemo, useState } from "react";

type Candidate = {
  id: number;
  name: string;
  country: string;
  role: string;
  skills: string[];
  salary?: number;
  english?: string;
  education?: string;
  years?: number;
  missing: string[];
};

const seed: Candidate[] = [];

const countries = ["All countries", "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium", "Brazil", "Cambodia", "Canada", "Chile", "China", "Colombia", "Croatia", "Czechia", "Denmark", "Egypt", "Finland", "France", "Germany", "Ghana", "Greece", "Hungary", "Iceland", "India", "Indonesia", "Ireland", "Israel", "Italy", "Japan", "Jordan", "Kenya", "Laos", "Malaysia", "Mexico", "Morocco", "Myanmar", "Nepal", "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Saudi Arabia", "Singapore", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Thailand", "Tunisia", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Vietnam", "Zimbabwe"];

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>(seed);
  const [countryFilter, setCountryFilter] = useState("All countries");
  const [skillFilter, setSkillFilter] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [englishFilter, setEnglishFilter] = useState("Any");
  const [eduFilter, setEduFilter] = useState("Any");
  const [yearsFilter, setYearsFilter] = useState("Any");
  const [roleFilter, setRoleFilter] = useState("Any");
  const [workMode, setWorkMode] = useState("Any");
  const [timezone, setTimezone] = useState("Any");
  const [visa, setVisa] = useState("Any");
  const [sortBy, setSortBy] = useState("name");

  const validLogin = email === "admin@globalmatch.com" && password === "admin123";

  const parseName = (filename: string) => filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validLogin) setLoggedIn(true);
    else alert("Invalid login");
  };

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const accepted = selected.filter(f => /\.(pdf|docx)$/i.test(f.name));
    setFiles(accepted);
    const created = accepted.map((f, i) => ({
      id: Date.now() + i,
      name: parseName(f.name),
      country: "",
      role: "",
      skills: [],
      salary: undefined,
      english: undefined,
      education: undefined,
      years: undefined,
      missing: ["country", "role", "skills"]
    }));
    setCandidates(prev => [...prev, ...created]);
  };

  const update = (id: number, field: keyof Candidate, value: string) => {
    setCandidates(prev => prev.map(c => {
      if (c.id !== id) return c;
      const next = { ...c } as Candidate;
      if (field === "skills") next.skills = value.split(",").map(s => s.trim()).filter(Boolean);
      else if (field === "salary" || field === "years") (next as any)[field] = value ? Number(value) : undefined;
      else (next as any)[field] = value;
      next.missing = ["country", "role", "skills"].filter(k => {
        const v = (next as any)[k];
        return !v || (Array.isArray(v) && v.length === 0);
      });
      return next;
    }));
  };

  const visible = useMemo(() => {
    return candidates.filter(c => {
      if (countryFilter !== "All countries" && c.country !== countryFilter) return false;
      if (skillFilter && !c.skills.join(" ").toLowerCase().includes(skillFilter.toLowerCase())) return false;
      if (salaryMin && (c.salary ?? 0) < Number(salaryMin)) return false;
      if (salaryMax && (c.salary ?? 0) > Number(salaryMax)) return false;
      if (englishFilter !== "Any" && (c.english ?? "") !== englishFilter) return false;
      if (eduFilter !== "Any" && (c.education ?? "") !== eduFilter) return false;
      if (yearsFilter !== "Any") {
        const y = c.years ?? 0;
        if (yearsFilter === "0-2" && !(y <= 2)) return false;
        if (yearsFilter === "2-5" && !(y >= 2 && y <= 5)) return false;
        if (yearsFilter === "5+" && !(y >= 5)) return false;
      }
      if (roleFilter !== "Any" && c.role !== roleFilter) return false;
      return true;
    }).sort((a, b) => sortBy === "country" ? a.country.localeCompare(b.country) : a.name.localeCompare(b.name));
  }, [candidates, countryFilter, skillFilter, salaryMin, salaryMax, englishFilter, eduFilter, yearsFilter, roleFilter, sortBy]);

  if (!loggedIn) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
        <form onSubmit={onLogin} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl space-y-4">
          <h1 className="text-3xl font-bold">Global Match</h1>
          <input className="w-full rounded-xl border p-3" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input className="w-full rounded-xl border p-3" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
          <button className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white">Login</button>
          <p className="text-sm text-slate-500">admin@globalmatch.com / admin123</p>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between rounded-3xl bg-white p-4 shadow">
        <div>
          <h1 className="text-2xl font-bold">Global Match App</h1>
          <p className="text-sm text-slate-500">Clean recruiter workspace</p>
        </div>
        <button className="rounded-xl bg-slate-200 px-4 py-2" onClick={() => setLoggedIn(false)}>Logout</button>
      </header>

      <div className="grid gap-6 lg:grid-cols-4">
        <section className="rounded-3xl bg-white p-5 shadow lg:col-span-1">
          <h2 className="mb-4 text-xl font-semibold">Upload CVs</h2>
          <input type="file" multiple accept=".pdf,.docx" onChange={onFiles} className="w-full rounded-xl border p-3" />
          <p className="mt-3 text-sm text-slate-500">Only .pdf and .docx accepted.</p>
          <p className="mt-2 text-sm text-slate-700">Accepted files: {files.length}</p>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow lg:col-span-1 space-y-3">
          <h2 className="text-xl font-semibold">Filters</h2>
          <select className="w-full rounded-xl border p-3" value={countryFilter} onChange={e => setCountryFilter(e.target.value)}>{countries.map(c => <option key={c}>{c}</option>)}</select>
          <input className="w-full rounded-xl border p-3" placeholder="Skill" value={skillFilter} onChange={e => setSkillFilter(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-xl border p-3" placeholder="Min salary" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} />
            <input className="rounded-xl border p-3" placeholder="Max salary" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} />
          </div>
          <select className="w-full rounded-xl border p-3" value={englishFilter} onChange={e => setEnglishFilter(e.target.value)}>
            <option>Any</option><option>Basic</option><option>Intermediate</option><option>Fluent</option><option>Native</option>
          </select>
          <select className="w-full rounded-xl border p-3" value={eduFilter} onChange={e => setEduFilter(e.target.value)}>
            <option>Any</option><option>University</option><option>Diploma</option><option>Bootcamp</option><option>Self-taught</option>
          </select>
          <select className="w-full rounded-xl border p-3" value={yearsFilter} onChange={e => setYearsFilter(e.target.value)}>
            <option>Any</option><option>0-2</option><option>2-5</option><option>5+</option>
          </select>
          <select className="w-full rounded-xl border p-3" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option>Any</option><option>Support</option><option>Sales</option><option>Developer</option><option>Operations</option>
          </select>
          <select className="w-full rounded-xl border p-3" value={workMode} onChange={e => setWorkMode(e.target.value)}><option>Any</option><option>Remote</option><option>Relocate</option><option>Contractor</option></select>
          <select className="w-full rounded-xl border p-3" value={timezone} onChange={e => setTimezone(e.target.value)}><option>Any</option><option>UTC+7</option><option>UTC+8</option><option>UTC+9</option></select>
          <select className="w-full rounded-xl border p-3" value={visa} onChange={e => setVisa(e.target.value)}><option>Any</option><option>Visa ready</option><option>Needs visa</option></select>
          <select className="w-full rounded-xl border p-3" value={sortBy} onChange={e => setSortBy(e.target.value)}><option value="name">Sort by name</option><option value="country">Sort by country</option></select>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Candidates ({visible.length})</h2>
          </div>
          <div className="space-y-4">
            {visible.length === 0 ? <p className="text-slate-500">No candidates yet.</p> : visible.map(c => (
              <div key={c.id} className="rounded-2xl border p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-sm text-slate-500">Missing: {c.missing.length ? c.missing.join(", ") : "none"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <input className="rounded-lg border p-2" placeholder="Country" value={c.country} onChange={e => update(c.id, "country", e.target.value)} />
                    <input className="rounded-lg border p-2" placeholder="Role" value={c.role} onChange={e => update(c.id, "role", e.target.value)} />
                    <input className="rounded-lg border p-2" placeholder="Salary" value={c.salary ?? ""} onChange={e => update(c.id, "salary", e.target.value)} />
                    <input className="rounded-lg border p-2" placeholder="Skills comma separated" value={c.skills.join(", ")} onChange={e => update(c.id, "skills", e.target.value)} />
                    <input className="rounded-lg border p-2" placeholder="English" value={c.english ?? ""} onChange={e => update(c.id, "english", e.target.value)} />
                    <input className="rounded-lg border p-2" placeholder="Education" value={c.education ?? ""} onChange={e => update(c.id, "education", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
