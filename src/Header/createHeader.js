import { elementCreator } from "../utilities/elementCreator";
import { currentTheme, modifyTheme, changeDocumentTheme } from "../state";
import '/src/header/header.css'
import { searchLoupe, inputBehaviour } from "./searchLogic";
import { createAddModal } from "../taskModal/createModal";
import { createBodyModal } from "../utilities/bodyModal";
import { headerCalFunc } from '/src/Header/headerCal/headerCal.js'; 
import { dateObjToStrDate, formatNumDate } from "../utilities/dateUtils";
export function createHeaderDom(bodyParent){
    const header = elementCreator("header", false, false, bodyParent);
    const title = elementCreator("h1", ["class", "main-title", "title-hide"], "Todoer", header);
    createSearchBar(header);
    const btnDiv = elementCreator("div", ["class", "header-btn-div"], false, header);
    const addBtn = createAddTaskBtn(btnDiv);
    const miniCalBtn = createMiniCal(false, "header");
    btnDiv.appendChild(miniCalBtn);
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

    return div
}
export function makeAdd(taskEditObj){
    const div = elementCreator("div", ["class", "header-add-div"], false, document.body);
    const bgModal= createBodyModal(div);
    bgModal.createDiv();

    if(this===undefined){
        div.appendChild(createAddModal(true, false, taskEditObj)) 
    }
    else if(this.className.includes("sr-cal-add-task")){
        const date = this.parentElement.id.split("-").pop();
        div.appendChild(createAddModal(false, date))     
    }
    else if(this.className.includes("tb-add-task")){
        const date = formatNumDate(dateObjToStrDate(this.btnDate), true) 
        div.appendChild(createAddModal(false, date))     
    }
    else if(this.id.includes("header-add-btn")){
        div.appendChild(createAddModal(false, false))
    }

    
}
// theme, bulb---------------------------------------------------------------------------------------
function createLightBulb(parent){
    const div = elementCreator("div", ["class", "bulb-container", "bulb-on"], false, parent);
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
        console.log("jdkadka");
        if(!this.className.includes("bulb-on")){
            console.log("shart");

            this.classList.add("bulb-on");
            modifyTheme("dark-theme");
            bulbLum.style.display = "block";
        }
        else{
            console.log("fart");
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
        else{
            div.classList.remove("bulb-on");
            bulbLum.style.display = "none";
        }
    }
}

// searchbar---------------------------------------------------------------------------------------
function createSearchBar(parent){
    const searchDiv = elementCreator("div", ["class", "searchbar-div"], false, parent);
    const loupe = createLoupe(searchDiv);
    const input = elementCreator("input", ["id", "header-input"], false, searchDiv);
    const taskMenu = elementCreator("div", ["class", "search-bar-menu"], false, searchDiv)
    searchLoupe(loupe, input);
    inputBehaviour(searchDiv);
}

function createLoupe(parent){
    const outerDiv = elementCreator("div", ["class", "header-loop-div"], false, parent)
    const div = elementCreator("div", ["class", "header-loup"], false, outerDiv);
    elementCreator("div", false, false, div);
    elementCreator("div", false, false, div);
    return outerDiv;

}


export function createMiniCal(dateCal, type){
    const div = elementCreator("div", ["class","mini-cal", `${type}-mini-cal`], false, false);
    const clickDiv = elementCreator("div", ["class", "calender-click-div"], false, div)
    const monthDiv = elementCreator("div", ["class", "header-calender-month"], getDate()[0],div);
    const dayDiv = elementCreator("div", ["class", "header-calender-day"], getDate()[1],div);
    headerCalFunc(div);
    return div

    function getDate(){
        let date;
        if(dateCal) date = String(new Date(dateCal.split("/").reverse().join("/")))
         
        else date = String(new Date());
     
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
