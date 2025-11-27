export interface Session {
  id?: number;
  date: string;
  duration: number; // in seconds
  patternId: string;
}

const API_BASE = "/_api/stats";

export async function saveSession(session: Omit<Session, "id" | "date">) {
  const payload = {
    ...session,
    date: new Date().toISOString(),
  };
  
  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to save session");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving session:", error);
    // Fallback or retry logic could go here
  }
}

export async function getSessions(): Promise<Session[]> {
  try {
    const response = await fetch(API_BASE, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch sessions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
}

export function calculateStats(sessions: Session[]) {
  const totalSessions = sessions.length;
  const totalMinutes = Math.floor(
    sessions.reduce((acc, session) => acc + session.duration, 0) / 60
  );

  // Calculate streak
  // Sort by date desc
  const sorted = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const currentCheckDate = today;
  
  // Check if we have a session today to start the streak, otherwise check yesterday
  const hasSessionToday = sorted.some(s => {
    const d = new Date(s.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  if (!hasSessionToday) {
    // If no session today, start checking from yesterday
    currentCheckDate.setDate(currentCheckDate.getDate() - 1);
  }

  while (true) {
    const hasSessionOnDate = sorted.some((s) => {
      const d = new Date(s.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === currentCheckDate.getTime();
    });

    if (hasSessionOnDate) {
      streak++;
      currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    totalSessions,
    totalMinutes,
    streak,
  };
}




