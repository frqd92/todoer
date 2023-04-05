
//is user logged in
export let isLogged = false;
export function isLoggedModify(bool){
    isLogged = bool;
}

//theme
export let currentTheme = "light-theme";
export function modifyTheme(val){
    currentTheme = val;
}
export function changeDocumentTheme(val){
    document.documentElement.className = val;
}


