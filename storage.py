
"""JSON storage and habit-tracking logic for PyHabit."""

import json
from datetime import date, timedelta
from pathlib import Path

DATA_FILE = Path(__file__).parent / "habits.json"


def load_habits(path=DATA_FILE):
    """Load habits from JSON, returning an empty list if no file exists."""
    path = Path(path)

    if not path.exists():
        return []

    with path.open("r", encoding="utf-8") as file:
        habits = json.load(file)

    if not isinstance(habits, list):
        raise ValueError("Habit data must be a JSON list.")

    return habits


def save_habits(habits, path=DATA_FILE):
    """Save habits to a JSON file."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)

    with path.open("w", encoding="utf-8") as file:
        json.dump(habits, file, indent=4)


def add_habit(name, habits=None):
    """Add a habit unless a habit with the same name already exists."""
    name = name.strip()

    if not name:
        raise ValueError("Habit name cannot be empty.")

    if habits is None:
        habits = load_habits()

    if any(h["name"].casefold() == name.casefold() for h in habits):
        raise ValueError("This habit already exists.")

    habit = {
        "name": name,
        "created_at": date.today().isoformat(),
        "completed_dates": [],
    }

    habits.append(habit)
    return habits


def complete_habit(name, habits=None, today=None):
    """Mark a habit complete for a given date."""
    if habits is None:
        habits = load_habits()

    today = today or date.today()
    target = next(
        (h for h in habits if h["name"].casefold() == name.strip().casefold()),
        None,
    )

    if target is None:
        raise ValueError(f"Habit not found: {name}")

    completed = target["completed_dates"]
    day = today.isoformat()

    if day not in completed:
        completed.append(day)
        completed.sort()

    return habits


def current_streak(habit, today=None):
    """Count consecutive completed days, including today or yesterday."""
    today = today or date.today()
    completed = set(habit["completed_dates"])

    if today.isoformat() in completed:
        cursor = today
    elif (today - timedelta(days=1)).isoformat() in completed:
        cursor = today - timedelta(days=1)
    else:
        return 0

    streak = 0

    while cursor.isoformat() in completed:
        streak += 1
        cursor -= timedelta(days=1)

    return streak


def daily_summary(habits, today=None):
    """Return today's completion counts."""
    today = today or date.today()
    completed = sum(
        today.isoformat() in habit["completed_dates"]
        for habit in habits
    )

    total = len(habits)

    return {
        "total": total,
        "completed": completed,
        "remaining": total - completed,
        "percentage": round(completed / total * 100) if total else 0,
    }


def weekly_summary(habits, today=None):
    """Summarize habit completion over the last seven days, including today."""
    today = today or date.today()
    week_start = today - timedelta(days=6)

    results = []

    for habit in habits:
        completed_dates = set(habit["completed_dates"])

        completed_days = sum(
            (week_start + timedelta(days=offset)).isoformat()
            in completed_dates
            for offset in range(7)
        )

        results.append(
            {
                "name": habit["name"],
                "completed_days": completed_days,
                "completion_rate": round(completed_days / 7 * 100),
            }
        )

    total_possible = len(habits) * 7
    total_completed = sum(item["completed_days"] for item in results)

    return {
        "week_start": week_start.isoformat(),
        "week_end": today.isoformat(),
        "habits": results,
        "total_completed": total_completed,
        "total_possible": total_possible,
        "completion_rate": (
            round(total_completed / total_possible * 100)
            if total_possible
            else 0
        ),
    }
