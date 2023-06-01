export let globalUnit;
export function changeGlobalUnit(unit){
    globalUnit = unit;
}
//----------------------------------------

export let cityChoice;

export function changeCityChoice(choice){
    cityChoice=choice;
    localStorage.setItem("city-choice", choice )
}