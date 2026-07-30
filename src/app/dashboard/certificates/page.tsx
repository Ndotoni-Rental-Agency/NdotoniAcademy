'use client';

import { Award, Download } from 'lucide-react';
import { mockUser, courses, Certificate } from '@/lib/mock-data';
import { getCategoryTheme } from '@/lib/category-theme';

const accentHex: Record<string, string> = {
  'Project Management': '#4f46e5',
  Marketing: '#f4502c',
  Technology: '#0284c7',
  Design: '#d97706',
};

function openCertificate(cert: Certificate, userName: string, category?: string) {
  const issued = new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const accent = accentHex[category ?? ''] ?? '#4f46e5';
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Certificate: ${cert.courseTitle}</title>
        <style>
          body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f3f4f6; }
          .cert { width: 100%; max-width: 720px; border: 10px solid ${accent}; border-radius: 16px; padding: 64px 48px; text-align: center; background: white; }
          .eyebrow { text-transform: uppercase; letter-spacing: 0.1em; font-size: 12px; font-weight: 700; color: ${accent}; }
          h1 { font-size: 28px; margin: 16px 0 4px; }
          .name { font-size: 22px; font-weight: 700; margin: 24px 0 4px; }
          .course { font-size: 18px; color: #374151; margin-bottom: 24px; }
          .meta { font-size: 13px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="cert">
          <p class="eyebrow">Ndotoni Academy · Certificate of Completion</p>
          <h1>This certifies that</h1>
          <p class="name">${userName}</p>
          <p>has successfully completed</p>
          <p class="course">${cert.courseTitle}</p>
          <p class="meta">Score: ${cert.score}% &middot; ${cert.points} points &middot; Issued ${issued}</p>
        </div>
        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `);
  win.document.close();
}

export default function CertificatesPage() {
  const user = mockUser;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Certificates</h1>
      <p className="text-sm text-ink-500 mb-8">Certificates you have earned by completing courses.</p>

      {user.certificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {user.certificates.map((cert) => {
            const category = courses.find((c) => c.title === cert.courseTitle)?.category;
            const theme = getCategoryTheme(category ?? '');
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
                    onClick={() => openCertificate(cert, user.name, category)}
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
