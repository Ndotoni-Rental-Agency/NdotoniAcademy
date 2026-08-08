'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Download, Loader2 } from 'lucide-react';
import { useAuth, dashboardModeFor } from '@/lib/auth-context';
import { accentByMode } from '@/lib/dashboard-accent';
import { GraphQLClient } from '@/lib/graphql-client';
import { myCertificates as myCertificatesQuery } from '@/graphql/queries';
import type { MyCertificatesQuery } from '@/API';

type Certificate = MyCertificatesQuery['myCertificates'][number];

const accentHex: Record<string, string> = {
  'Project Management': '#4f46e5',
  Marketing: '#f4502c',
  Technology: '#0284c7',
  Design: '#d97706',
};

function openCertificate(cert: Certificate) {
  const issued = new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const accent = accentHex[cert.category ?? ''] ?? '#4f46e5';
  const certificateId = `NDT-${cert.id.toUpperCase()}`;
  const instructorName = cert.instructorName ?? 'Ndotoni Academy';
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Certificate: ${cert.courseTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; }
          body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 24px; background: #f3f4f6; }
          .serif { font-family: 'Playfair Display', Georgia, serif; }
          .wrap { position: relative; width: 100%; max-width: 640px; background: white; border-radius: 16px; box-shadow: 0 20px 40px rgba(17,24,39,0.12); overflow: hidden; }
          .ribbon-clip { position: absolute; top: 0; right: 0; width: 144px; height: 144px; overflow: hidden; pointer-events: none; }
          .ribbon { position: absolute; top: 22px; right: -38px; width: 170px; transform: rotate(45deg); background: ${accent}; color: white; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-align: center; padding: 6px 0; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
          .frame-outer { border: 3px solid rgba(17,24,39,0.85); margin: 12px; border-radius: 12px; }
          .frame-inner { border: 1px solid #fbbf24; margin: 6px; border-radius: 10px; padding: 40px 36px; text-align: center; }
          .brand { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 20px; }
          .brand .mark { width: 24px; height: 24px; object-fit: contain; }
          .brand .word { font-size: 12px; font-weight: 700; letter-spacing: 0.15em; color: #6b7280; text-transform: uppercase; }
          .seal { width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 20px; background: radial-gradient(circle at 35% 30%, #fcd34d, #d97706); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(217,119,6,0.35); }
          .seal svg { width: 28px; height: 28px; color: white; }
          .eyebrow { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: ${accent}; margin-bottom: 24px; }
          .label { font-size: 14px; color: #9ca3af; margin: 8px 0; }
          .name { font-size: 28px; font-weight: 700; color: #111827; display: inline-block; padding: 0 32px 12px; margin: 8px 0; border-bottom: 2px solid #f3f4f6; }
          .course { font-size: 20px; font-weight: 700; color: #111827; margin: 20px 0 24px; }
          .rule { width: 64px; height: 1px; background: linear-gradient(to right, transparent, #fbbf24, transparent); margin: 0 auto 24px; }
          .meta { font-size: 13px; color: #9ca3af; margin-bottom: 32px; }
          .meta strong { color: #374151; }
          .bottom { display: flex; align-items: flex-end; justify-content: space-between; text-align: left; gap: 16px; }
          .sig { font-style: italic; font-size: 14px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; min-width: 110px; margin-bottom: 4px; }
          .caption { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; }
          .serial { text-align: right; }
          .serial-id { font-family: monospace; font-size: 12px; color: #4b5563; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="ribbon-clip"><div class="ribbon">VERIFIED</div></div>
          <div class="frame-outer">
            <div class="frame-inner">
              <div class="brand">
                <img class="mark" src="${window.location.origin}/ndotoni-academy-icon.png" alt="" />
                <span class="word">Ndotoni Academy</span>
              </div>
              <div class="seal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5"/></svg>
              </div>
              <p class="serif eyebrow">Certificate of Completion</p>
              <p class="label">This certifies that</p>
              <p class="serif name">${cert.holderName}</p>
              <p class="label" style="margin-top:20px;">has successfully completed</p>
              <p class="serif course">${cert.courseTitle}</p>
              <div class="rule"></div>
              <p class="meta"><strong>${cert.totalLessons}</strong> lesson${cert.totalLessons === 1 ? '' : 's'} &middot; Issued ${issued}</p>
              <div class="bottom">
                <div>
                  <p class="serif sig">${instructorName}</p>
                  <p class="caption">Instructor</p>
                </div>
                <div class="serial">
                  <p class="caption">Certificate ID</p>
                  <p class="serial-id">${certificateId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `);
  win.document.close();
}

export default function CertificatesPage() {
  const router = useRouter();
  const { user, wantsToTeach } = useAuth();
  // Only OWNER/ADMIN don't take courses themselves — a plain MEMBER or an
  // INSTRUCTOR is still a learner too and keeps this page.
  const isOrgManager = user ? dashboardModeFor(user, wantsToTeach) === 'organization' : false;
  const accent = user ? accentByMode[dashboardModeFor(user, wantsToTeach)] : accentByMode.learner;

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { myCertificates: fetched } = await GraphQLClient.execute<MyCertificatesQuery>(myCertificatesQuery);
      setCertificates(fetched);
    } catch (err) {
      console.error('[CertificatesPage] myCertificates failed ->', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOrgManager) router.replace('/dashboard');
  }, [isOrgManager, router]);

  useEffect(() => {
    if (user && !isOrgManager) void load();
  }, [user, isOrgManager, load]);

  if (!user || isOrgManager) return null; // no user yet: DashboardLayout is still loading/redirecting

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold text-ink-900 mb-1">Certificates</h1>
      <p className="text-sm text-ink-500 mb-8">Certificates you have earned by completing courses.</p>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-ink-200 bg-white py-16">
          <Loader2 className="w-5 h-5 text-ink-400 animate-spin" />
        </div>
      ) : certificates.length > 0 ? (
        <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
          {certificates.map((cert) => (
            <div key={cert.id} className="flex items-center gap-3 py-2.5 px-3.5">
              <div className="w-[30px] h-[30px] rounded-full bg-warm-100 flex items-center justify-center flex-shrink-0">
                <Award className="w-3.5 h-3.5 text-warm-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-semibold text-ink-900 truncate">{cert.courseTitle}</p>
                <p className="text-[11.5px] text-ink-400">
                  {cert.totalLessons} lesson{cert.totalLessons === 1 ? '' : 's'} · Issued {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => openCertificate(cert)}
                className={`flex items-center gap-1.5 text-xs font-bold ${accent.text600} hover:underline flex-shrink-0`}
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Award className="w-10 h-10 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500 text-sm">No certificates yet. Complete a course to earn one.</p>
        </div>
      )}
    </div>
  );
}
