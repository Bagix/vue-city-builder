export interface IBuildingField {
  fieldId: number;
  type: string;
}

export interface IBuildingCost {
  gold: number;
  stones?: number;
  woods?: number;
  workers?: number;
}

export interface IBuildingGenerate {
  gold?: number;
  stones?: number;
  woods?: number;
  workers?: number;
}

export interface IBuilding {
  type: string;
  instantResources?: IBuildingGenerate;
  cost: IBuildingCost;
  generate: IBuildingGenerate;
}

export interface IResources {
  gold: number;
  stones: number;
  woods: number;
  workers: number;
}
