import "@fastify/cookie";
import type { FastifyInstance } from "fastify";
import { pool } from "../db.js";
import { hashPassword, verifyPassword } from "./password.js";
import {
  createSession,
  deleteSession,
  findUserBySession,
  SESSION_COOKIE,
} from "./sessions.js";

interface RegisterBody {
  email?: unknown;
  password?: unknown;
}

const MIN_PASSWORD_LENGTH = 6;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export async function authRoutes(server: FastifyInstance) {
  // Регистрация
  server.post("/api/auth/register", async (request, reply) => {
    const body = (request.body ?? {}) as RegisterBody;

    const rawEmail =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    // Валидация формы
    if (!rawEmail || !EMAIL_RE.test(rawEmail)) {
      return reply
        .code(400)
        .send({ code: "validation_error", message: "Invalid email" });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return reply.code(400).send({
        code: "validation_error",
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      });
    }

    const passwordHash = await hashPassword(password);

    try {
      const result = await pool.query<{ id: number; email: string }>(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
        [rawEmail, passwordHash],
      );
      const user = result.rows[0];

      const sessionId = await createSession(user.id);
      reply.setCookie(SESSION_COOKIE, sessionId, COOKIE_OPTIONS);

      return reply.code(201).send(user);
    } catch (err) {
      if (isUniqueViolation(err)) {
        return reply
          .code(409)
          .send({ code: "email_taken", message: "Email is already taken" });
      }
      throw err;
    }
  });

  // Вход
  server.post("/api/auth/login", async (request, reply) => {
    const body = (request.body ?? {}) as RegisterBody;

    const rawEmail =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!rawEmail || !password) {
      return reply.code(400).send({
        code: "validation_error",
        message: "Email and password are required",
      });
    }

    const result = await pool.query<{
      id: number;
      email: string;
      password_hash: string;
    }>("SELECT id, email, password_hash FROM users WHERE email = $1", [
      rawEmail,
    ]);
    const user = result.rows[0];

    // Одинаковая ошибка для 'email не найден' и 'пароль неверный'
    // чтобы было невозможно подобрать уже зарегистрированные email
    if (!user) {
      return reply.code(401).send({
        code: "invalid_credentials",
        message: "Invalid email or password",
      });
    }

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      return reply.code(401).send({
        code: "invalid_credentials",
        message: "Invalid email or password",
      });
    }

    const sessionId = await createSession(user.id);
    reply.setCookie(SESSION_COOKIE, sessionId, COOKIE_OPTIONS);

    return { id: user.id, email: user.email };
  });

  // Выход
  server.post("/api/auth/logout", async (request, reply) => {
    const sessionId = request.cookies[SESSION_COOKIE];
    if (sessionId) {
      await deleteSession(sessionId);
    }
    reply.clearCookie(SESSION_COOKIE, { path: "/" });
    return reply.code(204).send();
  });

  // Текущий пользователь
  server.get("/api/auth/me", async (request, reply) => {
    const sessionId = request.cookies[SESSION_COOKIE];
    if (!sessionId) {
      return reply
        .code(401)
        .send({ code: "unauthorized", message: "Not authenticated" });
    }

    const user = await findUserBySession(sessionId);
    if (!user) {
      return reply
        .code(401)
        .send({ code: "unauthorized", message: "Not authenticated" });
    }

    return user;
  });
}

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === "23505"
  );
}
