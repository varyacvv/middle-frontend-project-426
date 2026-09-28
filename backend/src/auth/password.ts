import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;

// Хеширует пароль через scrypt
// Возвращает строку вида "salt:hash"

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, KEY_LENGTH);
  return `${salt}:${derived.toString("hex")}`;
}

// Проверяет пароль против сохранённого хеша
// Использует timingSafeEqual, чтобы исключить timing-атаки

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;

  const storedBuf = Buffer.from(hashHex, "hex");
  const derived = await scryptAsync(password, salt, KEY_LENGTH);

  if (storedBuf.length !== derived.length) return false;
  return timingSafeEqual(storedBuf, derived);
}
