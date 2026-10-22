
"""Tests for PyHabit storage and tracking logic."""

import tempfile
import unittest
from datetime import date, timedelta
from pathlib import Path

from storage import (
    add_habit,
    complete_habit,
    current_streak,
    daily_summary,
    load_habits,
    save_habits,
    weekly_summary,
)


class TestPyHabit(unittest.TestCase):

    def test_add_habit(self):
        habits = add_habit("Read", [])
        self.assertEqual(habits[0]["name"], "Read")

    def test_reject_duplicate_habit(self):
        habits = add_habit("Read", [])
        with self.assertRaises(ValueError):
            add_habit("read", habits)

    def test_reject_empty_name(self):
        with self.assertRaises(ValueError):
            add_habit("   ", [])

    def test_save_and_load(self):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "habits.json"
            original = add_habit("Exercise", [])
            save_habits(original, path)
            self.assertEqual(load_habits(path), original)

    def test_complete_habit_only_once_per_day(self):
        today = date(2026, 10, 22)
        habits = add_habit("Read", [])
        complete_habit("Read", habits, today)
        complete_habit("Read", habits, today)

        self.assertEqual(
            habits[0]["completed_dates"],
            [today.isoformat()],
        )

    def test_streak(self):
        today = date(2026, 10, 22)
        habit = {
            "name": "Read",
            "completed_dates": [
                (today - timedelta(days=2)).isoformat(),
                (today - timedelta(days=1)).isoformat(),
                today.isoformat(),
            ],
        }
        self.assertEqual(current_streak(habit, today), 3)

    def test_daily_summary(self):
        today = date(2026, 10, 22)
        habits = add_habit("Read", [])
        habits = add_habit("Exercise", habits)
        complete_habit("Read", habits, today)

        result = daily_summary(habits, today)

        self.assertEqual(result["total"], 2)
        self.assertEqual(result["completed"], 1)
        self.assertEqual(result["remaining"], 1)
        self.assertEqual(result["percentage"], 50)

    
    def test_weekly_summary(self):
        today = date(2026, 10, 22)
        habits = add_habit("Read", [])
        habits = add_habit("Exercise", habits)

        for offset in range(5):
            completed_day = today - timedelta(days=offset)
            complete_habit("Read", habits, completed_day)

        result = weekly_summary(habits, today)

        self.assertEqual(result["total_completed"], 5)
        self.assertEqual(result["total_possible"], 14)
        self.assertEqual(result["habits"][0]["completed_days"], 5)
        self.assertEqual(result["habits"][0]["completion_rate"], 71)
        self.assertEqual(result["completion_rate"], 36)


if __name__ == "__main__":
    unittest.main()
