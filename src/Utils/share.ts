import { IBuildingCost } from './types';

/* eslint-disable import/prefer-default-export */
export function buildingCostString(cost:IBuildingCost): string {
  const costs = Object.entries(cost).map((resource) => `${resource[0]}: ${resource[1]}`);
  return `
    Cost:
    ${costs.toString()}
  `;
}
