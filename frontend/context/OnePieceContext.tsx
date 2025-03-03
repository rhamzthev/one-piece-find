import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnePieceContextType {
  hasFoundOnePiece: boolean;
  setHasFoundOnePiece: (found: boolean) => Promise<void>;
}

const OnePieceContext = createContext<OnePieceContextType | undefined>(undefined);

export function OnePieceProvider({ children }: { children: React.ReactNode }) {
  const [hasFoundOnePiece, setFound] = useState(false);

  useEffect(() => {
    // Check AsyncStorage on mount
    AsyncStorage.getItem('hasFoundOnePiece')
      .then(value => setFound(value === 'true'))
      .catch(err => console.error('Error loading OnePiece state:', err));
  }, []);

  const setHasFoundOnePiece = async (found: boolean) => {
    try {
      await AsyncStorage.setItem('hasFoundOnePiece', found.toString());
      setFound(found);
    } catch (err) {
      console.error('Error saving OnePiece state:', err);
    }
  };

  return (
    <OnePieceContext.Provider value={{ hasFoundOnePiece, setHasFoundOnePiece }}>
      {children}
    </OnePieceContext.Provider>
  );
}

export function useOnePiece() {
  const context = useContext(OnePieceContext);
  if (context === undefined) {
    throw new Error('useOnePiece must be used within an OnePieceProvider');
  }
  return context;
}