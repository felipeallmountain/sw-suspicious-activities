type TSwConnection = {
  id: string;
  relationship: string;
  strength: number;
}

type TSwEntity = {
  id: string;
  type: 'Character' | 'Location' | 'Object';
  name: string;
  description: string; // Summary of the entity and its relationships
  position: {
    distance: number; // Distance from center (0-1, where 0 is center and 1 is outermost ring)
    angle: number; // Angle in degrees (0-120 for each type section)
  };
  details: {
    [key: string]: string;
  };
  connections: TSwConnection[];
}

type TSwTypeSection = {
  id: string;
  type: 'Character' | 'Location' | 'Object';
  entities: TSwEntity[];
}
