'use client';

import { Award, Download } from 'lucide-react';
import { mockUser } from '@/lib/mock-data';

export default function CertificatesPage() {
  const user = mockUser;

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Certificates</h1>
      <p className="text-sm text-ink-500 mb-8">Certificates you have earned by completing courses.</p>

      {user.certificates.length > 0 ? (
        <div className="space-y-4">
          {user.certificates.map((cert) => (
            <div key={cert.id} className="flex items-center gap-4 py-4 border-b border-ink-100 last:border-0">
              <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink-900 text-sm">{cert.courseTitle}</p>
                <p className="text-xs text-ink-400 mt-0.5">
                  Score: {cert.score}% · {cert.cpdPoints} CPD points · {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
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
