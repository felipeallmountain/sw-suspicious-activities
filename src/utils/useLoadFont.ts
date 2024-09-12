import { useEffect, useState } from "react";
import { FontLoader, Font } from 'three/addons/loaders/FontLoader.js';

export const useLoadFont = (fontPath: string) => {
  const [font, setFont] = useState<Font>();

  useEffect(() => {
    const loader = new FontLoader();
    loader.load(
      fontPath,
      loadedFont => {
        setFont(loadedFont);
      },
      undefined,
      error => console.error(error),
    )
  }, [fontPath]);

  return font;
};
