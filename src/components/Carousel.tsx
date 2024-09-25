import React, { useState, useEffect, useCallback } from 'react';

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
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

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

  const handleImageError = useCallback((imageId: string) => {
    setFailedImages(prev => new Set(prev).add(imageId));
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [images]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return <div>Chargement des images...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (images.length === 0) {
    return <div>Aucune image disponible</div>;
  }

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg">
      {images.map((image, index) => (
        <div
          key={image._id}
          className={`absolute w-full h-full transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {!failedImages.has(image._id) ? (
            <img
              src={image.imageUrl || 'chemin/vers/image/par/defaut.jpg'}
              alt={image.title}
              className="w-full h-full object-cover"
              onError={() => handleImageError(image._id)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p>Image non disponible</p>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
            <h3 className="text-lg font-bold">{image.title}</h3>
            <p className="text-sm">{image.description}</p>
          </div>
        </div>
      ))}
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
    </div>
  );
};

export default Carousel;