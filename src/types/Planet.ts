export interface Planet {
    name: string;
    distance: number; // Distance du soleil en unités astronomiques
    size: number; // Taille relative de la planète
    color: string; // Couleur de la planète
    speed: number; // Vitesse de rotation autour du soleil
    angle: number; // Angle actuel de la planète
    moons?: number; // Nombre de lunes 
    description?: string; // Description de la planète
    type?: 'planet' | 'moon' | 'asteroid' | 'comet' | 'star'; // Type d'objet céleste
}