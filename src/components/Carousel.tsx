import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Image {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface CarouselProps {
  refreshTrigger: number;
}

const Carousel: React.FC<CarouselProps> = ({ refreshTrigger }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé');
      }
      const response = await fetch('http://localhost:1234/api/images', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des images');
      }
      const data = await response.json();
      console.log('Images reçues dans le carrousel:', data);
      setImages(data);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement des images');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages, refreshTrigger]);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [images]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  if (isLoading) {
    return <div className="text-white">Chargement des images...</div>;
  }

  if (error) {
    return <div className="text-white">Erreur : {error}</div>;
  }

  if (images.length === 0) {
    return <div className="text-white">Aucune image disponible</div>;
  }

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg">
      {images.map((image, index) => (
        <div
          key={image._id}
          className={`absolute w-full h-full transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.imageUrl}
            alt={image.title}
            className="w-full h-full object-f"
          />
        </div>
      ))}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
          >
            <FaChevronRight size={24} />
          </button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 mx-1 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;