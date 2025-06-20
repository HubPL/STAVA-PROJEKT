'use client';

import { useState } from 'react';

/**
 * Hook do zarządzania lightbox
 * @param {Array} images - Tablica obrazów
 * @returns {Object} Obiekt z funkcjami i stanem lightbox
 */
export default function useLightbox(images = []) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (index = 0) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const navigateToIndex = (index) => {
    if (index >= 0 && index < images.length) {
      setSelectedIndex(index);
    }
  };

  const next = () => {
    const newIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(newIndex);
  };

  const previous = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : images.length - 1;
    setSelectedIndex(newIndex);
  };

  return {
    isOpen,
    selectedIndex,
    openLightbox,
    closeLightbox,
    navigateToIndex,
    next,
    previous,
    currentImage: images[selectedIndex] || null,
  };
} 