'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { slideUp, staggerContainer } from '@/lib/animations';
import { bakeryInfo } from '@/lib/constants';
import { Map } from '@/components/ui/Map';

export function LocationCard() {
  const [mapCoords, setMapCoords] = useState<[number, number]>([
    bakeryInfo.coordinates.lat,
    bakeryInfo.coordinates.lng,
  ]);

  useEffect(() => {
    // Generate random coordinates on mount for demo
    const lat = bakeryInfo.coordinates.lat + (Math.random() - 0.5) * 0.2;
    const lng = bakeryInfo.coordinates.lng + (Math.random() - 0.5) * 0.2;
    setMapCoords([lat, lng]);
  }, []);

  const daysOfWeek: (keyof typeof bakeryInfo.hours)[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  // Generate Google Maps directions URL
  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${mapCoords[0]},${mapCoords[1]}`;
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-4xl mx-auto"
        >
          <motion.h2
            variants={slideUp}
            className="font-display text-4xl md:text-5xl font-bold text-center text-foreground mb-12"
          >
            Visit Us
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Hours */}
            <motion.div
              variants={slideUp}
              className="bg-card p-8 rounded-lg shadow-lg"
            >
              <h3 className="font-display text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Hours
              </h3>
              <div className="space-y-3">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="flex justify-between text-sm"
                  >
                    <span className="capitalize text-muted-foreground">
                      {day}
                    </span>
                    <span className="font-medium text-foreground">
                      {bakeryInfo.hours[day]}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              variants={slideUp}
              className="bg-card p-8 rounded-lg shadow-lg space-y-6"
            >
              <div>
                <h3 className="font-display text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  Contact
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Address</p>
                    <p className="text-foreground">{bakeryInfo.address}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <a
                      href={`tel:${bakeryInfo.phone}`}
                      className="text-croissant hover:underline"
                    >
                      {bakeryInfo.phone}
                    </a>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <a
                      href={`mailto:${bakeryInfo.email}`}
                      className="text-croissant hover:underline"
                    >
                      {bakeryInfo.email}
                    </a>
                  </div>
                </div>
              </div>

              <motion.a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full px-6 py-3 bg-croissant text-espresso rounded-full font-semibold hover:shadow-lg transition-shadow text-center"
              >
                Get Directions
              </motion.a>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div
            variants={slideUp}
            className="mt-8 bg-card p-6 rounded-lg shadow-lg"
          >
            <div className="mb-4">
              <h3 className="font-display text-2xl font-semibold mb-2 text-foreground flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                  />
                </svg>
                Find Us Here
              </h3>
              <p className="text-sm text-muted-foreground">
                Located in the heart of the Paris District. Click the marker for details, or use the controls to explore the area.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-croissant/10 text-croissant rounded-full text-xs font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                Demo: Location randomized for privacy
              </div>
            </div>
            <Map
              center={mapCoords}
              markerText={`${bakeryInfo.name} - ${bakeryInfo.address}`}
              zoom={14}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
