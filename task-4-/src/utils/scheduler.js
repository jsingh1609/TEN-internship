// Pure logic scheduler - no API needed

export function generateSchedule(subjects, startDate = new Date()) {
  if (!subjects.length) return [];

  const today = new Date(startDate);
  today.setHours(0, 0, 0, 0);

  // Calculate days until exam for each subject
  const subjectsWithDays = subjects.map((s) => {
    const examDate = new Date(s.examDate);
    examDate.setHours(0, 0, 0, 0);
    const daysUntil = Math.max(1, Math.ceil((examDate - today) / (1000 * 60 * 60 * 24)));
    return { ...s, daysUntil };
  });

  // Priority score: difficulty * (1 / daysUntil) * priorityWeight
  const priorityMap = { High: 3, Medium: 2, Low: 1 };
  const difficultyMap = { Hard: 3, Medium: 2, Easy: 1 };

  const scored = subjectsWithDays.map((s) => ({
    ...s,
    score:
      (difficultyMap[s.difficulty] || 2) *
      (priorityMap[s.priority] || 2) *
      (1 / s.daysUntil),
  }));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Build daily schedule for next 14 days (or until all exams done)
  const maxDays = 14;
  const hoursPerDay = 6; // study hours per day
  const schedule = [];

  for (let d = 0; d < maxDays; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);

    // Filter subjects whose exam hasn't passed
    const available = scored.filter((s) => {
      const exam = new Date(s.examDate);
      exam.setHours(0, 0, 0, 0);
      return exam > date;
    });

    if (!available.length) break;

    // Distribute hours proportionally by score
    const totalScore = available.reduce((sum, s) => sum + s.score, 0);
    const sessions = available.map((s) => ({
      subject: s.name,
      color: s.color,
      hours: Math.max(0.5, parseFloat(((s.score / totalScore) * hoursPerDay).toFixed(1))),
      priority: s.priority,
      difficulty: s.difficulty,
    }));

    // Check if any exam is tomorrow
    const examTomorrow = scored.find((s) => {
      const exam = new Date(s.examDate);
      exam.setHours(0, 0, 0, 0);
      const tomorrow = new Date(date);
      tomorrow.setDate(date.getDate() + 1);
      return exam.getTime() === tomorrow.getTime();
    });

    schedule.push({
      date: date.toISOString().split("T")[0],
      dayLabel: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      sessions,
      examAlert: examTomorrow ? `${examTomorrow.name} exam tomorrow!` : null,
    });
  }

  return schedule;
}

export function getPriorityColor(priority) {
  return { High: "#ff6b6b", Medium: "#ffd93d", Low: "#6bcb77" }[priority] || "#aaa";
}

export const COLORS = [
  "#60a5fa", "#f472b6", "#34d399", "#fbbf24",
  "#a78bfa", "#fb923c", "#22d3ee", "#e879f9",
];
