import { randomBytes } from "node:crypto";
import { pool } from "../db.js";

const SESSION_BYTES = 32;
export const SESSION_COOKIE = "session_id";

export interface SessionUser {
  id: number;
  email: string;
}

// Создаёт новую сессию для пользователя
// Возвращает id сессии, он пойдёт в cookie
export async function createSession(userId: number): Promise<string> {
  const id = randomBytes(SESSION_BYTES).toString("hex");
  await pool.query("INSERT INTO sessions (id, user_id) VALUES ($1, $2)", [
    id,
    userId,
  ]);
  return id;
}

// Удаляет сессию по id при logout
export async function deleteSession(sessionId: string): Promise<void> {
  await pool.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
}

// Находит пользователя по id сессии
// Возвращает null, если сессии нет
export async function findUserBySession(
  sessionId: string,
): Promise<SessionUser | null> {
  const result = await pool.query<SessionUser>(
    `SELECT u.id, u.email
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.id = $1`,
    [sessionId],
  );
  return result.rows[0] ?? null;
}
