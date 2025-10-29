import * as THREE from 'three';

// Liste de toutes les textures à précharger (priorité aux plus visibles)
const TEXTURE_PATHS = [
  // Nébuleuse (priorité haute - visible immédiatement)
  '/textures/nebula.jpg',
  // Soleil (priorité haute - centre de la scène)
  '/textures/sun.jpg',
  // Planètes principales (priorité haute)
  '/textures/planets/earth.jpg',
  '/textures/planets/mars.jpg',
  '/textures/planets/jupiter.jpg',
  '/textures/planets/saturn.jpg',
  '/textures/planets/saturn-ring.jpg',
  // Planètes secondaires
  '/textures/planets/mercury.jpg',
  '/textures/planets/venus.jpg',
  '/textures/planets/uranus.jpg',
  '/textures/planets/neptune.jpg',
  '/textures/planets/pluton.jpg',
  // Lunes principales (les plus visibles - chargées après les planètes)
  '/textures/moons/moon.jpg',
  '/textures/moons/io.jpg',
  '/textures/moons/europa.jpg',
  '/textures/moons/ganymede.jpg',
  '/textures/moons/callisto.jpg',
  '/textures/moons/titan.jpg',
];

// Cache global pour les textures préchargées
const textureCache = new Map<string, THREE.Texture>();

// Textures critiques (nébuleuse et soleil) - doivent être chargées en premier
const CRITICAL_TEXTURES = [
  '/textures/nebula.jpg',
  '/textures/sun.jpg',
];

/**
 * Précharge les textures critiques (nébuleuse, soleil) pour affichage immédiat
 * @returns Promise qui se résout quand les textures critiques sont chargées
 */
export const preloadCriticalTextures = (): Promise<void> => {
  return new Promise((resolve) => {
    const loader = new THREE.TextureLoader();
    let loadedCount = 0;
    let errorCount = 0;

    const checkCriticalComplete = () => {
      if (loadedCount + errorCount >= CRITICAL_TEXTURES.length) {
        console.log(`✅ Textures critiques préchargées: ${loadedCount}/${CRITICAL_TEXTURES.length}`);
        resolve();
      }
    };

    CRITICAL_TEXTURES.forEach((path) => {
      loader.load(
        path,
        (texture) => {
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          
          textureCache.set(path, texture);
          loadedCount++;
          checkCriticalComplete();
        },
        undefined,
        () => {
          console.warn(`⚠️ Texture critique non chargée: ${path}`);
          errorCount++;
          checkCriticalComplete();
        }
      );
    });
  });
};

/**
 * Précharge toutes les textures en parallèle (avec gestion de priorité)
 * @returns Promise qui se résout quand toutes les textures sont chargées
 */
export const preloadTextures = (): Promise<void> => {
  return new Promise((resolve) => {
    const loader = new THREE.TextureLoader();
    let loadedCount = 0;
    let errorCount = 0;
    const totalTextures = TEXTURE_PATHS.length;

    // Gérer les erreurs silencieusement pour ne pas bloquer le chargement
    const onError = (path: string) => {
      console.warn(`⚠️ Texture non chargée: ${path}`);
      errorCount++;
      checkComplete();
    };

    const checkComplete = () => {
      if (loadedCount + errorCount >= totalTextures) {
        console.log(`✅ Textures préchargées: ${loadedCount}/${totalTextures}`);
        resolve();
      }
    };

    // Charger toutes les textures en parallèle
    // Les textures critiques (nébuleuse, soleil) se chargeront en premier
    TEXTURE_PATHS.forEach((path) => {
      // Ignorer les textures critiques déjà chargées
      if (textureCache.has(path)) {
        loadedCount++;
        checkComplete();
        return;
      }

      loader.load(
        path,
        (texture) => {
          // Optimiser les textures pour de meilleures performances
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          
          textureCache.set(path, texture);
          loadedCount++;
          checkComplete();
        },
        undefined,
        () => onError(path)
      );
    });
  });
};

/**
 * Récupère une texture du cache ou la charge si elle n'est pas dans le cache
 * @param path Chemin de la texture
 * @returns Texture ou null
 */
export const getTexture = (path: string): THREE.Texture | null => {
  return textureCache.get(path) || null;
};

/**
 * Supprime toutes les textures du cache (utile pour le cleanup)
 */
export const clearTextureCache = (): void => {
  textureCache.forEach((texture) => {
    texture.dispose();
  });
  textureCache.clear();
};

