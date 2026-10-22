
import { useState } from "react";
import {
  LayoutDashboard,
  CheckCircle2,
  Flame,
  Target,
  TrendingUp,
  Plus,
  Search,
  Bell,
  ChevronRight,
  CalendarDays,
  Sparkles,
  CircleCheck,
  Clock3,
  MoreHorizontal,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./index.css";

const initialHabits = [
  { id: 1, name: "Read 20 minutes", category: "Personal Growth", icon: "📚", color: "#a78bfa", completed: true, streak: 5, week: [1, 1, 0, 1, 1, 0, 1] },
  { id: 2, name: "Exercise", category: "Health & Fitness", icon: "🏃", color: "#5eead4", completed: false, streak: 3, week: [1, 0, 1, 1, 0, 0, 0] },
  { id: 3, name: "Drink 2L water", category: "Health & Fitness", icon: "💧", color: "#93c5fd", completed: false, streak: 7, week: [1, 1, 1, 1, 1, 0, 0] },
  { id: 4, name: "Practice coding", category: "Career", icon: "💻", color: "#f9a8d4", completed: true, streak: 4, week: [1, 1, 0, 1, 1, 1, 1] },
];

const weeklyData = [
  { day: "Fri", completed: 2 },
  { day: "Sat", completed: 3 },
  { day: "Sun", completed: 2 },
  { day: "Mon", completed: 4 },
  { day: "Tue", completed: 3 },
  { day: "Wed", completed: 4 },
  { day: "Thu", completed: 2 },
];

function StatCard({ icon: Icon, label, value, note, color }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span className="stat-icon" style={{ color, background: `${color}18` }}>
          <Icon size={19} />
        </span>
        <span className="stat-note">{note}</span>
      </div>
      <p className="stat-label">{label}</p>
      <h2>{value}</h2>
    </article>
  );
}

