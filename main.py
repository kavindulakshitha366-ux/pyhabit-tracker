
"""PyHabit: a lightweight command-line habit tracker."""

from storage import (
    add_habit,
    complete_habit,
    current_streak,
    daily_summary,
    load_habits,
    save_habits,
    weekly_summary,
)


def show_menu():
    """Display the main application menu."""
    print("\n" + "=" * 38)
    print("          PyHabit Tracker")
    print("=" * 38)
    print("1. Add a new habit")
    print("2. View all habits")
    print("3. Mark a habit as complete")
    print("4. View today's progress")
    print("5. View habit streaks")
    print("6. View weekly analytics")
    print("0. Exit")
    print("-" * 38)


def add_new_habit():
    """Ask for a habit name and save it."""
    name = input("Enter a habit name: ")

    try:
        habits = add_habit(name)
        save_habits(habits)
        print(f"Success! '{name.strip()}' has been added.")
    except ValueError as error:
        print(f"Error: {error}")


def view_habits():
    """Display all saved habits."""
    habits = load_habits()

    if not habits:
        print("\nNo habits yet. Add your first habit!")
        return

    print("\nYour habits:")
    for number, habit in enumerate(habits, start=1):
        print(f"{number}. {habit['name']}")


def mark_habit_complete():
    """Mark a selected habit as completed today."""
    habits = load_habits()

    if not habits:
        print("\nNo habits available. Add a habit first.")
        return

    view_habits()
    name = input("\nEnter the habit name to complete: ")

    try:
        complete_habit(name, habits)
        save_habits(habits)
        print(f"Great work! '{name.strip()}' is completed for today.")
    except ValueError as error:
        print(f"Error: {error}")


def show_daily_progress():
    """Display today's completion statistics."""
    habits = load_habits()
    summary = daily_summary(habits)

    print("\nToday's Progress")
    print("-" * 25)
    print(f"Total habits:     {summary['total']}")
    print(f"Completed:       {summary['completed']}")
    print(f"Remaining:       {summary['remaining']}")
    print(f"Completion rate: {summary['percentage']}%")

    bar_length = 20
    filled = round(summary["percentage"] / 100 * bar_length)
    bar = "#" * filled + "-" * (bar_length - filled)
    print(f"[{bar}]")


def show_streaks():
    """Display each habit's current streak."""
    habits = load_habits()

    if not habits:
        print("\nNo habits available yet.")
        return

    print("\nHabit Streaks")
    print("-" * 25)

    for habit in habits:
        streak = current_streak(habit)
        print(f"{habit['name']}: {streak} day(s)")


def show_weekly_analytics():
    """Display habit completion statistics for the last seven days."""
    habits = load_habits()
    report = weekly_summary(habits)

    print("\nWeekly Habit Analytics")
    print("-" * 38)
    print(f"Period: {report['week_start']} to {report['week_end']}")

    if not habits:
        print("No habits yet. Add your first habit!")
        return

    print("\nHabit completion:")
    for habit in report["habits"]:
        print(
            f"- {habit['name']}: "
            f"{habit['completed_days']}/7 days "
            f"({habit['completion_rate']}%)"
        )

    print("\nOverall weekly progress")
    print(f"Completed habit-days: {report['total_completed']}")
    print(f"Possible habit-days:  {report['total_possible']}")
    print(f"Completion rate:      {report['completion_rate']}%")



def main():
    """Run the interactive application."""
    print("Welcome to PyHabit!")

    actions = {
        "1": add_new_habit,
        "2": view_habits,
        "3": mark_habit_complete,
        "4": show_daily_progress,
        "5": show_streaks,
        "6": show_weekly_analytics,
    }

    while True:
        show_menu()
        choice = input("Choose an option: ").strip()

        if choice == "0":
            print("Keep building good habits. See you next time!")
            break

        action = actions.get(choice)

        if action:
            action()
        else:
            print("Invalid option. Please choose 0-6.")


if __name__ == "__main__":
    main()
