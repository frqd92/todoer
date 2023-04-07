
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

//groups
export let mainGroupArr = [];
export function modifyGroupsArr(arr){
    mainGroupArr = arr;
}
export function updateGroupsLocal(){
    const groups = JSON.parse(localStorage.getItem("groups"));
    if(groups!==null){
        mainGroupArr=groups;
    }
}
export function addNewGroupLocal(){
    localStorage.setItem("groups", JSON.stringify(mainGroupArr))
}