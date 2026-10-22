# PyHabit Tracker

A lightweight Python CLI habit tracker with streaks, daily progress reports, and JSON storage.

## Features

- **Habit Management:** Create and manage daily habits.
- **Daily Progress Tracking:** Mark habits as complete and view daily completion statistics.
- **Habit Streaks:** Track consecutive days of completing habits.
- **Weekly Analytics:** Review each habit's completion rate over the last seven days.
- **Local JSON Storage:** Store habit data locally without requiring a database.
- **Automated Tests:** Validate habit management, persistence, streaks, and analytics using Python's `unittest` framework.

## Getting Started

### Requirements
- Python 3.10 or later

### Run the Application

```bash
python main.py
```

### Run Tests

```bash
python -m unittest -v
```

## Project Structure

```text
pyhabit-tracker/
├── main.py
├── storage.py
├── test_storage.py
├── requirements.txt
└── README.md
```