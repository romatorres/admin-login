"use client";
import React from "react";

export default function MasonryGrid() {
  // 🧱 Array local de itens
  const items = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      title: "Classic Haircut",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800",
      title: "Vintage Tools",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      title: "Modern Barber Style",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800",
      title: "Gentleman’s Trim",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800",
      title: "Beard Perfection",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      title: "Fresh Cut",
    },
    {
      id: 7,
      image:
        "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800",
      title: "Shave & Style",
    },
    {
      id: 8,
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      title: "Urban Look",
    },
  ];

  return (
    <section className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-center text-3xl font-bold mb-8 text-foreground">
          Masonry Gallery
        </h1>

        {/* GRID RESPONSIVO */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="mb-4 break-inside-avoid overflow-hidden rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-transform duration-300 hover:scale-[1.02]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-auto object-cover"
              />
              <div className="p-3 text-sm text-gray-700 dark:text-gray-300">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
