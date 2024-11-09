import { useState, useEffect } from 'react';
import AssetCard from './AssetCard';

type GarmentsType = {
  [category: string]: string[];
};

export default function UI() {
  const [garments, setGarments] = useState<GarmentsType>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('female');

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
  };

  // Set gender if changing Avatar
  const handleGenderChange = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender);
  };
  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <div className="ui-container" style={{ width: '50%', padding: '10px', overflowY: 'auto' }}>
        <button id="mujer" onClick={() => handleGenderChange('female')}>Mujer</button>
        <button id="hombre" onClick={() => handleGenderChange('male')}>Hombre</button>

        {/* category container */}
        <div className="garments-container">
          {Object.entries(garments).map(([category, paths]) => (
            <div key={category} className="category">
              <button id={category} onClick={() => toggleCategory(category)}>
                {category}
              </button>
              {activeCategory === category && (
                <div className="subcategory-cards" style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {paths
                     // cheks if the path is for the current gender ( or if it is a hair category )
                    .filter((path) => path.split('/')[4].split('_')[2] === gender || path.split('/')[3] === 'hair')
                    .map((path) => (
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
        <button id="download" className='download-button'>
          Download
        </button>
      </div>
    </div>
  );
}
