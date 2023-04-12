import { elementCreator } from "../utilities/elementCreator";
import { currentTheme, modifyTheme, changeDocumentTheme } from "../state";
import '/src/header/header.css'
import { searchLoupe, inputBehaviour } from "./searchLogic";
import { createAddModal } from "../taskModal/createModal";
import { createBodyModal } from "../utilities/bodyModal";
export function createHeaderDom(){
    const header = elementCreator("header", false, false, document.body);
    const title = elementCreator("h1", ["class", "main-title", "title-hide"], "Todoer", header);
    createSearchBar(header);
    const btnDiv = elementCreator("div", ["class", "header-btn-div"], false, header);
    const addBtn = createAddTaskBtn(btnDiv);
    const miniCalBtn = createMiniCal(btnDiv);
    const lightBulb = createLightBulb(btnDiv);
    titleEffect(title)

    //for testing
    title.addEventListener("click", ()=>{
        console.log(currentTheme);
    })
}

// add btn---------------------------------------------------------------------------------------

function createAddTaskBtn(parent){
    const div = elementCreator("div", ["id", "header-add-btn"], false, parent);
    elementCreator("p", false, "+", div);

    div.addEventListener("click", makeAdd);
    function makeAdd(){
        const div = elementCreator("div", ["class", "header-add-div"], false, document.body);
        const bgModal= createBodyModal(div);
        bgModal.createDiv();

        div.appendChild(createAddModal())
    }
    return div
}

// theme, bulb---------------------------------------------------------------------------------------
function createLightBulb(parent){
    const div = elementCreator("div", ["class", "bulb-container"], false, parent);
    const top = elementCreator("div", ["class", "bulb-top"], false, div);
    const thatShinyThing = elementCreator("div", ["class", "bulb-shiny-thing"], false, div);
    const middle = elementCreator("div", ["class", "bulb-middle"], false, div);
    const bottom = elementCreator("div", ["class", "bulb-bottom"], false, div);
    const bulbLum = elementCreator("div", ["class", "bulb-luminosity"], false, div)
    for(let i=0;i<3;i++){
        elementCreator("div", false, false, bottom)
    }
    checkTheme()
    div.addEventListener("click", bulbLogic);
    return div;
    function bulbLogic(){
        if(!this.className.includes("bulb-on")){
            this.classList.add("bulb-on");
            modifyTheme("dark-theme");
            bulbLum.style.display = "block";
        }
        else{
            this.classList.remove("bulb-on");
            modifyTheme("light-theme");
            bulbLum.style.display = "none";
        }
        localStorage.setItem("theme", currentTheme)
        changeDocumentTheme(currentTheme)
    }
    function checkTheme(){
        if(currentTheme==="dark-theme"){
            div.classList.add("bulb-on");
            bulbLum.style.display = "block";
        }
    }
}

// searchbar---------------------------------------------------------------------------------------
function createSearchBar(parent){
    const searchDiv = elementCreator("div", ["class", "searchbar-div"], false, parent);
    const loupe = createLoupe(searchDiv);
    const input = elementCreator("input", ["id", "header-input"], false, searchDiv);
    searchLoupe(loupe, input);
    inputBehaviour(input);
}

function createLoupe(parent){
    const outerDiv = elementCreator("div", ["class", "header-loop-div"], false, parent)
    const div = elementCreator("div", ["class", "header-loup"], false, outerDiv);
    elementCreator("div", false, false, div);
    elementCreator("div", false, false, div);
    return outerDiv;

}


function createMiniCal(parent){
    const div = elementCreator("div", ["class", "header-calender-div"], false, parent);
    const clickDiv = elementCreator("div", ["class", "calender-click-div"], false, div)
    const monthDiv = elementCreator("div", ["class", "header-calender-month"], getDate()[0],div);
    const dayDiv = elementCreator("div", ["class", "header-calender-day"], getDate()[1],div);

    return div

    function getDate(){
        const date = String(new Date());
        return [date.split(" ")[1], date.split(" ")[2]]
    }
}
function titleEffect(title){
    const titleStyle = getComputedStyle(title);
    const loginTitle = document.querySelector(".main-title-login");
    loginTitle.style.width = titleStyle.width;
    loginTitle.style.height = titleStyle.height;
    loginTitle.style.fontSize = titleStyle.fontSize;
    loginTitle.style.letterSpacing = titleStyle.letterSpacing;
    loginTitle.style.top = title.getBoundingClientRect().top + "px";
    loginTitle.style.left = title.getBoundingClientRect().left + "px";
    setTimeout(()=>{
        loginTitle.remove();
        title.classList.remove("title-hide")
    }, 200)

}
