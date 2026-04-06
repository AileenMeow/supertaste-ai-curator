import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSavedSpots = create(
  persist(
    (set, get) => ({
      savedSpots: [],

      toggleSpot: (stop, themeId, themeName, themeCity) => {
        const { savedSpots } = get();
        const key = `${themeId}::${stop.name}`;
        const exists = savedSpots.some((s) => s._key === key);
        if (exists) {
          set({ savedSpots: savedSpots.filter((s) => s._key !== key) });
        } else {
          set({
            savedSpots: [
              ...savedSpots,
              { ...stop, _key: key, _themeId: themeId, _themeName: themeName, _themeCity: themeCity },
            ],
          });
        }
      },

      isSpotSaved: (stop, themeId) => {
        const key = `${themeId}::${stop.name}`;
        return get().savedSpots.some((s) => s._key === key);
      },

      clearAll: () => set({ savedSpots: [] }),
    }),
    { name: 'supertaste-saved-spots' }
  )
);
