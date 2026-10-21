export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x400?text=No+Image';

export const withFallbackImage = (image?: string | null): string => {
  if (typeof image !== 'string') return PLACEHOLDER_IMAGE;
  const cleanImage = image.trim();
  return cleanImage || PLACEHOLDER_IMAGE;
};
