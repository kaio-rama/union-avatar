import { createContext, useContext, useState, ReactNode } from 'react';

interface AssetContextType {
  selectedAsset: string | null;
  setSelectedAsset: (path: string) => void;
}

interface AssetProviderProps {
  children: ReactNode;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

// Provider component that provides the selectedAsset state and setSelectedAsset function
export const AssetProvider = ({ children }: AssetProviderProps) => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  return (
    <AssetContext.Provider value={{ selectedAsset, setSelectedAsset }}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssetContext = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAssetContext must be used within an AssetProvider');
  }
  return context;
};