function App() {
  const [habits, setHabits] = useState(initialHabits);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState("");

  const completed = habits.filter((habit) => habit.completed).length;
  const progress = habits.length ? Math.round((completed / habits.length) * 100) : 0;
  const filteredHabits = habits.filter((habit) =>
    habit.name.toLowerCase().includes(search.toLowerCase())
  );

  function toggleHabit(id) {
    setHabits((current) =>
      current.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  }

  function addHabit(event) {
    event.preventDefault();
    const name = newHabit.trim();
    if (!name || habits.some((habit) => habit.name.toLowerCase() === name.toLowerCase())) return;

    setHabits((current) => [
      ...current,
      {
        id: Date.now(),
        name,
        category: "Personal Growth",
        icon: "✨",
        color: "#c4b5fd",
        completed: false,
        streak: 0,
        week: [0, 0, 0, 0, 0, 0, 0],
      },
    ]);
    setNewHabit("");
    setShowAdd(false);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home">
          <span className="brand-mark"><CheckCircle2 size={23} /></span>
          <span>py<span className="brand-accent">habit</span><small>YOUR DAILY COMPANION</small></span>
        </a>

        <p className="nav-caption">WORKSPACE</p>
        <nav className="nav-list">
          <a className="nav-item active" href="#dashboard"><LayoutDashboard size={18} /> Dashboard</a>
          <a className="nav-item" href="#habits"><CircleCheck size={18} /> My Habits <span className="nav-count">{habits.length}</span></a>
          <a className="nav-item" href="#analytics"><TrendingUp size={18} /> Analytics</a>
        </nav>

        <p className="nav-caption nav-caption-spaced">YOUR PROGRESS</p>
        <div className="sidebar-streak">
          <div className="streak-flame"><Flame size={21} /></div>
          <div><strong>Keep it going!</strong><p>You're building a routine.</p></div>
        </div>

        <div className="sidebar-bottom">
          <div className="avatar">K</div>
          <div className="profile-copy"><strong>Kavindu</strong><span>Habit builder</span></div>
          <MoreHorizontal size={19} className="muted-icon" />
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div className="breadcrumb">Workspace <ChevronRight size={14} /> <strong>Dashboard</strong></div>
          <div className="topbar-actions">
            <span className="date-chip"><CalendarDays size={15} /> Today, Oct 22</span>
            <button className="icon-button" aria-label="Notifications"><Bell size={18} /></button>
            <div className="avatar small-avatar">K</div>
          </div>
        </header>

        <section className="welcome-row">
          <div>
            <p className="eyebrow"><Sparkles size={14} /> YOUR PERSONAL HABIT SPACE</p>
            <h1>Make today <span>count.</span></h1>
            <p className="welcome-subtitle">Small steps every day lead to remarkable results.</p>
          </div>
          <div className="date-display"><span>THURSDAY</span><strong>22</strong><span>OCTOBER 2026</span></div>
        </section>

        <section className="stats-grid" aria-label="Habit statistics">
          <StatCard icon={Target} label="Today's progress" value={`${progress}%`} note={`${completed} of ${habits.length}`} color="#a78bfa" />
          <StatCard icon={CheckCircle2} label="Completed today" value={`${completed}/${habits.length}`} note="Habits done" color="#5eead4" />
          <StatCard icon={Flame} label="Best streak" value={`${Math.max(0, ...habits.map((habit) => habit.streak))} days`} note="Personal best" color="#fb923c" />
          <StatCard icon={TrendingUp} label="This week's focus" value="72%" note="Weekly average" color="#93c5fd" />
        </section>

        <section className="content-grid">
          <article className="panel habits-panel" id="habits">
            <div className="panel-heading">
              <div><h2>Today's habits</h2><p>Consistency is built one day at a time.</p></div>
              <button className="primary-button" onClick={() => setShowAdd(!showAdd)}><Plus size={17} /> Add habit</button>
            </div>

            {showAdd && (
              <form className="add-habit-form" onSubmit={addHabit}>
                <input autoFocus value={newHabit} onChange={(event) => setNewHabit(event.target.value)} placeholder="e.g. Learn something new" aria-label="New habit name" />
                <button className="primary-button" type="submit">Create</button>
              </form>
            )}

            <label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a habit..." /></label>

            <div className="habit-list">
              {filteredHabits.map((habit) => (
                <div className={`habit-row ${habit.completed ? "is-complete" : ""}`} key={habit.id}>
                  <button className={`check-button ${habit.completed ? "checked" : ""}`} onClick={() => toggleHabit(habit.id)} aria-label={`Mark ${habit.name} ${habit.completed ? "incomplete" : "complete"}`}>
                    {habit.completed && <CheckCircle2 size={20} />}
                  </button>
                  <span className="habit-emoji" style={{ background: `${habit.color}16` }}>{habit.icon}</span>
                  <div className="habit-details"><strong>{habit.name}</strong><span>{habit.category}</span></div>
                  <div className="habit-streak"><Flame size={15} /><span>{habit.streak}</span></div>
                  <button className="more-button" aria-label={`More options for ${habit.name}`}><MoreHorizontal size={19} /></button>
                </div>
              ))}
              {filteredHabits.length === 0 && <p className="empty-state">No habits found. Try another search.</p>}
            </div>

            <div className="habits-footer"><span>{completed} of {habits.length} habits completed</span><span>{progress}%</span></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          </article>

          <article className="panel weekly-panel" id="analytics">
            <div className="panel-heading"><div><h2>Weekly activity</h2><p>Your consistency at a glance.</p></div><button className="subtle-button">This week <ChevronRight size={14} /></button></div>
            <div className="chart-summary"><strong>18 <span>completions</span></strong><span className="trend-pill"><TrendingUp size={14} /> +12.5%</span></div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 4, left: -22, bottom: 0 }}>
                  <defs><linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a78bfa" stopOpacity={0.32} /><stop offset="95%" stopColor="#a78bfa" stopOpacity={0.01} /></linearGradient></defs>
                  <CartesianGrid stroke="#283044" strokeDasharray="4 5" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8993aa", fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8993aa", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#171d2b", border: "1px solid #343b50", borderRadius: 10, color: "#f2f4ff" }} />
                  <Area type="monotone" dataKey="completed" stroke="#a78bfa" strokeWidth={2.5} fill="url(#activityGradient)" activeDot={{ r: 5, fill: "#c4b5fd" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-footer"><span><span className="legend-dot" /> Daily completions</span><span>Last 7 days</span></div>
          </article>
        </section>

        <section className="bottom-grid">
          <article className="panel weekly-checklist">
            <div className="panel-heading"><div><h2>Weekly consistency</h2><p>Days you showed up for yourself.</p></div><span className="goal-chip"><Target size={14} /> 7-day view</span></div>
            <div className="week-days">
              {["F", "S", "S", "M", "T", "W", "T"].map((day, index) => {
                const total = habits.reduce((sum, habit) => sum + (habit.week[index] || 0), 0);
                return <div className="week-day" key={`${day}-${index}`}><span>{day}</span><div className={`day-circle ${total > 0 ? "day-active" : ""}`}>{total > 0 ? <CheckCircle2 size={16} /> : <span>·</span>}</div></div>;
              })}
            </div>
          </article>
          <article className="quote-card"><div className="quote-icon"><Sparkles size={19} /></div><p className="quote-label">A LITTLE REMINDER</p><blockquote>“We are what we repeatedly do. Excellence, then, is not an act, but a habit.”</blockquote><span>— Often attributed to Aristotle</span></article>
        </section>

        <footer className="app-footer"><span>Made with care, one habit at a time.</span><span>PyHabit <span className="footer-dot">●</span> Personal growth, in progress.</span></footer>
      </main>
    </div>
  );
}

export default App;
