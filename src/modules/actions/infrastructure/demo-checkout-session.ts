export interface PendingDemoCheckout {
  userEmail: string;
  actionId: string;
  actionDate: string;
  checkInAt: string;
}

const DEMO_CHECKOUT_STORAGE_KEY = "action-planner.demo.pending-checkouts";
const DEMO_CHECKOUT_CHANGE_EVENT = "action-planner.demo-pending-checkouts-change";

function isBrowser() {
  return typeof window !== "undefined";
}

function readPendingDemoCheckouts() {
  if (!isBrowser()) {
    return [] as PendingDemoCheckout[];
  }

  const rawValue = window.sessionStorage.getItem(DEMO_CHECKOUT_STORAGE_KEY);

  if (!rawValue) {
    return [] as PendingDemoCheckout[];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as PendingDemoCheckout[];

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [] as PendingDemoCheckout[];
  }
}

function writePendingDemoCheckouts(checkouts: PendingDemoCheckout[]) {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.setItem(DEMO_CHECKOUT_STORAGE_KEY, JSON.stringify(checkouts));
  window.dispatchEvent(new Event(DEMO_CHECKOUT_CHANGE_EVENT));
}

export function savePendingDemoCheckout(checkOut: PendingDemoCheckout) {
  const currentCheckouts = readPendingDemoCheckouts().filter(
    (item) =>
      !(
        item.userEmail.toLowerCase() === checkOut.userEmail.toLowerCase() &&
        item.actionId === checkOut.actionId &&
        item.actionDate === checkOut.actionDate
      ),
  );

  writePendingDemoCheckouts([...currentCheckouts, checkOut]);
}

export function getPendingDemoCheckout(input: {
  userEmail: string;
  actionId: string;
  actionDate?: string;
}) {
  if (!input.actionDate) {
    return null;
  }

  return (
    readPendingDemoCheckouts().find(
      (item) =>
        item.userEmail.toLowerCase() === input.userEmail.toLowerCase() &&
        item.actionId === input.actionId &&
        item.actionDate === input.actionDate,
    ) ?? null
  );
}

export function listPendingDemoCheckouts(userEmail: string) {
  return readPendingDemoCheckouts().filter((item) => item.userEmail.toLowerCase() === userEmail.toLowerCase());
}

export function clearPendingDemoCheckout(input: {
  userEmail: string;
  actionId: string;
  actionDate?: string;
}) {
  if (!input.actionDate) {
    return;
  }

  writePendingDemoCheckouts(
    readPendingDemoCheckouts().filter(
      (item) =>
        !(
          item.userEmail.toLowerCase() === input.userEmail.toLowerCase() &&
          item.actionId === input.actionId &&
          item.actionDate === input.actionDate
        ),
    ),
  );
}

export function subscribeToPendingDemoCheckouts(onChange: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === null || event.key === DEMO_CHECKOUT_STORAGE_KEY) {
      onChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(DEMO_CHECKOUT_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(DEMO_CHECKOUT_CHANGE_EVENT, onChange);
  };
}