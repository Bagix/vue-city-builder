import { IBuildingCost, IBuildingField } from './types';

/* eslint-disable import/prefer-default-export */
export function buildingCostString(cost:IBuildingCost): string {
  const costs = Object.entries(cost).map((resource) => `${resource[0]}: ${resource[1]}`);
  return `
    Cost:
    ${costs.toString()}
  `;
}

export function saveFirstbuilding(newBuilding: IBuildingField): void {
  const currentDate = (new Date()).toString();
  window.localStorage.setItem('city', JSON.stringify([newBuilding]));
  window.localStorage.setItem('citySavedTime', currentDate);
}
