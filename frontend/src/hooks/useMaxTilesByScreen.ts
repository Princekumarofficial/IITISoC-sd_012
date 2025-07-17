import { useEffect, useState } from "react";

export default function useMaxTilesByScreen() {
  const [maxTiles, setMaxTiles] = useState(16);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setMaxTiles(4); // phones
      } else if (width < 1280) {
        setMaxTiles(9); // tablets
      } else {
        setMaxTiles(16); // laptops and larger
      }
    };

    handleResize(); // initialize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return maxTiles;
}
