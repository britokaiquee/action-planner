import type { AuthSession, AuthUser, LoginCredentials, RegisterUserInput } from "@/modules/auth/domain/entities";
import { authUsersSeed, MOCK_AUTH_PASSWORD } from "@/modules/auth/infrastructure/auth.seed";

export const AUTH_SESSION_STORAGE_KEY = "action-planner.auth.session";
export const AUTH_USERS_STORAGE_KEY = "action-planner.auth.users";
const AUTH_USERS_CLEANUP_STORAGE_KEY = "action-planner.auth.users.cleanup.v1";
const AUTH_SESSION_CHANGE_EVENT = "action-planner.auth.session-change";
const PROFILE_TAG_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const PROFILE_TAG_PREFIX = "#";
const PROFILE_TAG_DEFAULT_LENGTH = 6;
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

function isValidProfileTag(tag: string | undefined) {
  return Boolean(tag && /^#[A-Z0-9]+$/.test(tag));
}

function normalizeDemoEmailValue(email: string) {
  const normalizedEmail = email.toLowerCase();

  if (normalizedEmail === "gestor@actionplanner.com") {
    return "gestor@acessodemo.com";
  }

  if (normalizedEmail === "tecnico@actionplanner.com") {
    return "tecnico@acessodemo.com";
  }

  return normalizedEmail;
}

function normalizeDemoSeedEmail(user: AuthUser) {
  const email = normalizeDemoEmailValue(user.email);

  if (user.id === "gestor-1" && (email === "gestor@actionplanner.com" || email === "gestor@acessodemo.com")) {
    return {
      ...user,
      email: "gestor@acessodemo.com",
    };
  }

  if (user.id === "tecnico-1" && (email === "tecnico@actionplanner.com" || email === "tecnico@acessodemo.com")) {
    return {
      ...user,
      email: "tecnico@acessodemo.com",
    };
  }

  return user;
}

function createRandomProfileTag(length: number) {
  const randomValues = crypto.getRandomValues(new Uint32Array(length));

  return `${PROFILE_TAG_PREFIX}${Array.from(randomValues, (value) => PROFILE_TAG_ALPHABET[value % PROFILE_TAG_ALPHABET.length]).join("")}`;
}

function getProfileTagCapacity(length: number) {
  return PROFILE_TAG_ALPHABET.length ** length;
}

function createUniqueProfileTag(usedTags: Set<string>) {
  let length = PROFILE_TAG_DEFAULT_LENGTH;

  while (usedTags.size >= getProfileTagCapacity(length)) {
    length += 1;
  }

  let nextTag = createRandomProfileTag(length);

  while (usedTags.has(nextTag)) {
    nextTag = createRandomProfileTag(length);
  }

  usedTags.add(nextTag);

  return nextTag;
}

function normalizeStoredAuthUsers(users: AuthUser[]) {
  const usedTags = new Set<string>();

  return users.map((user) => {
    const normalizedUser = normalizeDemoSeedEmail(user);
    const normalizedTag = normalizedUser.profileTag?.toUpperCase();

    if (normalizedTag && isValidProfileTag(normalizedTag) && !usedTags.has(normalizedTag)) {
      usedTags.add(normalizedTag);

      return {
        ...normalizedUser,
        profileTag: normalizedTag,
      };
    }

    return {
      ...normalizedUser,
      profileTag: createUniqueProfileTag(usedTags),
    };
  });
}

function hydrateStoredAuthSession(session: AuthSession | null) {
  if (!session || !isBrowser()) {
    return session;
  }

  const matchedUser = getStoredAuthUsers().find((user) => user.id === session.user.id);

  if (!matchedUser) {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }

  if (
    matchedUser.profileTag === session.user.profileTag &&
    matchedUser.email === session.user.email &&
    matchedUser.name === session.user.name &&
    matchedUser.role === session.user.role &&
    matchedUser.department === session.user.department &&
    matchedUser.jobTitle === session.user.jobTitle &&
    matchedUser.cpf === session.user.cpf &&
    matchedUser.phone === session.user.phone
  ) {
    return session;
  }

  return {
    ...session,
    user: {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
      profileTag: matchedUser.profileTag,
      cpf: matchedUser.cpf,
      phone: matchedUser.phone,
      department: matchedUser.department,
      jobTitle: matchedUser.jobTitle,
    },
  };
}

function notifySessionChange() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(AUTH_SESSION_CHANGE_EVENT));
}

function markSeedCleanupAsApplied() {
  writeStorageValue(AUTH_USERS_CLEANUP_STORAGE_KEY, true);
}

function hasAppliedSeedCleanup() {
  return readStorageValue<boolean>(AUTH_USERS_CLEANUP_STORAGE_KEY, false);
}

function mergeSeedUsers(existingUsers: AuthUser[], seededUsers: AuthUser[]) {
  const seededIds = new Set(seededUsers.map((user) => user.id));
  const nonSeedUsers = existingUsers.filter((user) => !seededIds.has(user.id));

  return normalizeStoredAuthUsers([...seededUsers, ...nonSeedUsers]);
}

export function ensureStoredAuthUsers() {
  if (!isBrowser()) {
    return [] as AuthUser[];
  }

  const existingUsers = readStorageValue<AuthUser[]>(AUTH_USERS_STORAGE_KEY, []);
  const seededUsers = normalizeStoredAuthUsers(authUsersSeed);

  if (existingUsers.length > 0 && !hasAppliedSeedCleanup()) {
    writeStorageValue(AUTH_USERS_STORAGE_KEY, seededUsers);
    markSeedCleanupAsApplied();

    return seededUsers.map((user) => ({ ...user }));
  }

  const normalizedExistingUsers = mergeSeedUsers(existingUsers, seededUsers);

  if (existingUsers.length > 0) {
    if (JSON.stringify(existingUsers) !== JSON.stringify(normalizedExistingUsers)) {
      writeStorageValue(AUTH_USERS_STORAGE_KEY, normalizedExistingUsers);
    }

    return normalizedExistingUsers;
  }

  writeStorageValue(AUTH_USERS_STORAGE_KEY, seededUsers);
  markSeedCleanupAsApplied();

  return seededUsers.map((user) => ({ ...user }));
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
    cachedSessionSnapshot = hydrateStoredAuthSession(JSON.parse(rawValue) as AuthSession);
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
      currentUser.email.toLowerCase() === normalizeDemoEmailValue(credentials.email) &&
      currentUser.password === credentials.password &&
      currentUser.role === credentials.role,
  );
}

export function findStoredAuthUserByEmail(email: string) {
  return getStoredAuthUsers().find((currentUser) => currentUser.email.toLowerCase() === normalizeDemoEmailValue(email));
}

export function createStoredAuthUser(input: RegisterUserInput) {
  const users = getStoredAuthUsers();
  const usedTags = new Set(users.map((user) => user.profileTag).filter((tag): tag is string => Boolean(tag)));
  const newUser: AuthUser = {
    id: `${input.role}-${crypto.randomUUID()}`,
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password ?? MOCK_AUTH_PASSWORD,
    role: input.role,
    profileTag: createUniqueProfileTag(usedTags),
    cpf: input.cpf,
    phone: input.phone,
    department: input.department,
    jobTitle: input.jobTitle,
  };

  users.push(newUser);
  writeStorageValue(AUTH_USERS_STORAGE_KEY, users);

  return { ...newUser };
}
