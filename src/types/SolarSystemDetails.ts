export interface Planet {
    name: string;
    distance: number; // Distance du soleil en unités de scène
    size: number; // Taille relative de la planète
    color: string; // Couleur de la planète
    speed: number; // Vitesse orbitale relative
    angle: number; // Angle actuel de la planète
    moons?: number; // Nombre de lunes (optionnel, pour d'autres usages)
    description?: string; // Description (optionnelle)
    type?: 'planet' | 'moon' | 'asteroid' | 'comet' | 'star';
}

export interface MoonDetail {
    name: string;
    size: number;
    dist: number;
    speed: number;
    info: string;
}

export interface PlanetDetails {
    name: string;
    type: 'planet' | 'dwarf' | 'star';
    planetType?: string;
    size: number;
    dist: number;
    speed: number;
    info: string;
    discoveryYear: string;
    composition?: string;
    temperature?: string;
    moons?: MoonDetail[];
}

