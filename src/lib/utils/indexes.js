/* assets */
import townsData from "$lib/assets/municipios.json";

export async function getStateAndTownIndexes(state, town) {
  const indexes = { state: 0, town: 0 };
  indexes.state = Object.keys(townsData).findIndex((x) => x === state);
  if (indexes.state == -1) indexes.state = 0;
  indexes.town = townsData[state].findIndex((x) => x === town);
  if (indexes.town == -1) indexes.town = 0;
  return indexes;
}
export async function getDistroLevelsIndexes(levels, value) {
  let index = 0;
  index = levels.findIndex((x) => x.value === value);
  if (index == -1) index = 0;
  return index;
}

export async function getAccountTypeIndexes(types, value) {
  let index = 0;
  index = types.findIndex((x) => x.value === value);
  if (index == -1) index = 0;
  return index;
}
export async function getBusinessLineIndexes(sics, value) {
  let index = 0;
  index = sics.findIndex((x) => x.value === value);
  if (index == -1) index = 0;
  return index;
}


export function getIndex(array, value) {
  // console.log(value)
  let index = 0;
  index = array.findIndex((x) => x.value === value || x.name === value);
  if (index == -1) index = 0;
  // console.log(index, value, array)
  return index;
}