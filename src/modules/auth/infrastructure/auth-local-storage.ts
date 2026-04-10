import type { AuthSession, AuthUser, LoginCredentials, RegisterUserInput } from "@/modules/auth/domain/entities";
import { authUsersSeed, MOCK_AUTH_PASSWORD } from "@/modules/auth/infrastructure/auth.seed";

export const AUTH_SESSION_STORAGE_KEY = "action-planner.auth.session";
export const AUTH_USERS_STORAGE_KEY = "action-planner.auth.users";
const AUTH_SESSION_CHANGE_EVENT = "action-planner.auth.session-change";
let cachedSessionRawValue: string | null | undefined;
let cachedSessionSnapshot: AuthSession | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

function readStorageValue<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function writeStorageValue<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function notifySessionChange() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(AUTH_SESSION_CHANGE_EVENT));
}

export function ensureStoredAuthUsers() {
  if (!isBrowser()) {
    return [] as AuthUser[];
  }

  const existingUsers = readStorageValue<AuthUser[]>(AUTH_USERS_STORAGE_KEY, []);

  if (existingUsers.length > 0) {
    return existingUsers;
  }

  writeStorageValue(AUTH_USERS_STORAGE_KEY, authUsersSeed);

  return authUsersSeed.map((user) => ({ ...user }));
}

export function getStoredAuthUsers() {
  return ensureStoredAuthUsers().map((user) => ({ ...user }));
}

export function getStoredAuthSession() {
  return readStorageValue<AuthSession | null>(AUTH_SESSION_STORAGE_KEY, null);
}

function updateStoredAuthSessionCache(rawValue: string | null) {
  if (cachedSessionRawValue === rawValue) {
    return cachedSessionSnapshot;
  }

  cachedSessionRawValue = rawValue;

  if (!rawValue) {
    cachedSessionSnapshot = null;
    return cachedSessionSnapshot;
  }

  try {
    cachedSessionSnapshot = JSON.parse(rawValue) as AuthSession;
  } catch {
    cachedSessionSnapshot = null;
  }

  return cachedSessionSnapshot;
}

export function persistStoredAuthSession(session: AuthSession) {
  const rawSession = JSON.stringify(session);

  if (isBrowser()) {
    window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, rawSession);
  }

  updateStoredAuthSessionCache(rawSession);
  notifySessionChange();
}

export function clearStoredAuthSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  updateStoredAuthSessionCache(null);
  notifySessionChange();
}

export function getStoredAuthSessionSnapshot() {
  if (!isBrowser()) {
    return null;
  }

  return updateStoredAuthSessionCache(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY));
}

export function subscribeToStoredAuthSession(onStoreChange: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === null || event.key === AUTH_SESSION_STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(AUTH_SESSION_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(AUTH_SESSION_CHANGE_EVENT, onStoreChange);
  };
}

export function findStoredAuthUserByCredentials(credentials: LoginCredentials) {
  return getStoredAuthUsers().find(
    (currentUser) =>
      currentUser.email.toLowerCase() === credentials.email.toLowerCase() &&
      currentUser.password === credentials.password &&
      currentUser.role === credentials.role,
  );
}

export function findStoredAuthUserByEmail(email: string) {
  return getStoredAuthUsers().find((currentUser) => currentUser.email.toLowerCase() === email.toLowerCase());
}

export function createStoredAuthUser(input: RegisterUserInput) {
  const users = getStoredAuthUsers();
  const newUser: AuthUser = {
    id: `${input.role}-${crypto.randomUUID()}`,
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password ?? MOCK_AUTH_PASSWORD,
    role: input.role,
    cpf: input.cpf,
    phone: input.phone,
    department: input.department,
    jobTitle: input.jobTitle,
  };

  users.push(newUser);
  writeStorageValue(AUTH_USERS_STORAGE_KEY, users);

  return { ...newUser };
}
