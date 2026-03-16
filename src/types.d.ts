// Fichier: types.d.ts
declare module "get-image-colors" {
  // On définit l'interface simplifiée d'un objet couleur Chroma.js
  interface ChromaColor {
    hex(): string;
    hsl(): [number, number, number]; // [Hue, Saturation, Lightness]
    rgb(): [number, number, number];
  }

  // La fonction principale
  function getColors(buffer: Buffer, type: string): Promise<ChromaColor[]>;

  export default getColors;
}
