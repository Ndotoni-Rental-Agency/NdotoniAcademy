'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const galleryImages = [
  { src: 'https://ardhiacademy.or.tz/storage/gallery/events_images01.jpg', alt: 'Conference session' },
  { src: 'https://ardhiacademy.or.tz/storage/gallery/events_images02.jpg', alt: 'Workshop participants' },
  { src: 'https://ardhiacademy.or.tz/storage/gallery/events_images03.jpg', alt: 'Award ceremony' },
  { src: 'https://ardhiacademy.or.tz/storage/gallery/events_images04.jpg', alt: 'Panel discussion' },
  { src: 'https://ardhiacademy.or.tz/storage/gallery/events_images05.jpg', alt: 'Group photo' },
  { src: 'https://ardhiacademy.or.tz/storage/gallery/events_images06.jpg', alt: 'Training session' },
  { src: 'https://ardhiacademy.or.tz/storage/gallery/events_images07.jpg', alt: 'Networking event' },
  { src: 'https://ardhiacademy.or.tz/storage/gallery/events_images08.jpg', alt: 'Field visit' },
  { src: 'https://ardhiacademy.or.tz/storage/gallery/events_images09.jpg', alt: 'Presentation' },
  { src: 'https://ardhiacademy.or.tz/storage/gallery/events_images11.jpg', alt: 'Keynote speech' },
  { src: 'https://ardhiacademy.or.tz/storage/gallery/events_images12.jpg', alt: 'Team building' },
  { src: 'https://ardhiacademy.or.tz/storage/gallery/events_images13.jpg', alt: 'Graduation ceremony' },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen pt-16">
      <section className="relative border-b border-white/5 gradient-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3">Moments</p>
            <h1 className="text-3xl font-bold text-white mb-3">Gallery</h1>
            <p className="text-ink-400">Capturing moments from our events, workshops, and professional activities.</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="break-inside-avoid rounded-xl overflow-hidden border border-white/10 group"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="bg-ink-900/80 backdrop-blur-sm px-4 py-3 border-t border-white/5">
                <p className="text-sm font-medium text-ink-200">{img.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
