import { useState, useEffect } from 'react';
import { loadDataFromExcel } from '../utils/dataLoader';

export function useThemes() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDataFromExcel()
      .then((data) => {
        setThemes(data.themes);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { themes, loading, error };
}

export function useThemeByKey(city, theme) {
  const { themes, loading, error } = useThemes();
  const themeData = themes.find((t) => t.city === city && t.theme === theme);
  return { theme: themeData, loading, error };
}
