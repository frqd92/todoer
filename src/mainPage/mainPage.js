import { createHeaderDom } from '../Header/createHeader';
import { isLogged, currentTheme, modifyTheme, changeDocumentTheme } from '../state';
export function createMainPageDom(){
    readData();
    createHeaderDom();
}


function readData(){
    //theme
    if(localStorage.getItem("theme")!==null){
        modifyTheme(localStorage.getItem("theme"))
        changeDocumentTheme(currentTheme)
    }
    else{
        changeDocumentTheme("light-theme")

    }
}