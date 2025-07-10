import { useState, useEffect, useCallback } from "react";

type GridStyle = "horizontal" | "vertical";

export default function useGridStyle(key = "gridStyle"): [GridStyle, () => void] {
  // Inicializa desde localStorage o default
  const [gridStyle, setGridStyle] = useState<GridStyle>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    return stored === "vertical" ? "vertical" : "horizontal";
  });

  // Cada vez que cambie, lo guardamos
  useEffect(() => {
    localStorage.setItem(key, gridStyle);
  }, [gridStyle, key]);

  // Toggle simplificado
  const toggleGridStyle = useCallback(() => {
    setGridStyle(prev => (prev === "horizontal" ? "vertical" : "horizontal"));
  }, []);

  return [gridStyle, toggleGridStyle];
}
