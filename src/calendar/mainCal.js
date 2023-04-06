import "/src/calendar/mainCal.css";
import { elementCreator } from "../utilities/elementCreator";
import { createSmartInput } from "./smartInput/smartInput";
import { createQuickBtns } from "./quickBtns/quickBtns";
import { getMonthAndYear, returnMonth } from "../utilities/dateUtils";
export function CreateMainCal(type, outputBtn, smartInputBool, quickBtnBool){
    const mainCalDiv = elementCreator("div", ["class", "main-cal", `main-cal-${type}`], false, false)
    if(smartInputBool){smartInput(mainCalDiv, outputBtn)};
    if(quickBtnBool){quickBtns(mainCalDiv, outputBtn)};
    createCal(mainCalDiv, outputBtn);
    return mainCalDiv;
}
//creates the actual calendar----------------------------------------------------------------------
function createCal(parent, output){
    const mainCalDiv = elementCreator("div", ["class", "adder-cal-main-div"], false, parent);
    calTop(mainCalDiv);
    CalFactory(mainCalDiv, getMonthAndYear());
}

//the calendar------------------------------------------------------------------
function CalFactory(calParent, mmYY){
    console.log(mmYY);
    const calDiv = elementCreator("div", ["class", "adder-cal-div"], false, calParent);
    const weekArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    //week days text
    for(let i=0;i<7;i++){
        elementCreator("div", ["class", `adder-cal-weekdays`], weekArr[i], calDiv);
    }
    //the month squares
    // const [firstDayMonth, lastDayMonth] = firstLastDay(date);
    for(let i=0;i<42;i++){
        const square = elementCreator("div", ["class", "cal-square"], false, calDiv);

    }
}




//top part with arrows------------------------------------------------------------------
function calTop(calParent){
    const calTopPart = elementCreator("div", ["class", "cal-top"], false, calParent)
    const content = ["<<", "<", false, ">", ">>"];
    content.forEach((elem, i)=>{
        if(i==2){
            const textDiv = elementCreator("div", ["class", "cal-date-text-div"], false, calTopPart)
            const textPart = elementCreator("div", ["class", "cal-date-text"], getMonthAndYear(), textDiv)
            const rotateDiv = elementCreator("div", ["class", "cal-og-date-btn-div"], false, textDiv);
            const ogDateBtn = elementCreator("div", ["class", "cal-og-date-btn"], "↺", rotateDiv);
            ogDateBtn.addEventListener("click", backToOGDate);
            ogDateBtn.style.display="none";
        }
        else{
            const arrow = elementCreator("div", ["class", "cal-arrow"], elem, calTopPart);
            arrow.addEventListener("click", changeTopDateAndCal);
        };
    })
}
function changeTopDateAndCal(){
    const textPart = this.parentElement.querySelector(".cal-date-text");
    const ogBtn = this.parentElement.querySelector(".cal-og-date-btn");
    const btnID = ["<<", "<", ">", ">>"];
    const changeDateBy = [-12,-1,1,12];
    const clickAction = changeDateBy[btnID.indexOf(this.innerText)];
    textPart.innerText = monthTraversal(textPart, clickAction);
    ogBtn.style.display = getMonthAndYear()===textPart.innerText?"none":"block";
  
    //deletes old cal and creates new one from the new month or year change
    const adderCalDiv = this.parentElement.parentElement.querySelector(".adder-cal-div");
    adderCalDiv.remove()
    const newCal = CalFactory(this.parentElement.parentElement,textPart.innerText);
}




function backToOGDate(e){
    const textPart = this.parentElement.parentElement.querySelector(".cal-date-text");
    textPart.innerText = getMonthAndYear();
    this.style.display="none";

    //deletes old cal and creates new one from the new month or year change
    const calDiv = this.parentElement.parentElement.parentElement.parentElement;
    const adderCalDiv = calDiv.querySelector(".adder-cal-div");
    adderCalDiv.remove()
    const newCal = CalFactory(calDiv, textPart.innerText);
    e.stopPropagation();
}

function monthTraversal(textDate, num){
    let [mm, yy] = textDate.innerText.split(" ");
    mm = returnMonth(mm);
    const date = new Date(`${yy}/${mm+1}/1`);
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth()+num);

    return returnMonth(nextDate.getMonth()) + " " + nextDate.getFullYear()
}





//------------------------------------------------------------------------------------------------
//attaches smart input and quick btns if parameter is true-----------------------------------------
function smartInput(parent, output){
    const inputDiv = createSmartInput(output);
    parent.appendChild(inputDiv);
}
function quickBtns(parent, output){
    const quickBtnsDiv = createQuickBtns(parent, output);
    parent.appendChild(quickBtnsDiv);
}