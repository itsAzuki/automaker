import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/app-store';
import { getHttpApiClient } from '@/lib/http-api-client';

/**
 * Hook that loads project settings from the server when the current project changes.
 * This ensures that settings like board backgrounds are properly restored when
 * switching between projects or restarting the app.
 */
export function useProjectSettingsLoader() {
  const currentProject = useAppStore((state) => state.currentProject);
  const setBoardBackground = useAppStore((state) => state.setBoardBackground);
  const setCardOpacity = useAppStore((state) => state.setCardOpacity);
  const setColumnOpacity = useAppStore((state) => state.setColumnOpacity);
  const setColumnBorderEnabled = useAppStore((state) => state.setColumnBorderEnabled);
  const setCardGlassmorphism = useAppStore((state) => state.setCardGlassmorphism);
  const setCardBorderEnabled = useAppStore((state) => state.setCardBorderEnabled);
  const setCardBorderOpacity = useAppStore((state) => state.setCardBorderOpacity);
  const setHideScrollbar = useAppStore((state) => state.setHideScrollbar);

  const loadingRef = useRef<string | null>(null);

  useEffect(() => {
    if (!currentProject?.path) {
      return;
    }

    // Prevent loading the same project multiple times
    if (loadingRef.current === currentProject.path) {
      return;
    }

    loadingRef.current = currentProject.path;

    const loadProjectSettings = async () => {
      try {
        const httpClient = getHttpApiClient();
        const result = await httpClient.settings.getProject(currentProject.path);

        if (result.success && result.settings?.boardBackground) {
          const bg = result.settings.boardBackground;

          // Update store with loaded settings (without triggering server save)
          setBoardBackground(currentProject.path, bg.imagePath);

          if (bg.cardOpacity !== undefined) {
            setCardOpacity(currentProject.path, bg.cardOpacity);
          }

          if (bg.columnOpacity !== undefined) {
            setColumnOpacity(currentProject.path, bg.columnOpacity);
          }

          if (bg.columnBorderEnabled !== undefined) {
            setColumnBorderEnabled(currentProject.path, bg.columnBorderEnabled);
          }

          if (bg.cardGlassmorphism !== undefined) {
            setCardGlassmorphism(currentProject.path, bg.cardGlassmorphism);
          }

          if (bg.cardBorderEnabled !== undefined) {
            setCardBorderEnabled(currentProject.path, bg.cardBorderEnabled);
          }

          if (bg.cardBorderOpacity !== undefined) {
            setCardBorderOpacity(currentProject.path, bg.cardBorderOpacity);
          }

          if (bg.hideScrollbar !== undefined) {
            setHideScrollbar(currentProject.path, bg.hideScrollbar);
          }
        }
      } catch (error) {
        console.error('Failed to load project settings:', error);
        // Don't show error toast - just log it
      }
    };

    loadProjectSettings();
  }, [
    currentProject?.path,
    setBoardBackground,
    setCardOpacity,
    setColumnOpacity,
    setColumnBorderEnabled,
    setCardGlassmorphism,
    setCardBorderEnabled,
    setCardBorderOpacity,
    setHideScrollbar,
  ]);
}
