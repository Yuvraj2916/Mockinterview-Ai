import { useState, useRef, useEffect } from "react";

/* ─── INJECT GLOBAL CSS ──────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Geist+Mono:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#0a0e1a;--ink2:#1a2035;--ink3:#2a3050;
  --surface:#ffffff;--surface2:#f4f6fb;--surface3:#eaeff8;
  --border:rgba(15,30,80,0.1);--border2:rgba(15,30,80,0.18);
  --t1:#0a0e1a;--t2:#3d4a6b;--t3:#7a86a8;
  --blue:#1d4ed8;--blue2:#2563eb;--blue3:#3b82f6;--blue-glow:rgba(37,99,235,0.18);
  --green:#059669;--green2:#10b981;--green-soft:rgba(16,185,129,0.1);
  --amber:#d97706;--amber-soft:rgba(217,119,6,0.1);
  --red:#dc2626;--red-soft:rgba(220,38,38,0.1);
  --purple:#7c3aed;--purple-soft:rgba(124,58,237,0.1);
  --r:14px;--rs:8px;--shadow:0 4px 24px rgba(10,14,26,0.1);--shadow-lg:0 12px 48px rgba(10,14,26,0.15);
}
body{background:var(--surface2);font-family:'Bricolage Grotesque',sans-serif;color:var(--t1);overflow-x:hidden;}
.mono{font-family:'Geist Mono',monospace;}

@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes wave{0%,100%{height:4px}50%{height:22px}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes slideRight{from{width:0}to{width:var(--w)}}
@keyframes countUp{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
@keyframes bgFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(.97)}}

.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);transition:all .2s;box-shadow:var(--shadow);}
.card:hover{border-color:var(--border2);box-shadow:var(--shadow-lg);transform:translateY(-2px);}
.card-flat{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 22px;border-radius:var(--rs);font-family:'Bricolage Grotesque',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;border:none;letter-spacing:-.01em;}
.btn-primary{background:linear-gradient(135deg,var(--blue),var(--blue3));color:white;box-shadow:0 4px 16px var(--blue-glow);}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 24px var(--blue-glow);}
.btn-outline{background:transparent;color:var(--blue2);border:1.5px solid var(--blue3);}
.btn-outline:hover{background:var(--blue-glow);transform:translateY(-1px);}
.btn-ghost{background:transparent;color:var(--t2);border:1px solid var(--border2);}
.btn-ghost:hover{background:var(--surface3);color:var(--t1);}
.btn-green{background:linear-gradient(135deg,var(--green),var(--green2));color:white;}
.btn-green:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(16,185,129,.3);}
.btn-red{background:var(--red-soft);color:var(--red);border:1px solid rgba(220,38,38,.2);}
.btn-red:hover{background:rgba(220,38,38,.15);}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;box-shadow:none!important;}

.pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:500;}
.pill-blue{background:rgba(37,99,235,.08);color:var(--blue2);border:1px solid rgba(37,99,235,.15);}
.pill-green{background:var(--green-soft);color:var(--green);border:1px solid rgba(16,185,129,.2);}
.pill-amber{background:var(--amber-soft);color:var(--amber);border:1px solid rgba(217,119,6,.2);}
.pill-red{background:var(--red-soft);color:var(--red);border:1px solid rgba(220,38,38,.2);}
.pill-purple{background:var(--purple-soft);color:var(--purple);border:1px solid rgba(124,58,237,.2);}
.pill-neutral{background:var(--surface3);color:var(--t2);border:1px solid var(--border);}

input,select,textarea{font-family:'Bricolage Grotesque',sans-serif;background:var(--surface);border:1.5px solid var(--border2);color:var(--t1);border-radius:var(--rs);transition:border-color .2s;}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--blue3);box-shadow:0 0 0 3px var(--blue-glow);}
textarea{resize:none;}

::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}
`;

/* ─── MOCK DATA ──────────────────────────────────────────────────────────── */
const JOBS = [
  { id:1, title:"Software Engineer Intern", company:"Google", location:"Bangalore, IN", type:"Hybrid", salary:"₹80K/mo", logo:"G", color:"#4285f4", tags:["React","Python","ML"], posted:"2d ago", applicants:342 },
  { id:2, title:"Frontend Engineer", company:"Microsoft", location:"Hyderabad, IN", type:"Remote", salary:"₹70K/mo", logo:"M", color:"#00a4ef", tags:["React","TypeScript","Azure"], posted:"1d ago", applicants:218 },
  { id:3, title:"Backend SDE", company:"Amazon", location:"Bangalore, IN", type:"On-site", salary:"₹90K/mo", logo:"A", color:"#ff9900", tags:["Java","AWS","DynamoDB"], posted:"3d ago", applicants:567 },
  { id:4, title:"ML Engineer Intern", company:"Meta", location:"Remote", type:"Remote", salary:"₹75K/mo", logo:"Ⓜ", color:"#1877f2", tags:["PyTorch","Python","NLP"], posted:"5h ago", applicants:89 },
  { id:5, title:"Full Stack Developer", company:"Flipkart", location:"Bangalore, IN", type:"Hybrid", salary:"₹55K/mo", logo:"F", color:"#2874f0", tags:["Node.js","React","MongoDB"], posted:"1d ago", applicants:445 },
  { id:6, title:"DevOps Engineer", company:"Razorpay", location:"Bangalore, IN", type:"On-site", salary:"₹65K/mo", logo:"R", color:"#2EB5C9", tags:["K8s","Docker","AWS"], posted:"4d ago", applicants:123 },
  { id:7, title:"iOS Developer", company:"Swiggy", location:"Bangalore, IN", type:"Hybrid", salary:"₹60K/mo", logo:"S", color:"#FC8019", tags:["Swift","iOS","Firebase"], posted:"2d ago", applicants:201 },
  { id:8, title:"Data Engineer", company:"PhonePe", location:"Bangalore, IN", type:"On-site", salary:"₹72K/mo", logo:"P", color:"#5f259f", tags:["Spark","Kafka","SQL"], posted:"6h ago", applicants:156 },
];

const AI_QUESTIONS = [
  "Tell me about yourself and why you're interested in this role.",
  "Describe a challenging technical problem you solved recently. What was your approach?",
  "Explain the difference between useEffect and useLayoutEffect in React.",
  "How would you design a URL shortening service like bit.ly at scale?",
  "Tell me about a time you had a conflict with a teammate. How did you resolve it?",
  "What's your understanding of event loop in JavaScript?",
  "How would you optimize a slow database query?",
  "Where do you see yourself in 3 years?",
];
const AI_FOLLOWUPS = [
  "Can you elaborate on the technical choices you made?",
  "How would that scale to 10 million users?",
  "What would you do differently knowing what you know now?",
  "How does that compare to alternative approaches?",
];
let qIdx = 0;
const nextQ = (isFollowup = false) => isFollowup ? AI_FOLLOWUPS[Math.floor(Math.random()*AI_FOLLOWUPS.length)] : AI_QUESTIONS[qIdx++ % AI_QUESTIONS.length];

