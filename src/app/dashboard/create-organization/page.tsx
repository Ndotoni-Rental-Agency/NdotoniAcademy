'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Loader2, XCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GraphQLClient } from '@/lib/graphql-client';
import { createOrganization } from '@/graphql/mutations';
import { OrganizationType, type CreateOrganizationMutation, type CreateOrganizationMutationVariables } from '@/API';
import { inputClass, orgTypes } from '@/components/auth/shared';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function CreateOrganizationPage() {
  const { user, refetch } = useAuth();
  const router = useRouter();
  const hasOrg = Boolean(user?.organizations[0]?.organization);

  // One organization per account — the backend rejects this too, but
  // redirecting someone who already has one away from the form entirely is
  // a better experience than letting them fill it out just to hit an error.
  useEffect(() => {
    if (hasOrg) router.replace('/dashboard/team');
  }, [hasOrg, router]);

  const [name, setName] = useState('');
  const [type, setType] = useState<OrganizationType>(OrganizationType.COMPANY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user || hasOrg) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = slugify(name);
    if (!slug) {
      setError('That name needs at least one letter or number.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await GraphQLClient.execute<CreateOrganizationMutation>(createOrganization, {
        input: { name: name.trim(), slug, type },
      } satisfies CreateOrganizationMutationVariables);
      await refetch();
      router.push('/dashboard/team');
    } catch (err) {
      console.error('[create-organization] createOrganization failed ->', err);
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      // Slugs double as the organization's id — a collision is the one
      // failure mode worth explaining specifically rather than showing the
      // raw backend message.
      setError(
        message.includes('already exists') || message.includes('conflict')
          ? 'An organization with a similar name already exists — try a more specific name.'
          : message
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-md">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
        <Building2 className="w-6 h-6 text-indigo-600" />
      </div>
      <h1 className="text-2xl font-semibold text-ink-900 mb-1">Create an organization</h1>
      <p className="text-sm text-ink-500 mb-6">
        You&apos;ll be the owner, with full control over settings and roles — your individual account and courses stay exactly as they are.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="orgName" className="block text-sm font-semibold text-ink-700 mb-1.5">Organization name</label>
          <input
            id="orgName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Bahari Freight Ltd"
            className={inputClass}
            required
            autoFocus
            disabled={submitting}
          />
        </div>
        <div>
          <label htmlFor="orgType" className="block text-sm font-semibold text-ink-700 mb-1.5">Organization type</label>
          <select
            id="orgType"
            value={type}
            onChange={(e) => setType(e.target.value as OrganizationType)}
            className={inputClass}
            disabled={submitting}
          >
            {orgTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {error && (
          <p className="flex items-start gap-1.5 text-sm text-red-600">
            <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create organization'}
        </button>
      </form>
    </div>
  );
}
