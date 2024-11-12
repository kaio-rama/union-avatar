import { useAssetContext } from './AssetContext';

interface AssetCardProps {
  path: string;
  category: string;
  currentCategory: string;
  image: string;
}

export default function AssetCard({ path, category, currentCategory, image }: AssetCardProps) {
  const { setSelectedAsset } = useAssetContext();
  
  const handleClick = () => {
    if (category === currentCategory) {
      setSelectedAsset(path); // Set the selected asset in the global state
    }
  };

  return (
    <div className='asset-card' onClick={handleClick}>
      <img src={image} alt='Loading...' />
    </div>
  );
}
