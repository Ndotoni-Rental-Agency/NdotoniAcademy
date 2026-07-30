'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Download } from 'lucide-react';
import { mockUser, courses, Course, Certificate } from '@/lib/mock-data';
import { getCategoryTheme } from '@/lib/category-theme';

const accentHex: Record<string, string> = {
  'Project Management': '#4f46e5',
  Marketing: '#f4502c',
  Technology: '#0284c7',
  Design: '#d97706',
};

function openCertificate(cert: Certificate, userName: string, course?: Course) {
  const issued = new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const accent = accentHex[course?.category ?? ''] ?? '#4f46e5';
  const certificateId = `NDT-${cert.id.toUpperCase()}`;
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
          .brand .mark { width: 24px; height: 24px; background: ${accent}; border-radius: 6px; color: white; font-weight: 800; font-size: 11px; display: flex; align-items: center; justify-content: center; }
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
                <div class="mark">N</div>
                <span class="word">Ndotoni Academy</span>
              </div>
              <div class="seal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5"/></svg>
              </div>
              <p class="serif eyebrow">Certificate of Completion</p>
              <p class="label">This certifies that</p>
              <p class="serif name">${userName}</p>
              <p class="label" style="margin-top:20px;">has successfully completed</p>
              <p class="serif course">${cert.courseTitle}</p>
              <div class="rule"></div>
              <p class="meta">Score: <strong>${cert.score}%</strong> &middot; <strong>${cert.points}</strong> points &middot; Issued ${issued}</p>
              <div class="bottom">
                <div>
                  <p class="serif sig">${course?.instructor ?? 'Ndotoni Academy'}</p>
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
  const user = mockUser;

  // Organizations don't take courses themselves; this page only applies to individual accounts.
  useEffect(() => {
    if (user.organization) router.replace('/dashboard');
  }, [user.organization, router]);

  if (user.organization) return null;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Certificates</h1>
      <p className="text-sm text-ink-500 mb-8">Certificates you have earned by completing courses.</p>

      {user.certificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {user.certificates.map((cert) => {
            const course = courses.find((c) => c.title === cert.courseTitle);
            const theme = getCategoryTheme(course?.category ?? '');
            return (
              <div key={cert.id} className="rounded-2xl border-2 border-ink-100 overflow-hidden">
                <div className={`${theme.solidBg} relative overflow-hidden p-5`}>
                  <div className="absolute -right-5 -top-5 w-20 h-20 bg-white/10 rotate-45" />
                  <Award className="w-8 h-8 text-white relative" />
                  <p className="text-[11px] font-bold uppercase tracking-wide text-white/80 mt-3 relative">Certificate of completion</p>
                  <p className="font-extrabold text-white text-lg leading-tight mt-0.5 relative">{cert.courseTitle}</p>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-ink-900">Score: {cert.score}%</p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      {cert.points} points · {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={() => openCertificate(cert, user.name, course)}
                    className={`flex items-center gap-1.5 text-xs font-bold text-white ${theme.solidBg} ${theme.solidBgHover} px-3 py-2 rounded-lg transition-colors flex-shrink-0`}
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            );
          })}
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
