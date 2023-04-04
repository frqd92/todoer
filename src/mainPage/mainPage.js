import { createHeaderDom } from '../Header/createHeader';
import { isLogged, currentTheme, modifyTheme } from '../state';
export function createMainPageDom(){
    readData();
    createHeaderDom();
}


function readData(){
    //theme
    if(localStorage.getItem("theme")!==null){modifyTheme(localStorage.getItem("theme"))};
}