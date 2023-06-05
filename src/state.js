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
// 
export let themeChoice = false

export function changeTheme(val){
    themeChoice = val;
    localStorage.setItem("theme-time", val)
}
//----------------------------------------
export let bookmarkArr = [];
export function writeBookmarked(city, bool){
    if(bool){
        bookmarkArr.push(city);
    }
    else{
        bookmarkArr.splice(bookmarkArr.indexOf(city), 1);
    }
    localStorage.setItem("bookmarked-cities", JSON.stringify(bookmarkArr));
}

export function equateBookmark(arr){
    bookmarkArr = JSON.parse(arr)
}

export function readBookmarked(){
    return  JSON.parse(localStorage.getItem("bookmarked-cities"));
}