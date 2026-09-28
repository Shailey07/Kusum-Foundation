import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteData } from '../context/SiteData';
import { SmartImg } from '../components/PageParts';

const Gallery = () => {
  const { galleryItems, galleryCategories } = useSiteData();
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = galleryCategories;
  const images = galleryItems;

  const filteredImages =
    filter === 'All' ? images : images.filter((img) => img.category === filter);

  return (
    <div className="bg-white min-h-screen">
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">
            Gallery
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
            Moments from the field.
          </h1>
          <p className="mt-6 text-base text-gray-600 leading-relaxed max-w-3xl">
            Glimpses of joy, hard work, and impact created by our team and
            volunteers across rural Bihar.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
                  filter === cat
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* __GRID__ */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredImages.map((img, idx) => (
                <motion.div
                  key={img._id || idx}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer group card-hover"
                  onClick={() => setSelectedImage(img)}
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <SmartImg
                      src={img.src}
                      alt={img.title}
                      seed={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-1">
                      {img.category}
                    </p>
                    <h3 className="text-base font-semibold text-gray-900">
                      {img.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      {/* __MODAL__ */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-10 right-0 text-white hover:text-gray-300 p-2 text-3xl z-50"
                onClick={() => setSelectedImage(null)}
              >
                &times;
              </button>
              <SmartImg
                src={selectedImage.src}
                alt={selectedImage.title}
                seed={selectedImage.title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg bg-white"
              />
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/70 to-transparent rounded-b-lg text-white">
                <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
                <div className="flex gap-4 mt-1 text-sm text-gray-300">
                  <span>{selectedImage.location}</span>
                  <span>{selectedImage.date}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
