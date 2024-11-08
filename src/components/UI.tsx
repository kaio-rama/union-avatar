import { useState, useEffect } from 'react';
import useResizeHandler from '../hooks/useResizeHandler';
import { useRefs } from '../hooks/useRefs';
import AssetCard from './AssetCard';

type GarmentsType = {
  [category: string]: string[];
};

export default function UI() {
  const { rendererRef, cameraRef } = useRefs();
  const [garments, setGarments] = useState<GarmentsType>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useResizeHandler({ rendererRef, cameraRef });

  // Load garments data from JSON file
  useEffect(() => {
    const loadGarments = async () => {
      try {
        const response = await fetch('/assetList.json');
        const data = await response.json();
        setGarments(data.garments);
      } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
      }
    };
    loadGarments();
  }, []);

  // Toggle category
  const toggleCategory = (category: string) => {
    setActiveCategory((prev) => (prev === category ? null : category));
    console.log( "active category ", activeCategory, category);
    
  };

// create one canvas for each category

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <div className="ui-container" style={{ width: '50%', padding: '10px', overflowY: 'auto' }}>
        <button id="mujer">Mujer</button>
        <button id="hombre">Hombre</button>

        <div className="garments-container">
          {Object.entries(garments).map(([category, paths]) => (
            <div key={category} className="category">
              <button onClick={() => toggleCategory(category)}>
                {category}
              </button>
              {activeCategory === category && (
                <div className="subcategory-cards" style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {paths.map((path) => (
                    <AssetCard
                      key={path}
                      path={path}
                      category={category}
                      currentCategory={activeCategory!}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}