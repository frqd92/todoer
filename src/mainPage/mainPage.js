import { createHeaderDom } from '../Header/createHeader';
import { readUserGroups } from '../firebase';
import { isLogged, currentTheme, modifyTheme, changeDocumentTheme, mainGroupArr,updateGroupsLocal } from '../state';
export function createMainPageDom(){
    readTheme();
    createHeaderDom();
    readGroups();
    document.querySelector(".main-title").addEventListener("click", ()=>{
        console.log(mainGroupArr);
    })

}


function readGroups(){
    //reads user group in firebase and copies its value to mainGroupArr in state if available
    if(isLogged){readUserGroups()}
    //gets local "groups" in state and copies to mainGroupArr in state if available
    else{updateGroupsLocal()}
}
function readTheme(){
    //theme (always local)
    if(localStorage.getItem("theme")!==null){
        modifyTheme(localStorage.getItem("theme"))
        changeDocumentTheme(currentTheme)
    }
    else{
        changeDocumentTheme("light-theme")
    }
}