/* ─── NAVBAR ─────────────────────────────────────────────────────────────── */
function Navbar({ page, setPage, user, onLogout }) {
  const [dropOpen, setDropOpen] = useState(false);
  return (
    <nav style={{ background:"white", borderBottom:"1px solid var(--border)", padding:"0 48px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 12px rgba(10,14,26,.06)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:32 }}>
        <div onClick={() => setPage("landing")} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
          <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#1d4ed8,#3b82f6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"white", fontSize:16 }}>◈</span>
          </div>
          <span style={{ fontSize:17, fontWeight:800, color:"var(--ink)", letterSpacing:"-.03em" }}>HireMind<span style={{ color:"var(--blue2)" }}> AI</span><span style={{ fontSize:11, fontWeight:500, color:"var(--t3)", marginLeft:6, letterSpacing:0 }}>Interview Prep</span></span>
        </div>
        {user && (
          <div style={{ display:"flex", gap:4 }}>
            {[["jobs","Jobs"],["resume","Resume Hub"],["interview","Mock Interview"],["dashboard","Dashboard"]].map(([k,l]) => (
              <button key={k} onClick={() => setPage(k)} className="btn btn-ghost" style={{ padding:"7px 14px", fontSize:13, fontWeight:500, background: page===k ? "rgba(37,99,235,.08)" : "transparent", color: page===k ? "var(--blue2)" : "var(--t2)", border: page===k ? "1px solid rgba(37,99,235,.15)" : "1px solid transparent" }}>
                {l}
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        {user ? (
          <div style={{ position:"relative" }}>
            <div onClick={() => setDropOpen(v => !v)} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"5px 12px 5px 5px", borderRadius:100, border:"1.5px solid var(--border2)", background:"white", transition:"all .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="var(--blue3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor="var(--border2)"}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#1d4ed8,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"white", fontSize:11, fontWeight:700 }}>{user.initials}</span>
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:"var(--t1)" }}>{user.name.split(" ")[0]}</span>
              <span style={{ fontSize:10, color:"var(--t3)" }}>▾</span>
            </div>
            {dropOpen && (
              <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:"white", border:"1px solid var(--border)", borderRadius:12, boxShadow:"0 12px 40px rgba(10,14,26,.15)", minWidth:200, padding:8, zIndex:200, animation:"fadeUp .2s ease" }}>
                <div style={{ padding:"10px 14px 8px", borderBottom:"1px solid var(--border)", marginBottom:6 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"var(--t1)" }}>{user.name}</div>
                  <div style={{ fontSize:11, color:"var(--t3)" }}>{user.email}</div>
                </div>
                {[["dashboard","📊 Dashboard"],["resume","📄 My Resume"],["interview","🎯 Mock Interview"]].map(([k,l]) => (
                  <button key={k} onClick={() => { setPage(k); setDropOpen(false); }} style={{ display:"flex", width:"100%", padding:"9px 14px", background:"none", border:"none", cursor:"pointer", fontSize:13, color:"var(--t2)", borderRadius:8, textAlign:"left", transition:"background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background="var(--surface2)"}
                    onMouseLeave={e => e.currentTarget.style.background="none"}>
                    {l}
                  </button>
                ))}
                <div style={{ borderTop:"1px solid var(--border)", marginTop:6, paddingTop:6 }}>
                  <button onClick={() => { onLogout(); setDropOpen(false); }} style={{ display:"flex", width:"100%", padding:"9px 14px", background:"none", border:"none", cursor:"pointer", fontSize:13, color:"var(--red)", borderRadius:8, textAlign:"left", transition:"background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background="var(--red-soft)"}
                    onMouseLeave={e => e.currentTarget.style.background="none"}>
                    ← Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={() => setPage("login")} style={{ fontSize:13, padding:"8px 18px" }}>Log In</button>
            <button className="btn btn-primary" onClick={() => setPage("signup")} style={{ fontSize:13, padding:"8px 20px" }}>Sign Up Free →</button>
          </>
        )}
      </div>
    </nav>
  );
}

/* ─── LOGIN PAGE ─────────────────────────────────────────────────────────── */
function LoginPage({ setPage, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleEmail = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    const rawName = email.split("@")[0].replace(/[^a-zA-Z ]/g, " ").trim();
    const name = rawName.split(" ").filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(" ") || "User";
    const initials = name.split(" ").filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";
    onLogin({ name, email, initials });
    setPage("dashboard");
  };

  const handleSocial = async (providerId, providerName) => {
    setSocialLoading(providerId);
    await new Promise(r => setTimeout(r, 1300));
    setSocialLoading("");
    if (providerId === "google") {
      onLogin({ name: "Google User", email: "user@gmail.com", initials: "GU" });
    } else {
      onLogin({ name: "GitHub User", email: "user@github.com", initials: "GH" });
    }
    setPage("dashboard");
  };

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }}>
      {/* ── Left decorative panel ── */}
      <div style={{ background: "linear-gradient(145deg,#0f172a,#1e3a8a,#0f172a)", display: "flex", alignItems: "center", justifyContent: "center", padding: 60, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        {[{ t: "-10%", l: "-10%", s: 320, c: "rgba(59,130,246,.15)" }, { b: "-5%", r: "-5%", s: 280, c: "rgba(124,58,237,.12)" }, { t: "40%", l: "30%", s: 160, c: "rgba(16,185,129,.08)" }].map((b, i) => (
          <div key={i} style={{ position: "absolute", top: b.t, left: b.l, right: b.r, bottom: b.b, width: b.s, height: b.s, borderRadius: "50%", background: b.c, pointerEvents: "none", animation: `bgFloat ${7 + i * 2}s ease-in-out infinite` }} />
        ))}
        <div style={{ position: "relative", textAlign: "center", maxWidth: 380 }}>
          <div style={{ fontSize: 52, marginBottom: 20, animation: "float 3s ease infinite" }}>🎯</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "white", letterSpacing: "-.04em", lineHeight: 1.15, marginBottom: 16 }}>
            Land your<br />
            <span style={{ background: "linear-gradient(90deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>dream job</span><br />
            with AI
          </h2>
          <p style={{ color: "rgba(255,255,255,.55)", fontSize: 14, lineHeight: 1.75, marginBottom: 32 }}>
            Practice interviews, analyze your resume, and track applications — all in one place.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {["AI-adapted interview questions", "Real-time confidence scoring", "Detailed post-interview reports", "50,000+ students already hired"].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, animation: `fadeUp .4s ease ${i * .1}s both` }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(16,185,129,.2)", border: "1px solid rgba(16,185,129,.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#34d399", fontSize: 12 }}>✓</span>
                </div>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,.7)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 80px", background: "var(--surface2)" }}>
        <div style={{ width: "100%", maxWidth: 400, animation: "fadeUp .4s ease" }}>
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 8 }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: "var(--t2)" }}>Sign in to continue your journey</p>
          </div>

          {/* Social buttons — each has its own providerId */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
            {/* Google */}
            <div
              role="button"
              onClick={() => socialLoading === "" && handleSocial("google", "Google")}
              style={{ width: "100%", padding: "11px 16px", fontSize: 13, gap: 10, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1px solid #dadce0", background: "#fff", color: "#3c4043", cursor: socialLoading ? "not-allowed" : "pointer", opacity: socialLoading && socialLoading !== "google" ? 0.45 : 1, transition: "all .2s", fontFamily: "inherit", fontWeight: 500, userSelect: "none" }}
            >
              {socialLoading === "google"
                ? <div style={{ width: 16, height: 16, border: "2px solid rgba(0,0,0,.15)", borderTopColor: "#4285f4", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                : <div style={{ width: 20, height: 20, borderRadius: 4, background: "#4285f4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>G</span></div>
              }
              Continue with Google
            </div>
            {/* GitHub */}
            <div
              role="button"
              onClick={() => socialLoading === "" && handleSocial("github", "GitHub")}
              style={{ width: "100%", padding: "11px 16px", fontSize: 13, gap: 10, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1px solid #24292e", background: "#24292e", color: "#fff", cursor: socialLoading ? "not-allowed" : "pointer", opacity: socialLoading && socialLoading !== "github" ? 0.45 : 1, transition: "all .2s", fontFamily: "inherit", fontWeight: 500, userSelect: "none" }}
            >
              {socialLoading === "github"
                ? <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                : <div style={{ width: 20, height: 20, borderRadius: 4, background: "#555", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>GH</span></div>
              }
              Continue with GitHub
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border2)" }} />
            <span style={{ fontSize: 12, color: "var(--t3)" }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: "var(--border2)" }} />
          </div>

          <form onSubmit={handleEmail} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {error && (
              <div style={{ padding: "10px 14px", background: "var(--red-soft)", border: "1px solid rgba(220,38,38,.2)", borderRadius: 8, fontSize: 13, color: "var(--red)" }}>⚠️ {error}</div>
            )}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--t2)", marginBottom: 7, textTransform: "uppercase", letterSpacing: ".06em" }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: "100%", padding: "11px 14px", fontSize: 14 }} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--t2)", textTransform: "uppercase", letterSpacing: ".06em" }}>Password</label>
                <span style={{ fontSize: 12, color: "var(--blue2)", cursor: "pointer" }}>Forgot password?</span>
              </div>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "11px 44px 11px 14px", fontSize: 14 }} />
                {/* Use div not button to avoid any form submission conflict */}
                <div
                  onClick={() => setShowPass(v => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 16, color: "var(--t3)", lineHeight: 1, userSelect: "none" }}
                >
                  {showPass ? "🙈" : "👁️"}
                </div>
              </div>
            </div>
            <button type="submit" onClick={handleEmail} className="btn btn-primary" disabled={loading} style={{ width: "100%", padding: "13px", fontSize: 15, marginTop: 4 }}>
              {loading
                ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Signing in...</>
                : "Sign In →"
              }
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 22, fontSize: 13, color: "var(--t2)" }}>
            Don't have an account?{" "}
            <span onClick={() => setPage("signup")} style={{ color: "var(--blue2)", fontWeight: 600, cursor: "pointer" }}>Create one free →</span>
          </p>

          <div style={{ marginTop: 18, padding: "12px 16px", background: "rgba(37,99,235,.05)", border: "1px dashed rgba(37,99,235,.2)", borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "var(--t3)", marginBottom: 6 }}>🚀 Hackathon demo? Skip login:</div>
            <div className="btn btn-outline" style={{ fontSize: 12, padding: "6px 16px", display: "inline-flex", cursor: "pointer" }} onClick={() => { onLogin({ name: "Akshat Pratap", email: "akshat@demo.com", initials: "AP" }); setPage("dashboard"); }}>
              Enter as Demo User
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SIGNUP PAGE ────────────────────────────────────────────────────────── */
function SignupPage({ setPage, onLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "student", college: "", targets: [] });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  // Two completely independent show/hide states — one per field
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validateStep1 = (f) => {
    const e = {};
    if (!f.name.trim()) e.name = "Name is required";
    if (!f.email.includes("@")) e.email = "Valid email required";
    if (f.password.length < 6) e.password = "At least 6 characters";
    if (f.password !== f.confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStep1 = (e) => { if (e && e.preventDefault) e.preventDefault(); if (validateStep1(form)) setStep(2); };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    const initials = form.name.split(" ").filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";
    onLogin({ name: form.name, email: form.email, initials });
    setPage("dashboard");
  };

  const toggleTarget = (t) => setForm(p => ({
    ...p,
    targets: p.targets.includes(t) ? p.targets.filter(x => x !== t) : [...p.targets, t]
  }));

  const handleSocialSignup = async (providerId) => {
    setSocialLoading(providerId);
    await new Promise(r => setTimeout(r, 1300));
    setSocialLoading("");
    if (providerId === "google") {
      onLogin({ name: "Google User", email: "user@gmail.com", initials: "GU" });
    } else {
      onLogin({ name: "GitHub User", email: "user@github.com", initials: "GH" });
    }
    setPage("dashboard");
  };

  const strengthLevel = form.password.length >= 10 ? 3 : form.password.length >= 6 ? 2 : form.password.length > 0 ? 1 : 0;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strengthLevel];
  const strengthColor = ["", "var(--red)", "var(--amber)", "var(--green2)"][strengthLevel];
  const strengthBars = [0, 1, 2, 3].map(i => i < strengthLevel);

  const roles = [["student", "🎓 Student"], ["fresher", "👨‍💼 Fresh Graduate"], ["experienced", "💼 Experienced"], ["career_switch", "🔄 Career Switch"]];
  const targets = ["Software Engineer", "Frontend Engineer", "Backend Engineer", "Full Stack", "Data Scientist", "ML Engineer", "Product Manager", "DevOps/SRE"];

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }}>
      {/* ── Left panel ── */}
      <div style={{ background: "linear-gradient(145deg,#0f172a,#1a2e4a,#0f1f0f)", display: "flex", alignItems: "center", justifyContent: "center", padding: 60, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        {[{ t: "-10%", l: "-5%", s: 300, c: "rgba(16,185,129,.15)" }, { b: "0", r: "-10%", s: 260, c: "rgba(59,130,246,.12)" }, { t: "35%", l: "20%", s: 180, c: "rgba(124,58,237,.1)" }].map((b, i) => (
          <div key={i} style={{ position: "absolute", top: b.t, left: b.l, right: b.r, bottom: b.b, width: b.s, height: b.s, borderRadius: "50%", background: b.c, animation: `bgFloat ${6 + i * 3}s ease-in-out infinite` }} />
        ))}
        <div style={{ position: "relative", textAlign: "center", maxWidth: 380 }}>
          <div style={{ fontSize: 52, marginBottom: 20, animation: "float 3s ease infinite" }}>🚀</div>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "white", letterSpacing: "-.04em", lineHeight: 1.2, marginBottom: 14 }}>
            Start your journey<br />
            <span style={{ background: "linear-gradient(90deg,#34d399,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>to your dream role</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,.55)", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>Join 50,000+ students who used HireMind AI – Interview Prep to land offers at top companies.</p>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
            {[1, 2].map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: step > s ? "var(--green2)" : step === s ? "rgba(59,130,246,.85)" : "rgba(255,255,255,.1)", border: `2px solid ${step > s ? "var(--green2)" : step === s ? "rgba(99,160,255,.8)" : "rgba(255,255,255,.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .4s" }}>
                    {step > s ? <span style={{ color: "white", fontSize: 16 }}>✓</span> : <span style={{ color: step === s ? "white" : "rgba(255,255,255,.3)", fontSize: 13, fontWeight: 700 }}>{s}</span>}
                  </div>
                  <span style={{ fontSize: 11, color: step >= s ? "rgba(255,255,255,.75)" : "rgba(255,255,255,.3)", whiteSpace: "nowrap" }}>{s === 1 ? "Account" : "Profile"}</span>
                </div>
                {i < 1 && <div style={{ width: 56, height: 2, background: step > 1 ? "var(--green2)" : "rgba(255,255,255,.12)", marginBottom: 18, marginLeft: 8, marginRight: 8, transition: "background .4s" }} />}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            {[["G", "#4285f4"], ["M", "#00a4ef"], ["A", "#ff9900"], ["F", "#1877f2"]].map(([c, col]) => (
              <div key={c} style={{ width: 38, height: 38, borderRadius: 10, background: `${col}22`, border: `1px solid ${col}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: col }}>{c}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)", marginTop: 8 }}>Students hired at top companies</p>
        </div>
      </div>

      {/* ── Right form ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 80px", background: "var(--surface2)", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ marginBottom: 22, textAlign: "center" }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 6 }}>
              {step === 1 ? "Create your account" : "Complete your profile"}
            </h1>
            <p style={{ fontSize: 14, color: "var(--t2)" }}>
              {step === 1 ? "Free forever · No credit card needed" : "Helps us personalize your experience"}
            </p>
          </div>

          {step === 1 ? (
            <div style={{ animation: "fadeUp .3s ease" }}>
              {/* Social signup — inline divs, NOT buttons, to avoid any form nesting issues */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                <div
                  role="button"
                  onClick={() => socialLoading === "" && handleSocialSignup("google")}
                  style={{ width: "100%", padding: "11px 16px", fontSize: 13, gap: 10, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1px solid #dadce0", background: "#fff", color: "#3c4043", cursor: socialLoading ? "not-allowed" : "pointer", opacity: socialLoading && socialLoading !== "google" ? 0.45 : 1, transition: "all .2s", fontFamily: "inherit", fontWeight: 500, userSelect: "none" }}
                >
                  {socialLoading === "google"
                    ? <div style={{ width: 16, height: 16, border: "2px solid rgba(0,0,0,.15)", borderTopColor: "#4285f4", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                    : <div style={{ width: 20, height: 20, borderRadius: 4, background: "#4285f4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>G</span></div>
                  }
                  Sign up with Google
                </div>
                <div
                  role="button"
                  onClick={() => socialLoading === "" && handleSocialSignup("github")}
                  style={{ width: "100%", padding: "11px 16px", fontSize: 13, gap: 10, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1px solid #24292e", background: "#24292e", color: "#fff", cursor: socialLoading ? "not-allowed" : "pointer", opacity: socialLoading && socialLoading !== "github" ? 0.45 : 1, transition: "all .2s", fontFamily: "inherit", fontWeight: 500, userSelect: "none" }}
                >
                  {socialLoading === "github"
                    ? <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                    : <div style={{ width: 20, height: 20, borderRadius: 4, background: "#555", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>GH</span></div>
                  }
                  Sign up with GitHub
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ flex: 1, height: 1, background: "var(--border2)" }} />
                <span style={{ fontSize: 12, color: "var(--t3)" }}>or sign up with email</span>
                <div style={{ flex: 1, height: 1, background: "var(--border2)" }} />
              </div>

              <form onSubmit={handleStep1} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--t2)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Full Name</label>
                  <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Akshat Pratap" style={{ width: "100%", padding: "11px 14px", fontSize: 14 }} />
                  {errors.name && <div style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>⚠ {errors.name}</div>}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--t2)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Email</label>
                  <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" style={{ width: "100%", padding: "11px 14px", fontSize: 14 }} />
                  {errors.email && <div style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>⚠ {errors.email}</div>}
                </div>
                {/* Password — toggle uses div, not button, to avoid any implicit form submit */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--t2)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={e => update("password", e.target.value)}
                      placeholder="Min. 6 characters"
                      style={{ width: "100%", padding: "11px 44px 11px 14px", fontSize: 14 }}
                    />
                    <div
                      onClick={() => setShowPass(v => !v)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 16, lineHeight: 1, userSelect: "none", color: "var(--t3)" }}
                    >
                      {showPass ? "🙈" : "👁️"}
                    </div>
                  </div>
                  {form.password.length > 0 && (
                    <div style={{ marginTop: 7 }}>
                      <div style={{ display: "flex", gap: 4, marginBottom: 3 }}>
                        {strengthBars.map((filled, i) => (
                          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: filled ? strengthColor : "var(--surface3)", transition: "background .3s" }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 11, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
                    </div>
                  )}
                  {errors.password && <div style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>⚠ {errors.password}</div>}
                </div>
                {/* Confirm Password — completely separate toggle state */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--t2)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirm}
                      onChange={e => update("confirm", e.target.value)}
                      placeholder="Re-enter your password"
                      style={{ width: "100%", padding: "11px 44px 11px 14px", fontSize: 14, borderColor: form.confirm.length > 0 && form.confirm !== form.password ? "var(--red)" : undefined }}
                    />
                    <div
                      onClick={() => setShowConfirm(v => !v)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 16, lineHeight: 1, userSelect: "none", color: "var(--t3)" }}
                    >
                      {showConfirm ? "🙈" : "👁️"}
                    </div>
                  </div>
                  {form.confirm.length > 0 && form.confirm === form.password && (
                    <div style={{ fontSize: 11, color: "var(--green)", marginTop: 4 }}>✓ Passwords match</div>
                  )}
                  {errors.confirm && <div style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>⚠ {errors.confirm}</div>}
                </div>
                <button type="submit" onClick={handleStep1} className="btn btn-primary" style={{ width: "100%", padding: "13px", fontSize: 15, marginTop: 4 }}>
                  Continue →
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp .3s ease" }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--t2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>I am a...</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {roles.map(([k, l]) => (
                    <div key={k} onClick={() => update("role", k)}
                      style={{ padding: "10px 12px", borderRadius: 9, border: `1.5px solid ${form.role === k ? "var(--blue2)" : "var(--border2)"}`, background: form.role === k ? "rgba(37,99,235,.06)" : "white", cursor: "pointer", fontSize: 13, fontWeight: form.role === k ? 600 : 400, color: form.role === k ? "var(--blue2)" : "var(--t2)", transition: "all .15s", userSelect: "none" }}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--t2)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>College / Company</label>
                <input value={form.college} onChange={e => update("college", e.target.value)} placeholder="e.g. IIT Delhi, TCS, Self-taught" style={{ width: "100%", padding: "11px 14px", fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--t2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>Target Role <span style={{ color: "var(--t3)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(select all that apply)</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {targets.map(t => {
                    const selected = form.targets.includes(t);
                    return (
                      <div key={t} onClick={() => toggleTarget(t)}
                        style={{ padding: "6px 12px", borderRadius: 100, border: `1.5px solid ${selected ? "var(--blue2)" : "var(--border2)"}`, background: selected ? "rgba(37,99,235,.08)" : "white", cursor: "pointer", fontSize: 12, fontWeight: selected ? 600 : 400, color: selected ? "var(--blue2)" : "var(--t2)", transition: "all .15s", userSelect: "none", display: "flex", alignItems: "center", gap: 5 }}>
                        {selected && <span style={{ fontSize: 10 }}>✓</span>}{t}
                      </div>
                    );
                  })}
                </div>
                {form.targets.length > 0 && (
                  <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 6 }}>{form.targets.length} selected</div>
                )}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <div className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex: 1, padding: "13px", cursor: "pointer", justifyContent: "center" }}>← Back</div>
                <button type="submit" onClick={handleSubmit} className="btn btn-primary" disabled={loading} style={{ flex: 2, padding: "13px", fontSize: 15 }}>
                  {loading
                    ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Creating account...</>
                    : "🚀 Create Account"
                  }
                </button>
              </div>
              <p style={{ fontSize: 11, color: "var(--t3)", textAlign: "center", lineHeight: 1.6 }}>
                By signing up, you agree to our <span style={{ color: "var(--blue2)", cursor: "pointer" }}>Terms</span> and <span style={{ color: "var(--blue2)", cursor: "pointer" }}>Privacy Policy</span>.
              </p>
            </form>
          )}

          <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "var(--t2)" }}>
            Already have an account?{" "}
            <span onClick={() => setPage("login")} style={{ color: "var(--blue2)", fontWeight: 600, cursor: "pointer" }}>Sign in →</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── LANDING PAGE ───────────────────────────────────────────────────────── */
function LandingPage({ setPage }) {
  const stats = [["50K+","Students Placed"],["4.8★","Average Rating"],["200+","Partner Companies"],["92%","Placement Rate"]];
  const features = [
    { icon:"🔍", title:"Smart Job Search", desc:"LinkedIn-style job discovery with AI-powered matching. Filter by role, company, location, and get personalized recommendations.", cta:"Browse Jobs", page:"jobs", color:"#dbeafe" },
    { icon:"📄", title:"Resume AI Analyzer", desc:"Upload your resume and get instant AI feedback — skill extraction, gap analysis, ATS score, and improvement suggestions.", cta:"Analyze Resume", page:"resume", color:"#dcfce7" },
    { icon:"🎯", title:"AI Mock Interview", desc:"Camera-on live interview with real-time AI analysis. Get scored on communication, depth, confidence, and receive detailed feedback.", cta:"Start Interview", page:"interview", color:"#fef3c7" },
  ];

  return (
    <div style={{ minHeight:"calc(100vh - 60px)", background:"var(--surface2)" }}>
      {/* Hero */}
      <div style={{ position:"relative", overflow:"hidden", background:"linear-gradient(145deg,#0f172a 0%,#1e3a8a 50%,#0f172a 100%)", padding:"100px 48px 80px" }}>
        {/* Animated blobs */}
        {[{top:-80,left:"10%",size:400,c:"rgba(59,130,246,.12)"},{top:100,right:"-5%",size:320,c:"rgba(124,58,237,.1)"},{bottom:-60,left:"40%",size:280,c:"rgba(16,185,129,.08)"}].map((b,i) => (
          <div key={i} style={{ position:"absolute", top:b.top, left:b.left, right:b.right, bottom:b.bottom, width:b.size, height:b.size, borderRadius:"50%", background:b.c, animation:`bgFloat ${8+i*2}s ease-in-out infinite`, pointerEvents:"none" }} />
        ))}
        {/* Grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }} />

        <div style={{ position:"relative", maxWidth:900, margin:"0 auto", textAlign:"center" }}>
          <div className="pill pill-blue" style={{ marginBottom:20, display:"inline-flex", background:"rgba(59,130,246,.15)", color:"#93c5fd", border:"1px solid rgba(59,130,246,.25)", fontSize:12, padding:"5px 14px" }}>
            🚀 Powered by GPT-4o · Trusted by 50,000+ students
          </div>
          <h1 style={{ fontSize:"clamp(40px,6vw,72px)", fontWeight:800, color:"white", lineHeight:1.08, letterSpacing:"-.04em", marginBottom:20, animation:"fadeUp .6s ease" }}>
            Find Jobs.<br /><span style={{ background:"linear-gradient(90deg,#60a5fa,#a78bfa,#34d399)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Ace Interviews.</span><br />Get Hired.
          </h1>
          <p style={{ fontSize:18, color:"rgba(255,255,255,.65)", maxWidth:560, margin:"0 auto 36px", lineHeight:1.65, animation:"fadeUp .6s ease .1s both" }}>
            The AI-powered career platform that prepares you for every step — from resume to offer letter.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", animation:"fadeUp .6s ease .2s both" }}>
            <button className="btn btn-primary" onClick={() => setPage("interview")} style={{ fontSize:15, padding:"13px 30px" }}>
              🎯 Try Mock Interview Free
            </button>
            <button className="btn" onClick={() => setPage("jobs")} style={{ background:"rgba(255,255,255,.1)", color:"white", border:"1px solid rgba(255,255,255,.2)", fontSize:15, padding:"13px 30px", backdropFilter:"blur(8px)" }}>
              Browse 200+ Jobs →
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background:"white", borderBottom:"1px solid var(--border)", padding:"24px 48px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
          {stats.map(([v,l],i) => (
            <div key={i} style={{ textAlign:"center", animation:`countUp .5s ease ${i*.1}s both` }}>
              <div style={{ fontSize:28, fontWeight:800, color:"var(--blue2)", letterSpacing:"-.03em" }}>{v}</div>
              <div style={{ fontSize:12, color:"var(--t3)", marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{ maxWidth:1100, margin:"60px auto", padding:"0 48px" }}>
        <div style={{ textAlign:"center", marginBottom:44 }}>
          <h2 style={{ fontSize:"clamp(28px,4vw,40px)", fontWeight:800, letterSpacing:"-.03em", marginBottom:10 }}>Everything you need to get hired</h2>
          <p style={{ fontSize:15, color:"var(--t2)" }}>Three powerful tools, one seamless platform.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {features.map((f,i) => (
            <div key={i} className="card" style={{ padding:28, animation:`fadeUp .5s ease ${i*.12}s both`, cursor:"default" }}>
              <div style={{ width:52, height:52, borderRadius:14, background:f.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:18 }}>{f.icon}</div>
              <h3 style={{ fontSize:18, fontWeight:700, marginBottom:10, letterSpacing:"-.02em" }}>{f.title}</h3>
              <p style={{ fontSize:13, color:"var(--t2)", lineHeight:1.7, marginBottom:20 }}>{f.desc}</p>
              <button className="btn btn-outline" onClick={() => setPage(f.page)} style={{ fontSize:13 }}>{f.cta} →</button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{ margin:"0 48px 80px", borderRadius:20, background:"linear-gradient(135deg,#1e3a8a,#1d4ed8,#2563eb)", padding:"52px 56px", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 20px 60px rgba(29,78,216,.3)" }}>
        <div>
          <h3 style={{ fontSize:28, fontWeight:800, color:"white", letterSpacing:"-.03em", marginBottom:8 }}>Ready to ace your next interview?</h3>
          <p style={{ color:"rgba(255,255,255,.7)", fontSize:15 }}>Join 50,000+ students who landed their dream jobs with HireMind AI – Interview Prep.</p>
        </div>
        <button className="btn" onClick={() => setPage("interview")} style={{ background:"white", color:"var(--blue2)", fontSize:15, padding:"14px 32px", fontWeight:700, flexShrink:0 }}>
          Start for Free →
        </button>
      </div>
    </div>
  );
}

/* ─── JOB SEARCH PAGE ────────────────────────────────────────────────────── */
function JobsPage({ setPage, applied, setApplied }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = JOBS.filter(j => {
    const q = search.toLowerCase();
    const match = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.tags.some(t=>t.toLowerCase().includes(q));
    const type = filter === "all" || j.type.toLowerCase().replace("-","") === filter;
    return match && type;
  });

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 48px" }}>
      <div style={{ marginBottom:28, animation:"fadeUp .4s ease" }}>
        <h1 style={{ fontSize:28, fontWeight:800, letterSpacing:"-.03em", marginBottom:4 }}>Job Search</h1>
        <p style={{ fontSize:14, color:"var(--t2)" }}>Find your perfect role from 200+ curated opportunities</p>
      </div>

      {/* Search bar */}
      <div style={{ display:"flex", gap:12, marginBottom:20, animation:"fadeUp .4s ease .1s both" }}>
        <div style={{ flex:1, position:"relative" }}>
          <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"var(--t3)", fontSize:16 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Search "SDE Intern, Google, React..."' style={{ width:"100%", padding:"12px 16px 12px 42px", fontSize:14, borderRadius:10 }} />
        </div>
        {["all","remote","hybrid","onsite"].map(f => (
          <button key={f} className="btn" onClick={() => setFilter(f)} style={{ background: filter===f ? "var(--blue2)" : "white", color: filter===f ? "white" : "var(--t2)", border:"1.5px solid", borderColor: filter===f ? "var(--blue2)" : "var(--border2)", fontSize:13, padding:"10px 18px", textTransform:"capitalize" }}>
            {f === "all" ? "All Types" : f}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap:16 }}>
        {/* Job list */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ fontSize:13, color:"var(--t3)", marginBottom:4 }} className="mono">{filtered.length} results</div>
          {filtered.map((job, i) => (
            <div key={job.id} className="card" onClick={() => setSelected(job)} style={{ padding:"18px 20px", cursor:"pointer", animation:`fadeUp .4s ease ${i*.06}s both`, borderColor: selected?.id===job.id ? "var(--blue3)" : "var(--border)", boxShadow: selected?.id===job.id ? "0 0 0 2px rgba(59,130,246,.15)" : "var(--shadow)" }}>
              <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                <div style={{ width:46, height:46, borderRadius:10, background:job.color+"22", border:`1.5px solid ${job.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{job.logo}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, marginBottom:3 }}>{job.title}</div>
                      <div style={{ fontSize:13, color:"var(--t2)", display:"flex", alignItems:"center", gap:8 }}>
                        <span>{job.company}</span>
                        <span style={{ color:"var(--border2)" }}>·</span>
                        <span>{job.location}</span>
                        <span style={{ color:"var(--border2)" }}>·</span>
                        <span className="pill pill-blue" style={{ fontSize:10 }}>{job.type}</span>
                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:"var(--green)" }}>{job.salary}</div>
                      <div style={{ fontSize:11, color:"var(--t3)", marginTop:2 }} className="mono">{job.posted}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap", alignItems:"center" }}>
                    {job.tags.map(t => <span key={t} className="pill pill-neutral" style={{ fontSize:11 }}>{t}</span>)}
                    <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
                      {applied.includes(job.id)
                        ? <span className="pill pill-green">✓ Applied</span>
                        : <button className="btn btn-primary" onClick={e=>{e.stopPropagation();setApplied(p=>[...p,job.id]);}} style={{ padding:"5px 14px", fontSize:12 }}>Apply Now</button>
                      }
                      <button className="btn btn-outline" onClick={e=>{e.stopPropagation();setPage("interview");}} style={{ padding:"5px 14px", fontSize:12 }}>Mock Interview</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Job detail panel */}
        {selected && (
          <div className="card-flat" style={{ padding:24, height:"fit-content", position:"sticky", top:80, animation:"fadeIn .25s ease" }}>
            <button onClick={() => setSelected(null)} style={{ float:"right", background:"none", border:"none", cursor:"pointer", fontSize:18, color:"var(--t3)" }}>✕</button>
            <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
              <div style={{ width:52, height:52, borderRadius:12, background:selected.color+"22", border:`1.5px solid ${selected.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{selected.logo}</div>
              <div>
                <div style={{ fontSize:17, fontWeight:700 }}>{selected.title}</div>
                <div style={{ fontSize:13, color:"var(--t2)" }}>{selected.company} · {selected.location}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
              <span className="pill pill-blue">{selected.type}</span>
              <span className="pill pill-green">{selected.salary}</span>
              <span className="mono" style={{ fontSize:11, color:"var(--t3)", alignSelf:"center" }}>{selected.applicants} applicants</span>
            </div>
            <div style={{ fontSize:13, color:"var(--t2)", lineHeight:1.75, marginBottom:16 }}>
              We're looking for a passionate {selected.title} to join our {selected.company} team. You'll work on challenging problems, collaborate with talented engineers, and make an impact at scale. Strong fundamentals in {selected.tags.join(", ")} required.
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:600, marginBottom:8, color:"var(--t3)", textTransform:"uppercase", letterSpacing:".06em" }}>Required Skills</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {selected.tags.map(t => <span key={t} className="pill pill-blue">{t}</span>)}
              </div>
            </div>
            <div style={{ display:"flex", gap:10, flexDirection:"column" }}>
              {applied.includes(selected.id)
                ? <div className="pill pill-green" style={{ justifyContent:"center", padding:"10px" }}>✓ Already Applied</div>
                : <button className="btn btn-primary" onClick={()=>setApplied(p=>[...p,selected.id])} style={{ width:"100%" }}>Apply to {selected.company} →</button>
              }
              <button className="btn btn-outline" onClick={() => setPage("interview")} style={{ width:"100%" }}>🎯 Practice Mock Interview</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* ─── RESUME HUB ─────────────────────────────────────────────────────────── */
function ResumePage({ setPage, onResumeAnalyzed }) {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const STEPS = [
    "Reading resume content...",
    "Extracting skills & experience...",
    "Calculating ATS compatibility score...",
    "Identifying skill gaps...",
    "Matching job opportunities...",
    "Generating interview preparation plan...",
  ];

  const readFileAsBase64 = (f) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(f);
  });

  const readFileAsText = (f) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(f);
  });

  const analyzeResume = async (f) => {
    if (!f) return;
    setFile(f);
    setAnalyzing(true);
    setAnalysisStep(0);
    setResult(null);
    setError("");

    try {
      // Step through analysis steps with timing
      const stepTimer = setInterval(() => {
        setAnalysisStep(prev => Math.min(prev + 1, STEPS.length - 1));
      }, 900);

      // Read file content
      let fileContent = "";
      let messageContent = [];

      if (f.type === "application/pdf") {
        // Send as base64 document
        const base64 = await readFileAsBase64(f);
        messageContent = [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: base64 }
          },
          { type: "text", text: "This is the candidate's resume PDF. Analyze it thoroughly." }
        ];
      } else {
        // .doc/.docx — read as text (best effort)
        try { fileContent = await readFileAsText(f); } catch (e) { fileContent = ""; }
        messageContent = [{ type: "text", text: `Resume content:\n\n${fileContent || "(Could not extract text — infer from filename: " + f.name + ")"}` }];
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: `You are an expert resume analyst and career coach. Analyze the provided resume thoroughly and return ONLY valid JSON — no markdown, no explanation, no extra text.

Return this exact JSON structure:
{
  "name": "candidate full name",
  "title": "current role or target role inferred from resume",
  "summary": "2-3 sentence professional summary of the candidate",
  "experience_years": 2,
  "current_company": "most recent company or 'Student' if student",
  "education": "highest degree and institution",
  "skills": ["skill1", "skill2", ...],
  "top_skills": ["top 3-5 most prominent skills"],
  "experience_highlights": ["key achievement 1", "key achievement 2", "key achievement 3"],
  "projects": ["notable project 1", "notable project 2"],
  "atsScore": 74,
  "ats_feedback": "one sentence on why this ATS score",
  "gaps": ["missing skill or experience 1", "gap 2", "gap 3"],
  "improvements": ["specific actionable improvement 1", "improvement 2", "improvement 3", "improvement 4"],
  "matchJobs": [
    {"title": "best matching role", "company": "example company", "match": 91},
    {"title": "second match", "company": "example company", "match": 84},
    {"title": "third match", "company": "example company", "match": 78}
  ],
  "interview_focus": {
    "strong_areas": ["area where candidate is strong", "another strong area"],
    "weak_areas": ["area to probe deeply", "another weak area"],
    "key_questions": [
      "Specific interview question tailored to this resume",
      "Another specific question",
      "Another specific question",
      "Another specific question",
      "Another specific question"
    ],
    "recommended_interview_type": "fullstack",
    "target_role": "best role to interview for based on resume",
    "target_company_type": "startup/mid-size/FAANG",
    "context": "2-3 sentence summary of what makes this candidate unique and what interviewers will probe"
  }
}

For recommended_interview_type, choose from: fullstack, frontend, backend, ml, behavioral
Be specific and accurate — tailor key_questions to the candidate's actual experience, projects, and skills.`,
          messages: [{ role: "user", content: messageContent }]
        })
      });

      clearInterval(stepTimer);
      setAnalysisStep(STEPS.length - 1);

      const data = await response.json();
      const text = data.content?.[0]?.text || "{}";
      let parsed;
      try {
        parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      } catch (e) {
        throw new Error("AI response could not be parsed. Please try again.");
      }

      setResult(parsed);
      onResumeAnalyzed(parsed); // Store in App root for InterviewPage
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|doc|docx)$/i)) {
      setError("Please upload a PDF, DOC, or DOCX file.");
      return;
    }
    analyzeResume(f);
  };

  const atsColor = result ? (result.atsScore >= 80 ? "var(--green)" : result.atsScore >= 60 ? "var(--blue2)" : "var(--amber)") : "var(--blue2)";
  const atsLabel = result ? (result.atsScore >= 80 ? "Excellent" : result.atsScore >= 60 ? "Good — Above Average" : "Needs Work") : "";

  return (
    <div style={{ maxWidth: 1060, margin: "0 auto", padding: "32px 48px 60px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 4 }}>Resume Hub</h1>
        <p style={{ fontSize: 14, color: "var(--t2)" }}>AI-powered resume analysis — skills, ATS score, gaps, and personalized interview generation</p>
      </div>

      {/* Upload / Analyzing state */}
      {!result ? (
        <div className="card" style={{ padding: "60px 40px", textAlign: "center", animation: "fadeUp .4s ease" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Upload your resume</h2>
          <p style={{ color: "var(--t2)", fontSize: 14, marginBottom: 32 }}>AI will parse your actual experience, generate personalised interview questions, and create a tailored mock interview</p>

          {error && (
            <div style={{ marginBottom: 20, padding: "10px 16px", background: "var(--red-soft)", border: "1px solid rgba(220,38,38,.2)", borderRadius: 8, fontSize: 13, color: "var(--red)" }}>
              ⚠️ {error}
            </div>
          )}

          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => !analyzing && fileRef.current.click()}
            style={{ border: "2px dashed var(--border2)", borderRadius: 14, padding: "40px 24px", cursor: analyzing ? "default" : "pointer", background: "var(--surface2)", marginBottom: 20, transition: "all .2s" }}
            onMouseEnter={e => { if (!analyzing) e.currentTarget.style.borderColor = "var(--blue3)"; }}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border2)"}
          >
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />

            {analyzing ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <div style={{ width: 36, height: 36, border: "3px solid var(--border2)", borderTopColor: "var(--blue2)", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--t1)" }}>Analyzing with AI...</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 380 }}>
                  {STEPS.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, opacity: i <= analysisStep ? 1 : 0.25, transition: "opacity .4s" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: i < analysisStep ? "var(--green2)" : i === analysisStep ? "var(--blue2)" : "var(--surface3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background .3s" }}>
                        {i < analysisStep
                          ? <span style={{ color: "white", fontSize: 10 }}>✓</span>
                          : i === analysisStep
                          ? <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />
                          : null}
                      </div>
                      <span style={{ fontSize: 12, color: i <= analysisStep ? "var(--t1)" : "var(--t3)", fontWeight: i === analysisStep ? 600 : 400 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 32, marginBottom: 10 }}>⬆️</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Drag & drop or click to upload</div>
                <div className="mono" style={{ fontSize: 12, color: "var(--t3)" }}>.PDF · .DOC · .DOCX supported</div>
              </>
            )}
          </div>
        </div>

      ) : (
        /* ── Results ── */
        <div style={{ animation: "fadeUp .4s ease" }}>

          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Profile card */}
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: "white", fontWeight: 700, fontSize: 16 }}>{(result.name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{result.name || "Candidate"}</div>
                        <div style={{ fontSize: 13, color: "var(--t2)" }}>{result.title}</div>
                        {result.education && <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 2 }}>🎓 {result.education}</div>}
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.75, marginBottom: 12 }}>{result.summary}</p>
                    {result.experience_highlights?.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {result.experience_highlights.map((h, i) => (
                          <div key={i} style={{ display: "flex", gap: 7, fontSize: 12, color: "var(--t2)" }}>
                            <span style={{ color: "var(--green)", flexShrink: 0 }}>✓</span>{h}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="btn btn-ghost" style={{ fontSize: 12, flexShrink: 0, marginLeft: 12 }} onClick={() => { setFile(null); setResult(null); onResumeAnalyzed(null); }}>↑ New Upload</button>
                </div>
              </div>

              {/* Skills */}
              <div className="card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--blue2)" }}>⟡</span> Extracted Skills
                  <span className="mono" style={{ fontSize: 11, color: "var(--t3)", marginLeft: "auto" }}>{result.skills?.length || 0} found</span>
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {result.skills?.map((s, i) => {
                    const isTop = result.top_skills?.includes(s);
                    return (
                      <span key={s} className={`pill ${isTop ? "pill-blue" : ["pill-green", "pill-purple", "pill-amber"][i % 3]}`} style={{ fontSize: 12, padding: "5px 12px", fontWeight: isTop ? 700 : 400 }}>
                        {isTop && "⭐ "}{s}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* AI Improvement Suggestions */}
              <div className="card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--amber)" }}>💡</span> AI Improvement Suggestions
                </h3>
                {result.improvements?.map((imp, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: i % 2 === 0 ? "var(--surface2)" : "white", borderRadius: 8, marginBottom: 8 }}>
                    <span style={{ color: "var(--blue2)", flexShrink: 0, marginTop: 1 }}>→</span>
                    <span style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.6 }}>{imp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* ATS Score */}
              <div className="card" style={{ padding: 22, textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--t3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>ATS Score</div>
                <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 12px" }}>
                  <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--surface3)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke={atsColor} strokeWidth="10" strokeDasharray={`${(result.atsScore || 0) * 3.14} 314`} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: atsColor, letterSpacing: "-.03em" }}>{result.atsScore}</span>
                    <span style={{ fontSize: 11, color: "var(--t3)" }}>/ 100</span>
                  </div>
                </div>
                <div className={`pill ${result.atsScore >= 80 ? "pill-green" : result.atsScore >= 60 ? "pill-blue" : "pill-amber"}`} style={{ fontSize: 12 }}>{atsLabel}</div>
                {result.ats_feedback && <p style={{ fontSize: 11, color: "var(--t3)", marginTop: 10, lineHeight: 1.5 }}>{result.ats_feedback}</p>}
              </div>

              {/* Skill gaps */}
              <div className="card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>⚠️ Skill Gaps</h3>
                {result.gaps?.map((g, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "8px 0", borderBottom: i < result.gaps.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <span style={{ color: "var(--amber)", fontSize: 12, marginTop: 2, flexShrink: 0 }}>!</span>
                    <span style={{ fontSize: 12, color: "var(--t2)" }}>{g}</span>
                  </div>
                ))}
              </div>

              {/* Job matches */}
              <div className="card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🎯 Best Job Matches</h3>
                {result.matchJobs?.map((j, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < result.matchJobs.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{j.title}</div>
                      <div style={{ fontSize: 11, color: "var(--t2)" }}>{j.company}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: j.match >= 85 ? "var(--green)" : "var(--blue2)" }}>{j.match}%</div>
                      <div style={{ fontSize: 10, color: "var(--t3)" }}>match</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Personalized Interview CTA ── */}
          {result.interview_focus && (
            <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a8a,#0f1f0f)", borderRadius: 16, padding: 28, color: "white", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 24 }}>🤖</span>
                      <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.02em" }}>Personalized Interview Ready</h3>
                    </div>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,.65)", lineHeight: 1.7, maxWidth: 560 }}>{result.interview_focus.context}</p>
                  </div>
                  <div style={{ flexShrink: 0, marginLeft: 20, textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>Target Role</div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{result.interview_focus.target_role}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 3 }}>{result.interview_focus.target_company_type}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
                  {/* Strong areas */}
                  <div style={{ background: "rgba(16,185,129,.12)", border: "1px solid rgba(16,185,129,.25)", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, color: "rgba(52,211,153,.8)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>✓ Strong Areas</div>
                    {result.interview_focus.strong_areas?.map((a, i) => (
                      <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,.75)", marginBottom: 4, display: "flex", gap: 6 }}>
                        <span style={{ color: "#34d399", flexShrink: 0 }}>→</span>{a}
                      </div>
                    ))}
                  </div>

                  {/* Areas to probe */}
                  <div style={{ background: "rgba(245,158,11,.1)", border: "1px solid rgba(245,158,11,.25)", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, color: "rgba(251,191,36,.8)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>⚠ Will Be Probed</div>
                    {result.interview_focus.weak_areas?.map((a, i) => (
                      <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,.75)", marginBottom: 4, display: "flex", gap: 6 }}>
                        <span style={{ color: "#fbbf24", flexShrink: 0 }}>!</span>{a}
                      </div>
                    ))}
                  </div>

                  {/* Sample questions */}
                  <div style={{ background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.25)", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, color: "rgba(147,197,253,.8)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>🎯 Sample Questions</div>
                    {result.interview_focus.key_questions?.slice(0, 3).map((q, i) => (
                      <div key={i} style={{ fontSize: 11, color: "rgba(255,255,255,.65)", marginBottom: 6, lineHeight: 1.5, display: "flex", gap: 6 }}>
                        <span style={{ color: "#93c5fd", flexShrink: 0 }}>{i + 1}.</span>{q}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <button
                    onClick={() => setPage("interview")}
                    style={{ padding: "12px 28px", background: "linear-gradient(135deg,#2563eb,#7c3aed)", border: "none", borderRadius: 10, color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "opacity .2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = ".9"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    🎯 Start Personalised Interview
                  </button>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)" }}>
                    AI will ask questions tailored to your exact background
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


/* ─── MOCK INTERVIEW PAGE ────────────────────────────────────────────────── */
function InterviewPage({ resumeData }) {
  const [phase, setPhase] = useState("setup");
  const [jobRole, setJobRole] = useState(() => resumeData?.interview_focus?.target_role || "Software Engineer Intern");
  const [jobCompany, setJobCompany] = useState(() => resumeData?.interview_focus?.target_company_type || "Google");
  const [interviewType, setInterviewType] = useState(() => resumeData?.interview_focus?.recommended_interview_type || "fullstack");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [qNum, setQNum] = useState(0);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [report, setReport] = useState(null);
  const [answerScores, setAnswerScores] = useState([]);
  const [camError, setCamError] = useState("");
  const [micError, setMicError] = useState("");
  const [camReady, setCamReady] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({ confidence: 72, eyeContact: 68, pace: 75, clarity: 80 });
  const [generatingReport, setGeneratingReport] = useState(false);

  const [voiceOn, setVoiceOn] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const videoRef = useRef();
  const chatRef = useRef();
  const timerRef = useRef();
  const streamRef = useRef();
  const recognitionRef = useRef();
  const metricsRef = useRef();
  const synthRef = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);

  // ── Load TTS voices ──
  useEffect(() => {
    const loadVoices = () => {
      if (!window.speechSynthesis) return;
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        setVoices(v);
        const preferred =
          v.find(x => /google us english/i.test(x.name)) ||
          v.find(x => /samantha|daniel|karen|moira|alex/i.test(x.name)) ||
          v.find(x => x.lang === "en-US") ||
          v.find(x => x.lang.startsWith("en")) ||
          v[0];
        setSelectedVoice(prev => prev || preferred?.name || null);
      }
    };
    loadVoices();
    if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    return () => { if (window.speechSynthesis) window.speechSynthesis.cancel(); };
  }, []);

  const speakText = (text, onEnd) => {
    if (!voiceOn || !text || !window.speechSynthesis) { onEnd?.(); return; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    // Split into sentence chunks to avoid Chrome cutting off long utterances
    const chunks = text.match(/[^.!?\n]+[.!?\n]*/g) || [text];
    let idx = 0;
    const speakChunk = () => {
      if (idx >= chunks.length) { setSpeaking(false); onEnd?.(); return; }
      const utter = new SpeechSynthesisUtterance(chunks[idx++].trim());
      utter.rate = 0.9;
      utter.pitch = 1.05;
      utter.volume = 1;
      if (selectedVoice) {
        const v = window.speechSynthesis?.getVoices().find(x => x.name === selectedVoice);
        if (v) utter.voice = v;
      }
      if (idx === 1) utter.onstart = () => setSpeaking(true);
      utter.onend = speakChunk;
      utter.onerror = speakChunk;
      window.speechSynthesis?.speak(utter);
    };
    speakChunk();
  };

  const stopSpeaking = () => { if (window.speechSynthesis) window.speechSynthesis.cancel(); setSpeaking(false); };

  const INTERVIEW_CONFIGS = {
    fullstack: { label: "Full Stack", rounds: [
      { type: "Intro", q: 1 },
      { type: "Behavioral", q: 3 },
      { type: "Technical", q: 4 },
      { type: "System Design", q: 2 }
    ], total: 10 },
    frontend: { label: "Frontend", rounds: [
      { type: "Intro", q: 1 },
      { type: "Behavioral", q: 2 },
      { type: "Technical", q: 5 },
      { type: "System Design", q: 2 }
    ], total: 10 },
    backend: { label: "Backend", rounds: [
      { type: "Intro", q: 1 },
      { type: "Behavioral", q: 2 },
      { type: "Technical", q: 4 },
      { type: "System Design", q: 3 }
    ], total: 10 },
    ml: { label: "ML Engineer", rounds: [
      { type: "Intro", q: 1 },
      { type: "Behavioral", q: 2 },
      { type: "ML Theory", q: 4 },
      { type: "System Design", q: 3 }
    ], total: 10 },
    behavioral: { label: "Behavioral Only", rounds: [
      { type: "Intro", q: 1 },
      { type: "Behavioral", q: 9 }
    ], total: 10 },
  };

  const plan = INTERVIEW_CONFIGS[interviewType];

  const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const currentRound = (() => {
    let acc = 0;
    for (const r of plan.rounds) {
      acc += r.q;
      if (qNum < acc) return r.type;
    }
    return plan.rounds[plan.rounds.length - 1].type;
  })();

  // ── Camera ──
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCamReady(true); setCamError("");
    } catch (e) {
      setCamError("Camera access denied. Please allow camera permission.");
      setCamReady(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().filter(t => t.kind === "video").forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamReady(false);
  };

  const toggleCamera = () => {
    if (cameraOn) { stopCamera(); setCameraOn(false); }
    else { setCameraOn(true); startCamera(); }
  };

  // ── Microphone / Speech Recognition ──
  const startMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setMicError("Speech recognition not supported in this browser."); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onstart = () => { setListening(true); setMicReady(true); setMicError(""); };
    rec.onresult = (e) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setInput(transcript);
    };
    rec.onerror = (e) => {
      if (e.error !== "no-speech") setMicError("Microphone error: " + e.error);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    try { rec.start(); } catch (e) { setMicError("Could not start mic."); }
  };

  const stopMic = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const toggleMic = () => {
    if (micOn) { stopMic(); setMicOn(false); }
    else { setMicOn(true); startMic(); }
  };

  // ── Setup: request permissions ──
  const requestPermissions = async () => {
    await startCamera();
    startMic();
  };

  // ── Live metrics simulation (updates every 2s based on conversation activity) ──
  useEffect(() => {
    if (phase !== "live") return;
    metricsRef.current = setInterval(() => {
      setLiveMetrics(prev => ({
        confidence: Math.min(95, Math.max(45, prev.confidence + (Math.random() * 6 - 2.5))),
        eyeContact: Math.min(95, Math.max(40, prev.eyeContact + (Math.random() * 8 - 3))),
        pace: Math.min(95, Math.max(50, prev.pace + (Math.random() * 5 - 2))),
        clarity: Math.min(98, Math.max(55, prev.clarity + (Math.random() * 4 - 1.5))),
      }));
    }, 2000);
    return () => clearInterval(metricsRef.current);
  }, [phase]);

  // ── Timer ──
  useEffect(() => {
    if (phase === "live") {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // ── Scroll chat ──
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, aiLoading]);

  // ── Agentic AI: call Anthropic API ──
  const callAI = async (userAnswer, history, questionNumber, totalQ, role, company, roundType) => {
    // Build resume context block if available
    const resumeCtx = resumeData ? `
CANDIDATE BACKGROUND (from parsed resume):
- Name: ${resumeData.name || "Candidate"}
- Current role/level: ${resumeData.title || ""}
- Experience: ${resumeData.experience_years || "?"} years
- Education: ${resumeData.education || ""}
- Top skills: ${resumeData.top_skills?.join(", ") || resumeData.skills?.slice(0,6).join(", ") || ""}
- All skills: ${resumeData.skills?.join(", ") || ""}
- Notable projects: ${resumeData.projects?.join("; ") || "None listed"}
- Key achievements: ${resumeData.experience_highlights?.join("; ") || "None listed"}
- Skill gaps identified: ${resumeData.gaps?.join(", ") || "None"}
- Strong areas to affirm: ${resumeData.interview_focus?.strong_areas?.join(", ") || ""}
- Areas to probe deeply: ${resumeData.interview_focus?.weak_areas?.join(", ") || ""}
- Pre-generated tailored questions to draw from: 
  ${resumeData.interview_focus?.key_questions?.map((q,i) => `  ${i+1}. ${q}`).join("\n") || ""}

IMPORTANT: Use this resume data to ask highly specific questions. Reference their actual projects, skills and experiences by name. Don't ask generic questions — ask questions like "I see you built X project using Y — walk me through how you handled Z" or "Your resume mentions experience with A — how would you use that at scale?"
` : "";

    const systemPrompt = `You are an expert technical interviewer at ${company} conducting a ${roundType} interview for a ${role} position. You are highly experienced, professional, and insightful.
${resumeCtx}
Your behavior:
- Ask ONE focused question at a time. Never ask multiple questions in one message.
- Adapt follow-up questions based on the candidate's previous answers - dig deeper if they give shallow answers.
- For behavioral questions, prompt for STAR format if not used.
- For technical questions, probe for edge cases, complexity analysis, and alternatives.
- For system design, explore scalability, trade-offs, and failure modes.
- Keep your messages concise (2-4 sentences max when asking a question).
- When giving feedback mid-interview, be brief and then ask the next question.
- You are on question ${questionNumber} of ${totalQ} total questions.
- Round type: ${roundType}

Question progression strategy:
- Q1: Always start with a warm intro — reference their background from the resume if available, then ask them to elaborate on it. e.g., "I've had a chance to review your profile — I can see you've worked on [specific project/skill]. Tell me about yourself and what draws you to this ${role} role at ${company}."
- Behavioral (STAR format): probe leadership, conflict, failure, achievement, teamwork — tie to their specific background
- Technical: ask about their listed skills specifically, probe depth on technologies they've used
- System Design: design a real system relevant to ${company}'s scale and the candidate's experience level

If this is the LAST question (question ${totalQ}), after the candidate answers, say "Thank you for your time today! I have all the information I need. Your session is complete." and nothing else.

Do NOT number your questions. Do NOT say "Question X of Y". Just ask naturally like a real interviewer.`;

    const apiMessages = [
      ...history.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })),
      ...(userAnswer ? [{ role: "user", content: userAnswer }] : [])
    ];

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: apiMessages.length > 0 ? apiMessages : [{ role: "user", content: "Start the interview." }]
        })
      });
      const data = await resp.json();
      return data.content?.[0]?.text || "Thank you for your answer. Let's move on.";
    } catch (e) {
      return "I appreciate your answer. Let's continue — " + getFallbackQuestion(questionNumber, roundType, role);
    }
  };

  // ── Per-answer scoring via AI ──
  const scoreAnswer = async (question, answer, roundType) => {
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          messages: [{
            role: "user",
            content: `You are an expert interview evaluator. Score this answer strictly and return ONLY valid JSON.

Question (${roundType}): ${question}
Answer: ${answer}

Return ONLY this JSON structure, no other text:
{"clarity":7,"depth":6,"relevance":8,"structure":7,"score":7.0,"feedback":"One sentence of specific feedback","strength":"One specific strength","improvement":"One specific improvement area"}`
          }]
        })
      });
      const data = await resp.json();
      const text = data.content?.[0]?.text || "{}";
      try {
        return JSON.parse(text.replace(/```json|```/g, "").trim());
      } catch { return null; }
    } catch { return null; }
  };

  // ── Generate final report via AI ──
  const generateReport = async (msgs, scores, duration, role, company) => {
    const transcript = msgs.map(m => `${m.role === "ai" ? "Interviewer" : "Candidate"}: ${m.text}`).join("\n");
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + (b?.score || 0), 0) / scores.length) : 0;
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{
            role: "user",
            content: `You are an expert interview coach. Analyze this complete interview transcript and generate a detailed performance report. Return ONLY valid JSON, no other text.

Role: ${role} at ${company}
Duration: ${fmtTime(duration)}
Average answer score: ${avgScore.toFixed(1)}/10

Transcript:
${transcript}

Return ONLY this JSON:
{
  "overall": 7.2,
  "comm": 7.8,
  "tech": 6.9,
  "behavioral": 7.5,
  "confidence": 7.1,
  "problemSolving": 6.8,
  "cultureFit": 8.0,
  "hire_recommendation": "Strong Maybe",
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3", "specific strength 4"],
  "weaknesses": ["specific weakness 1", "specific weakness 2", "specific weakness 3"],
  "next_steps": ["actionable step 1", "actionable step 2", "actionable step 3", "actionable step 4"],
  "answer_breakdown": [
    {"aspect": "Communication Clarity", "score": 7.5, "comment": "one sentence"},
    {"aspect": "Technical Depth", "score": 6.8, "comment": "one sentence"},
    {"aspect": "STAR Format Usage", "score": 7.2, "comment": "one sentence"},
    {"aspect": "Problem-Solving Approach", "score": 7.0, "comment": "one sentence"},
    {"aspect": "Confidence & Delivery", "score": 7.8, "comment": "one sentence"}
  ],
  "overall_summary": "2-3 sentence honest assessment of the candidate's performance"
}`
          }]
        })
      });
      const data = await resp.json();
      const text = data.content?.[0]?.text || "{}";
      return JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch (e) {
      return null;
    }
  };

  const getFallbackQuestion = (qNum, roundType, role) => {
    const fallbacks = {
      "Intro": "Tell me about yourself and what excites you about this role.",
      "Behavioral": ["Describe a time you faced a major technical challenge and how you overcame it.", "Tell me about a project you're most proud of.", "Give an example of when you had to collaborate across teams.", "Describe a time you failed and what you learned.", "Tell me about a time you had to meet a tight deadline."][qNum % 5],
      "Technical": ["Explain the difference between synchronous and asynchronous programming.", "How does garbage collection work?", "What's the difference between a process and a thread?", "Explain Big-O notation with examples.", "What are the SOLID principles?"][qNum % 5],
      "System Design": ["Design a URL shortener like bit.ly.", "How would you design Twitter's newsfeed?"][qNum % 2],
      "ML Theory": ["Explain the bias-variance tradeoff.", "What is gradient descent and how does it work?"][qNum % 2],
    };
    return fallbacks[roundType] || "What's your approach to writing clean, maintainable code?";
  };

  // ── Start interview ──
  const startInterview = async () => {
    setPhase("live");
    setMessages([]);
    setQNum(0);
    setAnswerScores([]);
    setElapsed(0);
    setAiLoading(true);
    const firstQ = await callAI(null, [], 1, plan.total, jobRole, jobCompany, plan.rounds[0].type);
    setMessages([{ role: "ai", text: firstQ, ts: "00:00", roundType: plan.rounds[0].type }]);
    setAiLoading(false);
    speakText(firstQ);
  };

  // ── Send answer ──
  const sendAnswer = async () => {
    if (!input.trim() || aiLoading) return;
    const text = input.trim();
    setInput("");
    stopSpeaking();
    stopMic();

    const currentQ = messages.filter(m => m.role === "ai").slice(-1)[0]?.text || "";
    const newQNum = qNum + 1;
    const newMessages = [...messages, { role: "user", text, ts: fmtTime(elapsed) }];
    setMessages(newMessages);
    setQNum(newQNum);
    setAiLoading(true);

    // Score this answer in background
    const roundT = currentRound;
    scoreAnswer(currentQ, text, roundT).then(sc => {
      if (sc) setAnswerScores(prev => [...prev, { ...sc, question: currentQ, answer: text, roundType: roundT }]);
    });

    const isLast = newQNum >= plan.total;

    if (isLast) {
      // End interview
      const aiReply = await callAI(text, messages, newQNum, plan.total, jobRole, jobCompany, currentRound);
      setMessages(p => [...p, { role: "ai", text: aiReply, ts: fmtTime(elapsed), roundType: currentRound }]);
      setAiLoading(false);
      speakText(aiReply);

      // Generate full report
      setTimeout(async () => {
        clearInterval(timerRef.current);
        clearInterval(metricsRef.current);
        setGeneratingReport(true);
        const finalMessages = [...newMessages, { role: "ai", text: aiReply }];
        const rep = await generateReport(finalMessages, answerScores, elapsed, jobRole, jobCompany);
        setReport(rep || {
          overall: 7.1, comm: 7.5, tech: 6.8, behavioral: 7.3, confidence: 7.0, problemSolving: 6.9, cultureFit: 7.8,
          hire_recommendation: "Maybe",
          strengths: ["Good communication style", "Structured problem-solving", "Relevant experience", "Enthusiasm for the role"],
          weaknesses: ["System design needs more depth", "Technical answers lacked concrete examples", "STAR format inconsistently applied"],
          next_steps: ["Practice 2 system design problems daily", "Prepare 5 STAR stories for behavioral questions", "Review data structures and algorithms", "Do mock salary negotiation sessions"],
          answer_breakdown: [
            { aspect: "Communication Clarity", score: 7.5, comment: "Generally clear but occasional rambling." },
            { aspect: "Technical Depth", score: 6.8, comment: "Good fundamentals but missed edge cases." },
            { aspect: "STAR Format Usage", score: 7.2, comment: "Partially used — add more quantified outcomes." },
            { aspect: "Problem-Solving Approach", score: 7.0, comment: "Logical approach, could explore alternatives." },
            { aspect: "Confidence & Delivery", score: 7.8, comment: "Confident and composed throughout." }
          ],
          overall_summary: "The candidate demonstrated solid foundational knowledge and good communication skills. With more depth in system design and stronger use of the STAR method, they'd be a compelling candidate."
        });
        setGeneratingReport(false);
        setPhase("report");
      }, 3000);
    } else {
      // Next question
      const nextRound = (() => {
        let acc = 0;
        for (const r of plan.rounds) { acc += r.q; if (newQNum < acc) return r.type; }
        return plan.rounds[plan.rounds.length - 1].type;
      })();
      const aiReply = await callAI(text, newMessages, newQNum + 1, plan.total, jobRole, jobCompany, nextRound);
      setMessages(p => [...p, { role: "ai", text: aiReply, ts: fmtTime(elapsed), roundType: nextRound }]);
      setAiLoading(false);
      speakText(aiReply, () => { if (micOn) setTimeout(() => startMic(), 400); });
    }
  };

  const endEarly = async () => {
    clearInterval(timerRef.current);
    clearInterval(metricsRef.current);
    stopSpeaking(); stopMic(); stopCamera();
    setGeneratingReport(true);
    setPhase("report");
    const rep = await generateReport(messages, answerScores, elapsed, jobRole, jobCompany);
    setReport(rep || { overall: 6.5, comm: 7.0, tech: 6.0, behavioral: 6.5, confidence: 6.5, problemSolving: 6.0, cultureFit: 7.0, hire_recommendation: "Maybe", strengths: ["Good start", "Clear communication"], weaknesses: ["Interview incomplete"], next_steps: ["Complete a full mock session", "Practice more questions"], answer_breakdown: [], overall_summary: "Interview ended early. Complete the full session for accurate scoring." });
    setGeneratingReport(false);
  };

  const resetInterview = () => {
    stopSpeaking(); stopMic(); stopCamera();
    setPhase("setup"); setMessages([]); setQNum(0); setElapsed(0);
    setAnswerScores([]); setReport(null); setInput("");
    setCamReady(false); setMicReady(false); setListening(false);
  };

  // ── SETUP PHASE ──
  if (phase === "setup") return (
    <div style={{ maxWidth: 760, margin: "36px auto", padding: "0 48px 60px" }}>
      <div style={{ animation: "fadeUp .4s ease" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 4 }}>AI Mock Interview</h1>
        <p style={{ fontSize: 14, color: "var(--t2)", marginBottom: resumeData ? 16 : 28 }}>Agentic AI interviewer · Real camera & mic · Deep performance analysis</p>
      </div>

      {resumeData && (
        <div style={{ marginBottom: 20, padding: "14px 20px", background: "linear-gradient(135deg,rgba(37,99,235,.08),rgba(124,58,237,.06))", border: "1.5px solid rgba(37,99,235,.2)", borderRadius: 12, display: "flex", gap: 14, alignItems: "center", animation: "fadeUp .4s ease .05s both" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "white", fontSize: 16 }}>📄</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--blue2)" }}>Resume-Personalized Mode</span>
              <span className="pill pill-blue" style={{ fontSize: 10 }}>ACTIVE</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--t2)" }}>
              Loaded <strong>{resumeData.name}</strong>'s resume · {resumeData.skills?.length || 0} skills · AI will ask questions tailored to your exact background, projects, and experience
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, maxWidth: 200 }}>
            {resumeData.top_skills?.slice(0, 4).map(s => (
              <span key={s} className="pill pill-blue" style={{ fontSize: 10 }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Config */}
      <div className="card" style={{ padding: 28, marginBottom: 16, animation: "fadeUp .4s ease .05s both" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>🎯 Interview Configuration</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--t2)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Target Role</label>
            <input value={jobRole} onChange={e => setJobRole(e.target.value)} style={{ width: "100%", padding: "10px 12px", fontSize: 13 }} placeholder="e.g. Frontend Engineer" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--t2)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Company</label>
            <input value={jobCompany} onChange={e => setJobCompany(e.target.value)} style={{ width: "100%", padding: "10px 12px", fontSize: 13 }} placeholder="e.g. Google" />
          </div>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--t2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>Interview Type</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(INTERVIEW_CONFIGS).map(([k, v]) => (
              <div key={k} onClick={() => setInterviewType(k)} style={{ padding: "7px 16px", borderRadius: 8, border: `1.5px solid ${interviewType === k ? "var(--blue2)" : "var(--border2)"}`, background: interviewType === k ? "rgba(37,99,235,.08)" : "white", cursor: "pointer", fontSize: 13, fontWeight: interviewType === k ? 600 : 400, color: interviewType === k ? "var(--blue2)" : "var(--t2)", transition: "all .15s", userSelect: "none" }}>
                {v.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16, background: "var(--surface2)", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: "var(--t1)" }}>📋 {INTERVIEW_CONFIGS[interviewType].label} Plan — {plan.total} Questions</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {plan.rounds.map((r, i) => <span key={i} className={`pill ${["pill-blue", "pill-purple", "pill-amber", "pill-green"][i % 4]}`}>{r.type} ({r.q}Q)</span>)}
          </div>
        </div>
      </div>

      {/* Camera & Mic setup */}
      <div className="card" style={{ padding: 24, marginBottom: 16, animation: "fadeUp .4s ease .1s both" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📷 Camera & Microphone</h3>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 18, alignItems: "start" }}>
          <div>
            <div style={{ borderRadius: 10, overflow: "hidden", background: "#0a0e1a", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: camReady ? "block" : "none" }} />
              {!camReady && <div style={{ textAlign: "center" }}><div style={{ fontSize: 28, opacity: 0.3 }}>📷</div><div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", marginTop: 6 }}>No Preview</div></div>}
              {camReady && <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />}
            </div>
          </div>
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: camReady ? "var(--green-soft)" : "var(--surface3)", border: `1px solid ${camReady ? "rgba(16,185,129,.25)" : "var(--border)"}`, fontSize: 12, fontWeight: 600, color: camReady ? "var(--green)" : "var(--t3)" }}>
                  {camReady ? "✓ Camera Ready" : "○ Camera Off"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: micReady ? "var(--green-soft)" : "var(--surface3)", border: `1px solid ${micReady ? "rgba(16,185,129,.25)" : "var(--border)"}`, fontSize: 12, fontWeight: 600, color: micReady ? "var(--green)" : "var(--t3)" }}>
                  {micReady ? "✓ Mic Ready" : "○ Mic Off"}
                </div>
              </div>
              {(camError || micError) && <div style={{ fontSize: 11, color: "var(--red)", background: "var(--red-soft)", padding: "8px 12px", borderRadius: 7, border: "1px solid rgba(220,38,38,.2)" }}>⚠ {camError || micError}</div>}
              <p style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.65 }}>Camera is used for live confidence tracking and eye contact analysis. Mic enables speech-to-text so you can answer by speaking. All data stays in your browser.</p>
              <button className="btn btn-outline" style={{ alignSelf: "flex-start", fontSize: 12, padding: "8px 18px" }} onClick={requestPermissions}>
                {camReady && micReady ? "✓ Permissions Granted" : "🔐 Grant Camera & Mic Access"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Voice settings */}
      <div className="card" style={{ padding: 22, marginBottom: 16, animation: "fadeUp .4s ease .13s both" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>🔊 AI Voice</h3>
          <div
            onClick={() => setVoiceOn(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "6px 14px", borderRadius: 100, border: `1.5px solid ${voiceOn ? "var(--green2)" : "var(--border2)"}`, background: voiceOn ? "var(--green-soft)" : "var(--surface3)", userSelect: "none" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: voiceOn ? "var(--green2)" : "var(--t3)" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: voiceOn ? "var(--green)" : "var(--t3)" }}>{voiceOn ? "Voice On" : "Voice Off"}</span>
          </div>
        </div>
        {voiceOn && (
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--t2)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Select Voice</label>
            <select
              value={selectedVoice || ""}
              onChange={e => setSelectedVoice(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", fontSize: 13, borderRadius: 8 }}>
              {voices.filter(v => v.lang.startsWith("en")).map(v => (
                <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
              ))}
            </select>
            <button
              className="btn btn-ghost"
              style={{ marginTop: 10, fontSize: 12, padding: "7px 16px" }}
              onClick={() => speakText("Hello! I am your AI interviewer. I will be asking you questions today. Let us begin when you are ready.")}>
              🔊 Preview Voice
            </button>
          </div>
        )}
        {!voiceOn && (
          <p style={{ fontSize: 12, color: "var(--t3)", lineHeight: 1.6 }}>AI questions will appear as text only. Enable voice to hear questions spoken aloud.</p>
        )}
      </div>

      <button className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15, animation: "fadeUp .4s ease .18s both" }} onClick={startInterview}>
        🎯 Start AI Interview →
      </button>
    </div>
  );

  // ── GENERATING REPORT ──
  if (generatingReport) return (
    <div style={{ height: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
      <div style={{ width: 48, height: 48, border: "4px solid var(--border2)", borderTopColor: "var(--blue2)", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Generating Your Report...</div>
        <div style={{ fontSize: 13, color: "var(--t2)" }}>AI is analyzing your responses, communication style, and technical depth</div>
      </div>
      {["Transcribing all answers...", "Scoring technical depth...", "Analyzing communication patterns...", "Generating personalized feedback..."].map((s, i) => (
        <div key={i} style={{ fontSize: 12, color: "var(--green)", display: "flex", alignItems: "center", gap: 6, animation: `fadeIn .3s ease ${i * .5}s both`, opacity: 0 }}>
          <span>✓</span> {s}
        </div>
      ))}
    </div>
  );

  // ── REPORT PHASE ──
  if (phase === "report" && report) {
    const hireColor = { "Strong Yes": "var(--green)", "Yes": "var(--green2)", "Strong Maybe": "var(--blue2)", "Maybe": "var(--amber)", "No": "var(--red)" };
    const avgAnswerScore = answerScores.length > 0 ? (answerScores.reduce((a, b) => a + (b?.score || 0), 0) / answerScores.length).toFixed(1) : "—";

    return (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 48px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 36, animation: "fadeUp .5s ease" }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>📊</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 6 }}>Interview Performance Report</h1>
          <p style={{ color: "var(--t2)", fontSize: 13 }}>
            {jobRole} at {jobCompany} · {fmtTime(elapsed)} · {qNum} questions answered
          </p>
        </div>

        {/* Top row: overall + hire verdict */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, marginBottom: 24 }}>
          <div className="card" style={{ padding: 24, textAlign: "center" }}>
            <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 14px" }}>
              <svg viewBox="0 0 120 120" style={{ width: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--surface3)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--blue2)" strokeWidth="10" strokeDasharray={`${report.overall * 31.4} 314`} strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "var(--blue2)", letterSpacing: "-.03em" }}>{report.overall}</span>
                <span style={{ fontSize: 10, color: "var(--t3)" }}>/ 10</span>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--t2)", marginBottom: 8 }}>Overall Score</div>
            <div style={{ padding: "6px 14px", borderRadius: 100, background: "rgba(37,99,235,.08)", border: "1px solid rgba(37,99,235,.2)", fontSize: 12, fontWeight: 700, color: hireColor[report.hire_recommendation] || "var(--blue2)" }}>
              {report.hire_recommendation}
            </div>
          </div>

          <div className="card" style={{ padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: "var(--t2)" }}>AI SUMMARY</div>
            <p style={{ fontSize: 14, color: "var(--t1)", lineHeight: 1.75, marginBottom: 16 }}>{report.overall_summary}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="pill pill-blue">Avg Answer: {avgAnswerScore}/10</span>
              <span className="pill pill-neutral">{fmtTime(elapsed)} duration</span>
              <span className="pill pill-green">{qNum} questions</span>
            </div>
          </div>
        </div>

        {/* Score breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, marginBottom: 24 }}>
          {[
            ["🗣️", "Communication", report.comm],
            ["💻", "Technical", report.tech],
            ["🎯", "Behavioral", report.behavioral],
            ["💪", "Confidence", report.confidence],
            ["🧠", "Problem Solving", report.problemSolving],
            ["🤝", "Culture Fit", report.cultureFit],
          ].map(([ic, label, score], i) => (
            <div key={i} className="card" style={{ padding: "16px 12px", textAlign: "center", animation: `fadeUp .4s ease ${i * .06}s both` }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{ic}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: score >= 8 ? "var(--green)" : score >= 6.5 ? "var(--blue2)" : "var(--amber)", marginBottom: 3 }}>{score?.toFixed(1)}</div>
              <div style={{ fontSize: 10, color: "var(--t3)", lineHeight: 1.3 }}>{label}</div>
              <div style={{ marginTop: 7, background: "var(--surface3)", borderRadius: 2, height: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${score * 10}%`, background: score >= 8 ? "var(--green2)" : score >= 6.5 ? "var(--blue2)" : "var(--amber)", borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Answer breakdown */}
        {report.answer_breakdown?.length > 0 && (
          <div className="card" style={{ padding: 22, marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📋 Detailed Answer Analysis</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {report.answer_breakdown.map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr 60px", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: i < report.answer_breakdown.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{item.aspect}</span>
                  <div>
                    <div style={{ background: "var(--surface3)", borderRadius: 3, height: 6, marginBottom: 5, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${item.score * 10}%`, background: item.score >= 8 ? "var(--green2)" : item.score >= 6.5 ? "var(--blue2)" : "var(--amber)", borderRadius: 3, transition: "width 1s ease" }} />
                    </div>
                    <span style={{ fontSize: 11, color: "var(--t3)" }}>{item.comment}</span>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: item.score >= 8 ? "var(--green)" : item.score >= 6.5 ? "var(--blue2)" : "var(--amber)", textAlign: "right" }}>{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Per-answer scores from live scoring */}
        {answerScores.length > 0 && (
          <div className="card" style={{ padding: 22, marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>💬 Answer-by-Answer Scores</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {answerScores.map((s, i) => (
                <div key={i} style={{ padding: "12px 14px", background: "var(--surface2)", borderRadius: 10, border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <span className={`pill ${["pill-blue", "pill-purple", "pill-amber", "pill-green"][i % 4]}`} style={{ fontSize: 10, marginBottom: 5, display: "inline-flex" }}>{s.roundType}</span>
                      <div style={{ fontSize: 12, color: "var(--t2)", marginTop: 3, lineHeight: 1.5 }}>Q: {s.question?.slice(0, 100)}{s.question?.length > 100 ? "..." : ""}</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.score >= 8 ? "var(--green)" : s.score >= 6.5 ? "var(--blue2)" : "var(--amber)", marginLeft: 12, flexShrink: 0 }}>{s.score}/10</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, fontSize: 11 }}>
                    <span style={{ color: "var(--green)" }}>✓ {s.strength}</span>
                    <span style={{ color: "var(--t3)" }}>·</span>
                    <span style={{ color: "var(--amber)" }}>↑ {s.improvement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths / weaknesses / next steps */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 28 }}>
          {[
            ["✅ Strengths", report.strengths, "var(--green)", "✓"],
            ["⚠️ Improve", report.weaknesses, "var(--amber)", "!"],
            ["📈 Next Steps", report.next_steps, "var(--blue2)", "→"],
          ].map(([title, items, color, icon], i) => (
            <div key={i} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{title}</h3>
              {(items || []).map((item, j) => (
                <div key={j} style={{ display: "flex", gap: 7, marginBottom: 8 }}>
                  <span style={{ color, fontSize: 11, marginTop: 2, flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-primary" style={{ padding: "12px 28px" }} onClick={resetInterview}>🔄 Practice Again</button>
          <button className="btn btn-outline" style={{ padding: "12px 28px" }} onClick={() => { const d = document.createElement("a"); d.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2)); d.download = "interview-report.json"; d.click(); }}>📤 Export Report</button>
        </div>
      </div>
    );
  }

  // ── LIVE INTERVIEW ──
  return (
    <div style={{ height: "calc(100vh - 60px)", display: "grid", gridTemplateColumns: "300px 1fr 260px", overflow: "hidden" }}>
      {/* LEFT: Camera + live metrics */}
      <div style={{ borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", background: "white", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Live Feed</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", animation: "pulse 1.5s infinite" }} />
            <span className="mono" style={{ fontSize: 9, color: "var(--t3)", letterSpacing: ".08em" }}>REC</span>
          </div>
        </div>

        <div style={{ padding: 12, flexShrink: 0 }}>
          <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", background: "#0a0e1a", aspectRatio: "4/3" }}>
            <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: cameraOn && camReady ? "block" : "none" }} />
            {(!cameraOn || !camReady) && (
              <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, background: "#1a2035", position: "absolute", inset: 0 }}>
                <div style={{ fontSize: 26, opacity: .3 }}>📷</div>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,.3)" }}>Camera {!cameraOn ? "off" : "connecting..."}</span>
              </div>
            )}
            <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, display: "flex", gap: 6 }}>
              <button onClick={toggleCamera} style={{ flex: 1, padding: "4px 0", background: cameraOn ? "rgba(16,185,129,.7)" : "rgba(220,38,38,.7)", backdropFilter: "blur(6px)", border: "none", borderRadius: 5, color: "white", fontSize: 10, cursor: "pointer", fontWeight: 600 }}>
                {cameraOn ? "📷 On" : "📷 Off"}
              </button>
              <button onClick={toggleMic} style={{ flex: 1, padding: "4px 0", background: micOn && listening ? "rgba(37,99,235,.7)" : micOn ? "rgba(16,185,129,.7)" : "rgba(220,38,38,.7)", backdropFilter: "blur(6px)", border: "none", borderRadius: 5, color: "white", fontSize: 10, cursor: "pointer", fontWeight: 600 }}>
                {micOn && listening ? "🎙 Listening" : micOn ? "🎤 On" : "🎤 Off"}
              </button>
            </div>
          </div>
        </div>

        {/* Live metrics */}
        <div style={{ padding: "4px 14px 14px", display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--t3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 2 }}>Live Analysis</div>
          {[
            ["Confidence", liveMetrics.confidence, "var(--green2)"],
            ["Eye Contact", liveMetrics.eyeContact, "var(--blue2)"],
            ["Speaking Pace", liveMetrics.pace, "var(--purple)"],
            ["Clarity", liveMetrics.clarity, "var(--amber)"],
          ].map(([label, val, color]) => (
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "var(--t2)" }}>{label}</span>
                <span className="mono" style={{ fontSize: 10, color, fontWeight: 700 }}>{Math.round(val)}%</span>
              </div>
              <div style={{ background: "var(--surface3)", borderRadius: 2, height: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.round(val)}%`, background: color, borderRadius: 2, transition: "width 1.5s ease" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Timer */}
        <div style={{ margin: "8px 14px", padding: "10px 14px", background: "var(--surface2)", borderRadius: 8, flexShrink: 0 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--t3)", letterSpacing: ".08em", marginBottom: 3 }}>ELAPSED</div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.03em", color: "var(--ink)" }}>{fmtTime(elapsed)}</div>
        </div>

        <div style={{ padding: "8px 14px 14px", marginTop: "auto", flexShrink: 0 }}>
          <button className="btn btn-red" style={{ width: "100%", justifyContent: "center", fontSize: 12 }} onClick={endEarly}>
            ⬛ End & Get Report
          </button>
        </div>
      </div>

      {/* CENTER: Chat */}
      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--surface2)" }}>
        <div style={{ padding: "10px 18px", borderBottom: "1px solid var(--border)", background: "white", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className={`pill ${["pill-blue", "pill-purple", "pill-amber", "pill-green"][plan.rounds.findIndex(r => r.type === currentRound) % 4]}`} style={{ fontSize: 11 }}>{currentRound}</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--t3)" }}>Q{qNum + 1} of {plan.total}</span>
          </div>
          <div style={{ display: "flex", gap: 2.5, alignItems: "center" }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} style={{ width: 2.5, background: speaking ? "var(--blue2)" : listening ? "var(--green2)" : "var(--border2)", borderRadius: 2, transition: "all .3s", height: speaking ? undefined : listening ? undefined : 3, animation: (speaking || listening) ? `wave ${.3 + (i % 5) * .07}s ease-in-out ${i * .03}s infinite alternate` : "none" }} />
            ))}
            <span className="mono" style={{ fontSize: 9, color: speaking ? "var(--blue2)" : listening ? "var(--green)" : "var(--t3)", marginLeft: 6 }}>
              {speaking ? "AI Speaking" : listening ? "🎤 Listening" : "Idle"}
            </span>
            {speaking && (
              <button onClick={stopSpeaking} style={{ marginLeft: 8, padding: "2px 8px", fontSize: 10, background: "rgba(220,38,38,.1)", border: "1px solid rgba(220,38,38,.25)", borderRadius: 5, color: "var(--red)", cursor: "pointer", fontWeight: 600 }}>⏹ Skip</button>
            )}
          </div>
        </div>

        <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "18px 22px" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 16, justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp .3s ease" }}>
              {m.role === "ai" && (
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <span style={{ color: "white", fontSize: 12 }}>◈</span>
                </div>
              )}
              <div style={{ maxWidth: "74%" }}>
                <div className="mono" style={{ fontSize: 9, color: "var(--t3)", marginBottom: 3, letterSpacing: ".04em" }}>
                  {m.role === "ai" ? `AI · ${m.roundType || currentRound}` : "YOU"} · {m.ts}
                </div>
                <div style={{ padding: "11px 15px", borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "4px 12px 12px 12px", background: m.role === "user" ? "var(--blue2)" : "white", border: m.role === "ai" ? "1px solid var(--border)" : "none", color: m.role === "user" ? "white" : "var(--t1)", fontSize: 13, lineHeight: 1.7, boxShadow: "0 2px 8px rgba(10,14,26,.06)" }}>
                  {m.text}
                </div>
              </div>
              {m.role === "user" && (
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <span style={{ color: "white", fontSize: 10, fontWeight: 700 }}>YOU</span>
                </div>
              )}
            </div>
          ))}
          {aiLoading && (
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "white", fontSize: 12 }}>◈</span>
              </div>
              <div style={{ padding: "12px 16px", background: "white", border: "1px solid var(--border)", borderRadius: "4px 12px 12px 12px" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--blue2)", animation: `pulse .8s ease ${i * .2}s infinite` }} />)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: "10px 18px 14px", borderTop: "1px solid var(--border)", background: "white", flexShrink: 0 }}>
          {listening && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7, padding: "5px 10px", background: "rgba(16,185,129,.07)", borderRadius: 7, border: "1px solid rgba(16,185,129,.2)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green2)", animation: "pulse 1s infinite" }} />
              <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 500 }}>Transcribing your voice...</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ flex: 1, border: "1.5px solid var(--border2)", borderRadius: 10, padding: "9px 12px", background: "white" }}
              onFocusCapture={e => e.currentTarget.style.borderColor = "var(--blue3)"}
              onBlurCapture={e => e.currentTarget.style.borderColor = "var(--border2)"}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAnswer(); } }}
                placeholder={listening ? "Speaking... (or type here)" : "Type your answer or click 🎤 to speak (Enter to send)"}
                disabled={aiLoading}
                rows={2}
                style={{ width: "100%", fontSize: 13, lineHeight: 1.6, background: "transparent", border: "none", resize: "none" }}
              />
            </div>
            <button
              onClick={() => { if (micOn && listening) { stopMic(); } else { setMicOn(true); startMic(); } }}
              style={{ height: 60, width: 44, borderRadius: 10, border: "1.5px solid", borderColor: listening ? "var(--green2)" : "var(--border2)", background: listening ? "rgba(16,185,129,.08)" : "white", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {listening ? "🔴" : "🎤"}
            </button>
            <button className="btn btn-primary" onClick={sendAnswer} disabled={aiLoading || !input.trim()} style={{ height: 60, padding: "0 20px", flexShrink: 0 }}>
              {aiLoading ? <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> : "Send →"}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Plan + per-answer scores */}
      <div style={{ borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", background: "white", overflowY: "auto" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>Interview Plan</div>

        <div style={{ padding: "12px 14px" }}>
          {/* Progress */}
          <div className="mono" style={{ fontSize: 9, color: "var(--t3)", letterSpacing: ".08em", marginBottom: 7 }}>PROGRESS</div>
          <div style={{ background: "var(--surface3)", borderRadius: 3, height: 5, marginBottom: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(qNum / plan.total) * 100}%`, background: "var(--blue2)", borderRadius: 3, transition: "width .5s" }} />
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--t3)", marginBottom: 16 }}>{qNum} / {plan.total} answered</div>

          {plan.rounds.map((r, i) => {
            const offset = plan.rounds.slice(0, i).reduce((a, b) => a + b.q, 0);
            const done = Math.max(0, Math.min(r.q, qNum - offset));
            const active = currentRound === r.type;
            return (
              <div key={i} style={{ marginBottom: 12, padding: "8px 10px", borderRadius: 8, background: active ? "rgba(37,99,235,.05)" : "transparent", border: active ? "1px solid rgba(37,99,235,.15)" : "1px solid transparent" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? "var(--blue2)" : "var(--t2)" }}>{r.type}{active && " ←"}</span>
                  <span className="mono" style={{ fontSize: 10, color: "var(--t3)" }}>{done}/{r.q}</span>
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  {Array.from({ length: r.q }).map((_, j) => (
                    <div key={j} style={{ flex: 1, height: 4, borderRadius: 2, background: j < done ? "var(--green2)" : "var(--surface3)" }} />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Live scores */}
          {answerScores.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div className="mono" style={{ fontSize: 9, color: "var(--t3)", letterSpacing: ".08em", marginBottom: 8 }}>LIVE SCORES</div>
              {answerScores.slice(-5).map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 10, color: "var(--t2)" }}>Q{answerScores.length - (answerScores.slice(-5).length - 1 - i)}</span>
                  <div style={{ display: "flex", align: "center", gap: 4 }}>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: s.score >= 8 ? "var(--green)" : s.score >= 6.5 ? "var(--blue2)" : "var(--amber)" }}>{s.score}/10</span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, color: "var(--t3)" }}>Running avg</span>
                <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: "var(--blue2)" }}>
                  {(answerScores.reduce((a, b) => a + (b?.score || 0), 0) / answerScores.length).toFixed(1)}/10
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div style={{ marginTop: 16 }}>
            <div className="mono" style={{ fontSize: 9, color: "var(--t3)", letterSpacing: ".08em", marginBottom: 6 }}>QUICK NOTES</div>
            <textarea placeholder="Jot key points here..." rows={4} style={{ width: "100%", padding: "8px 10px", fontSize: 11, lineHeight: 1.6 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── DASHBOARD PAGE ─────────────────────────────────────────────────────── */
function DashboardPage({ setPage, applied, user }) {
  const isNew = applied.length === 0;

  // Build apps list from jobs the user has actually applied to
  const apps = JOBS
    .filter(j => applied.includes(j.id))
    .map(j => ({
      company: j.company, role: j.title, status: "applied",
      score: null, daysAgo: 0, logo: j.logo, color: j.color
    }));

  const weakAreas = isNew
    ? []
    : [{ label:"System Design", pct:54 },{ label:"Salary Negotiation", pct:62 },{ label:"Behavioral STAR", pct:71 }];

  const trendData = isNew ? [] : [5.2, 6.1, 6.8, 7.1, 7.4, 7.8, 7.6, 8.1];

  const statusMeta = { applied:["pill-blue","⏳ Applied"], interview:["pill-amber","📅 Scheduled"], rejected:["pill-red","❌ Rejected"] };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 48px 60px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28, animation:"fadeUp .4s ease" }}>
        <div>
          <h1 style={{ fontSize:28, fontWeight:800, letterSpacing:"-.03em", marginBottom:4 }}>
            {isNew ? `Welcome, ${firstName}! 👋` : "Dashboard"}
          </h1>
          <p style={{ fontSize:14, color:"var(--t2)" }}>
            {isNew ? "Your career journey starts here — apply to jobs, run mock interviews, and track your progress." : "Your career progress at a glance"}
          </p>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <button className="btn btn-outline" onClick={() => setPage("jobs")} style={{ fontSize:13 }}>+ Browse Jobs</button>
          <button className="btn btn-primary" onClick={() => setPage("interview")} style={{ fontSize:13 }}>🎯 Start Mock</button>
        </div>
      </div>

      {/* Top stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {[
          ["📋","Jobs Applied", applied.length, "total","var(--blue2)"],
          ["🎯","Mock Interviews", isNew ? 0 : 8, "sessions","var(--purple)"],
          ["⭐","Avg Mock Score", isNew ? "—" : "7.4", isNew ? "no sessions yet" : "/10","var(--green)"],
          ["🔥","Interview Streak", isNew ? 0 : 5, "days","var(--amber)"]
        ].map(([ic,label,val,sub,color],i) => (
          <div key={i} className="card" style={{ padding:22, animation:`fadeUp .4s ease ${i*.08}s both` }}>
            <div style={{ fontSize:22, marginBottom:10 }}>{ic}</div>
            <div style={{ fontSize:28, fontWeight:800, letterSpacing:"-.03em", color, marginBottom:3 }}>{val}</div>
            <div style={{ fontSize:11, color:"var(--t3)", display:"flex", gap:4 }}>
              <span>{label}</span>
              <span style={{ color:"var(--border2)" }}>·</span>
              <span>{sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:20 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {/* Applications feed */}
          <div className="card-flat" style={{ padding:22 }}>
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:18, display:"flex", justifyContent:"space-between" }}>
              Applications Feed
              <button className="btn btn-ghost" style={{ fontSize:12, padding:"5px 12px" }} onClick={() => setPage("jobs")}>Browse Jobs →</button>
            </h3>
            {apps.length === 0 ? (
              <div style={{ textAlign:"center", padding:"32px 0", color:"var(--t3)" }}>
                <div style={{ fontSize:36, marginBottom:12 }}>📭</div>
                <div style={{ fontSize:14, fontWeight:600, marginBottom:6 }}>No applications yet</div>
                <div style={{ fontSize:13, marginBottom:20 }}>Start applying to jobs to track them here.</div>
                <button className="btn btn-primary" style={{ fontSize:13 }} onClick={() => setPage("jobs")}>🔍 Browse Jobs</button>
              </div>
            ) : (
              apps.map((app, i) => (
                <div key={i} style={{ display:"flex", gap:14, alignItems:"center", padding:"14px 0", borderBottom: i < apps.length-1 ? "1px solid var(--border)" : "none", animation:`fadeUp .4s ease ${i*.08}s both` }}>
                  <div style={{ width:40, height:40, borderRadius:9, background:app.color+"22", border:`1.5px solid ${app.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{app.logo}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div>
                        <span style={{ fontSize:14, fontWeight:600 }}>{app.company}</span>
                        <span style={{ fontSize:13, color:"var(--t2)", marginLeft:8 }}>{app.role}</span>
                      </div>
                      <span className="mono" style={{ fontSize:11, color:"var(--t3)" }}>just now</span>
                    </div>
                    <div style={{ display:"flex", gap:8, marginTop:6, alignItems:"center" }}>
                      <span className={`pill ${statusMeta[app.status][0]}`} style={{ fontSize:11 }}>{statusMeta[app.status][1]}</span>
                      <span style={{ fontSize:11, color:"var(--t3)" }}>No mock score yet</span>
                    </div>
                  </div>
                  <button className="btn btn-ghost" style={{ padding:"5px 12px", fontSize:11 }} onClick={() => setPage("interview")}>Practice</button>
                </div>
              ))
            )}
          </div>

          {/* Score trend chart */}
          <div className="card-flat" style={{ padding:22 }}>
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:18 }}>📈 Mock Score Trend</h3>
            {trendData.length === 0 ? (
              <div style={{ textAlign:"center", padding:"24px 0", color:"var(--t3)" }}>
                <div style={{ fontSize:30, marginBottom:10 }}>📊</div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>No sessions yet</div>
                <div style={{ fontSize:12, marginBottom:16 }}>Complete a mock interview to see your score trend.</div>
                <button className="btn btn-outline" style={{ fontSize:12 }} onClick={() => setPage("interview")}>🎯 Start First Mock</button>
              </div>
            ) : (
              <>
                <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:80, marginBottom:10 }}>
                  {trendData.map((v, i) => (
                    <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                      <span className="mono" style={{ fontSize:9, color:"var(--t3)" }}>{v}</span>
                      <div style={{ width:"100%", height:v*8, background: i===trendData.length-1 ? "var(--blue2)" : "var(--surface3)", borderRadius:"4px 4px 0 0", transition:"height .5s", border: i===trendData.length-1 ? "none" : "1px solid var(--border)" }} />
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  {["S1","S2","S3","S4","S5","S6","S7","Latest"].map(l => (
                    <span key={l} className="mono" style={{ fontSize:9, color:"var(--t3)", flex:1, textAlign:"center" }}>{l}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {/* Weak areas */}
          <div className="card-flat" style={{ padding:22 }}>
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>⚠️ Weak Areas</h3>
            {weakAreas.length === 0 ? (
              <div style={{ textAlign:"center", padding:"16px 0", color:"var(--t3)" }}>
                <div style={{ fontSize:28, marginBottom:8 }}>🎯</div>
                <div style={{ fontSize:12, marginBottom:14 }}>Complete mock interviews to discover your weak areas.</div>
                <button className="btn btn-primary" style={{ width:"100%", fontSize:13 }} onClick={() => setPage("interview")}>🎯 Start First Mock</button>
              </div>
            ) : (
              <>
                {weakAreas.map((a,i) => (
                  <div key={i} style={{ marginBottom:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:13, fontWeight:600 }}>{a.label}</span>
                      <span className="mono" style={{ fontSize:12, color: a.pct>=70 ? "var(--green)" : a.pct>=60 ? "var(--amber)" : "var(--red)", fontWeight:600 }}>{a.pct}%</span>
                    </div>
                    <div style={{ background:"var(--surface3)", borderRadius:4, height:7, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${a.pct}%`, background: a.pct>=70 ? "var(--green2)" : a.pct>=60 ? "var(--amber)" : "var(--red)", borderRadius:4, transition:"width 1s" }} />
                    </div>
                  </div>
                ))}
                <button className="btn btn-primary" style={{ width:"100%", fontSize:13 }} onClick={() => setPage("interview")}>🎯 Practice Weak Areas</button>
              </>
            )}
          </div>

          {/* AI Recommendations */}
          <div className="card-flat" style={{ padding:22 }}>
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>🤖 AI Recommendations</h3>
            {(isNew
              ? [`Apply to your first job, ${firstName}!`, "Set up your resume for AI analysis", "Try a mock interview to get a baseline score", "Explore job listings matching your target role"]
              : ["Practice 2 System Design problems this week","Review STAR behavioral framework","Mock a salary negotiation session","Apply to 3 more entry-level roles"]
            ).map((r,i) => (
              <div key={i} style={{ display:"flex", gap:8, padding:"9px 0", borderBottom: i<3 ? "1px solid var(--border)" : "none" }}>
                <span style={{ color:"var(--blue2)", fontSize:12, marginTop:2, flexShrink:0 }}>→</span>
                <span style={{ fontSize:12, color:"var(--t2)", lineHeight:1.55 }}>{r}</span>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="card-flat" style={{ padding:22 }}>
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>⚡ Quick Actions</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <button className="btn btn-primary" style={{ width:"100%", justifyContent:"flex-start", padding:"10px 16px" }} onClick={() => setPage("interview")}>🎯 Start Mock Interview</button>
              <button className="btn btn-outline" style={{ width:"100%", justifyContent:"flex-start", padding:"10px 16px" }} onClick={() => setPage("resume")}>📄 Analyze Resume</button>
              <button className="btn btn-ghost" style={{ width:"100%", justifyContent:"flex-start", padding:"10px 16px" }} onClick={() => setPage("jobs")}>🔍 Browse New Jobs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("landing");
  const [applied, setApplied] = useState([]);
  const [user, setUser] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const handleLogin = (userData) => { setUser(userData); setApplied([]); };
  const handleLogout = () => { setUser(null); setApplied([]); setPage("landing"); };

  // Guard protected pages
  const safePage = (p) => {
    const protected_ = ["jobs","resume","interview","dashboard"];
    if (protected_.includes(p) && !user) { setPage("login"); return; }
    setPage(p);
  };

  return (
    <div style={{ minHeight:"100vh" }}>
      <Navbar page={page} setPage={safePage} user={user} onLogout={handleLogout} />
      {page === "landing"   && <LandingPage setPage={safePage} />}
      {page === "login"     && <LoginPage setPage={setPage} onLogin={handleLogin} />}
      {page === "signup"    && <SignupPage setPage={setPage} onLogin={handleLogin} />}
      {page === "jobs"      && <JobsPage setPage={safePage} applied={applied} setApplied={setApplied} />}
      {page === "resume"    && <ResumePage setPage={safePage} onResumeAnalyzed={setResumeData} />}
      {page === "interview" && <InterviewPage resumeData={resumeData} />}
      {page === "dashboard" && <DashboardPage setPage={safePage} applied={applied} user={user} />}
    </div>
  );
}