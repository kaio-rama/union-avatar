import { useState, useEffect } from 'react';
import AssetCard from './AssetCard';
import { generateThumbnail } from '../functions/generateThubnails';

type GarmentsType = {
  [category: string]: string[];
};

export default function UI() {
  const [garments, setGarments] = useState<GarmentsType>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});
  // Expression used to filter the paths based on the gender and ignoring hair
  const PATH_FILTER = (path : string) => path.split('/')[4].split('_')[2] === gender || path.split('/')[3] === 'hair';

  // Load garments data from JSON file only once
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

  useEffect(() => {
    // Generate thumbnails for each garment to be displayed as previews in the AssetCards
    const pathsToLoad = Object.values(garments)
      .flat()
      .filter(PATH_FILTER);

    if (pathsToLoad.length > 0) {
      const generateIndividualThumbnails = async () => {
        const generatedThumbnails: { [key: string]: string } = {};
        // Generate a thumbnail (PNG) for each path
        for (const path of pathsToLoad) {
          if (!thumbnails[path]) { // Verify if the thumbnail for the path already exists
            try {
              const { path: modelPath, image } = await generateThumbnail(path);  // Wait for the PNG to be generated for each path
              generatedThumbnails[modelPath] = image;   // Store the thumbnail with its path
            } catch (error) {
              console.error(`Error al generar el thumbnail para ${path}:`, error);
            }
          }
        }
        // Update the state with the generated thumbnails 
        setThumbnails((prevThumbnails) => ({
          ...prevThumbnails,
          ...generatedThumbnails,
        }));
      };
      generateIndividualThumbnails();
    }
  }, [garments, gender]);

  // Toggle category
  const toggleCategory = (category: string) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  // Set gender if changing Avatar
  const handleGenderChange = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender);
  };

  return (
    <div className="ui-container">
          <button id="mujer" onClick={() => handleGenderChange('female')}>Mujer</button>
          <button id="hombre" onClick={() => handleGenderChange('male')}>Hombre</button>
      {/* Category   container */}
      <div className="garments-container">              
      {Object.entries(garments).map(([category, paths]) => (
          <div key={category} className="category">
            <button id={category} onClick={() => toggleCategory(category)}>
              {category}
            </button>
            {/* AssetCards container */}
            {activeCategory === category && (
              <div className="subcategory-cards" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {paths
                  .filter(PATH_FILTER)
                  .map((path : string, index: number) => (
                    <AssetCard
                      key={index}
                      path={path}
                      category={category}
                      currentCategory={activeCategory!}
                      image={thumbnails[path]} // Sending the generated thumbnail as preview image of the Asset
                    />
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
        <button id="changeLights" className='lights-button' > Change the Ligths </button>
        <button id="download" className='download-button'>  Download  </button>
    </div>
  );
}