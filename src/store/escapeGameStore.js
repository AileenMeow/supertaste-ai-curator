import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useEscapeGameStore = create(
  persist(
    (set, get) => ({
      progress: {},

      initCity: (cityId) => {
        const { progress } = get();
        if (!progress[cityId]) {
          set({
            progress: {
              ...progress,
              [cityId]: {
                currentMission: 0,
                completedMissions: [],
                uploadedPhotos: {},
                startedAt: new Date().toISOString(),
                completedAt: null,
              },
            },
          });
        }
      },

      getCityProgress: (cityId) => get().progress[cityId] || null,

      completeMission: (cityId, missionId, photoData) => {
        const { progress } = get();
        const cityProgress = progress[cityId] || {
          currentMission: 0,
          completedMissions: [],
          uploadedPhotos: {},
        };
        if (cityProgress.completedMissions.includes(missionId)) return;
        set({
          progress: {
            ...progress,
            [cityId]: {
              ...cityProgress,
              currentMission: cityProgress.currentMission + 1,
              completedMissions: [...cityProgress.completedMissions, missionId],
              uploadedPhotos: {
                ...cityProgress.uploadedPhotos,
                [missionId]: {
                  url: photoData.url,
                  timestamp: new Date().toISOString(),
                },
              },
            },
          },
        });
      },

      completeGame: (cityId) => {
        const { progress } = get();
        const cityProgress = progress[cityId];
        if (!cityProgress) return;
        set({
          progress: {
            ...progress,
            [cityId]: { ...cityProgress, completedAt: new Date().toISOString() },
          },
        });
      },

      resetCity: (cityId) => {
        const { progress } = get();
        const next = { ...progress };
        delete next[cityId];
        set({ progress: next });
      },

      getCompletedGames: () => {
        const { progress } = get();
        return Object.keys(progress).filter((c) => progress[c].completedAt);
      },
    }),
    { name: 'escape-game-storage' }
  )
);

export default useEscapeGameStore;
