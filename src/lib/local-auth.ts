import { useEffect, useState } from "react";

/** Accounts kept in this browser (localStorage): for demos and local use, not production. */
export type LocalUser = { id: string; name: string; email: string; isGuest: boolean };

type StoredUser = LocalUser & { password: string };

const USERS_KEY = "app.users";
const SESSION_KEY = "app.session";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode): the session lasts until reload
  }
}

let current: LocalUser | null = read<LocalUser | null>(SESSION_KEY, null);
const listeners = new Set<(user: LocalUser | null) => void>();

function setCurrent(user: LocalUser | null) {
  current = user;
  if (user) write(SESSION_KEY, user);
  else {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  }
  for (const listener of listeners) listener(user);
}

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function currentUser(): LocalUser | null {
  return current;
}

/** Throws an Error with a user-facing message when the email is taken or a field is empty. */
export function register(name: string, email: string, password: string): LocalUser {
  const users = read<StoredUser[]>(USERS_KEY, []);
  const key = email.trim().toLowerCase();
  if (!name.trim() || !key || !password) throw new Error("Please fill in every field.");
  if (users.some((user) => user.email === key)) {
    throw new Error("An account with this email already exists.");
  }
  const stored: StoredUser = { id: newId(), name: name.trim(), email: key, password, isGuest: false };
  write(USERS_KEY, [...users, stored]);
  const { password: _password, ...user } = stored;
  setCurrent(user);
  return user;
}

/** Throws an Error with a user-facing message when the email or password is wrong. */
export function login(email: string, password: string): LocalUser {
  const key = email.trim().toLowerCase();
  const found = read<StoredUser[]>(USERS_KEY, []).find(
    (user) => user.email === key && user.password === password,
  );
  if (!found) throw new Error("Wrong email or password.");
  const { password: _password, ...user } = found;
  setCurrent(user);
  return user;
}

export function continueAsGuest(): LocalUser {
  const user: LocalUser = { id: newId(), name: "Guest", email: "", isGuest: true };
  setCurrent(user);
  return user;
}

export function logout() {
  setCurrent(null);
}

/** The signed-in user (null when signed out) and the account actions; no provider needed. */
export function useAuth() {
  const [user, setUser] = useState(current);
  useEffect(() => {
    listeners.add(setUser);
    return () => {
      listeners.delete(setUser);
    };
  }, []);
  return { user, register, login, logout, continueAsGuest };
}

export default useAuth;