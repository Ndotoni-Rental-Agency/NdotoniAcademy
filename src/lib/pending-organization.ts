// Hands the org name/type entered in OrganizationSignupWizard's step 1
// across the Cognito email-confirmation gap — signUp() there can't create
// the organization itself (createOrganization needs an authenticated
// caller, and Cognito requires confirming the new account before it can
// sign in). /dashboard/create-organization reads this to pre-fill once
// they've confirmed and signed in for the first time.
const KEY = 'pendingOrganization';

export interface PendingOrganization {
  name: string;
  type: string;
}

export function savePendingOrganization(value: PendingOrganization): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(KEY, JSON.stringify(value));
}

// Safe to call from a useState lazy initializer, which Next.js runs during
// this client component's server render too, where sessionStorage doesn't exist.
export function readPendingOrganization(): PendingOrganization | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingOrganization;
  } catch {
    return null;
  }
}

export function clearPendingOrganization(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(KEY);
}
