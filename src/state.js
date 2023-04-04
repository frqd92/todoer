
//is user logged in
export let isLogged = false;
export function isLoggedModify(bool){
    isLogged = bool;
}

//theme
export let currentTheme = "light";
export function modifyTheme(val){
    currentTheme = val;
}


