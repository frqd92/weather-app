import { globalUnit, changeGlobalUnit } from "./state";

export function unitPick(){
    checkLocalStorageForUnit();
    const unitBtns = document.querySelectorAll(".unit-choice")
    unitBtns.forEach(btn=>btn.addEventListener("click", chooseUnitClick))
}

function checkLocalStorageForUnit(){
    const localUnit = localStorage.getItem("unit");
    const value = localUnit?localUnit:"celsius";
    localStorage.setItem("unit", value)
    applyChosenUnit(value);
}

function chooseUnitClick(){
    const unitChoice = this.className.includes("celsius")?"celsius":"fahrenheit";
    changeGlobalUnit(unitChoice);
    localStorage.setItem("unit", unitChoice);
    applyChosenUnit(unitChoice);
}

function applyChosenUnit(unit){
    const unitBtns = document.querySelectorAll(".unit-choice");
    unitBtns.forEach(btn=>btn.classList.remove("chosen-unit"));
    const chosenBtn = unit==="celsius"?unitBtns[0]:unitBtns[1];
    chosenBtn.classList.add("chosen-unit")
    
}