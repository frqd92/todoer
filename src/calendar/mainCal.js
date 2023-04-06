import "/src/calendar/mainCal.css";
import { elementCreator } from "../utilities/elementCreator";
import { createSmartInput } from "./smartInput/smartInput";
import { createQuickBtns } from "./quickBtns/quickBtns";
import { getMonthAndYear, returnMonth, detectFirstDayMonth, daysInMonth, removeTime, getToday, addZero} from "../utilities/dateUtils";
import { closeMenuOutside } from "../taskModal/createModal";
const weekArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
    calTop(mainCalDiv, output);
    CalFactory(mainCalDiv, getMonthAndYear(), output);
}

//the calendar------------------------------------------------------------------
function CalFactory(calParent, mmYY, output){
    const calDiv = elementCreator("div", ["class", "adder-cal-div"], false, calParent);
    const [firstWeekDay, daysInMonth, daysInPrevMonth] = getCalInfo(mmYY);
    let [currM, currY] = mmYY.split(" ");
    currM = returnMonth(currM)+1;
    //week days text
    for(let i=0;i<7;i++){
        elementCreator("div", ["class", `adder-cal-weekdays`], weekArr[i], calDiv);
    }
    //the month squares
    let currentMonthDays = 1, prevMonthStart=daysInPrevMonth-(firstWeekDay-1), nextMonthDays=1;
    for(let i=0;i<42;i++){
        const square = elementCreator("div", ["class", "cal-square"], false, calDiv);
        const squareSpan = elementCreator("span", false, false, square);

        //prev month days
        if(i<firstWeekDay){
            squareSpan.innerText=prevMonthStart;
            prevMonthStart++;
            square.classList.add("prev-month-square");
        }
        //current month days
        if(i>=firstWeekDay && i<(daysInMonth+firstWeekDay)){
            squareSpan.innerText = currentMonthDays;
            currentMonthDays++;
        }
        //next month days
        if(i>=daysInMonth+firstWeekDay){
            squareSpan.innerText=nextMonthDays;
            nextMonthDays++;
            square.classList.add("next-month-square");
        }
        //check if date has passed and adds a class for validity
        switch(isMonthPassed(mmYY)){
            case true: 
            square.classList.add("square-invalid");
            break;
            case false:
                square.classList.add(`valid-square-${currM}-${currY}`);
            break;
            case null: //current month
            if(square.className.includes("prev-month-square")){
                square.classList.add("square-invalid");
            }
            else if(square.className.includes("next-month-square")){
                square.classList.add(`valid-square-${currM}-${currY}`);
            }
            else{
                if(isDayPast(square, mmYY)) square.classList.add("square-invalid");
                else {
                    square.classList.add(`valid-square-${currM}-${currY}`);
                }
                
            }
            if(getToday("day")===(currentMonthDays-1)){
                square.classList.add("cal-today-square");
            }
        }
        if(square.className.includes("valid-square")){
            square.addEventListener("click", calDateToOutputBtn)
        }
    }
    function calDateToOutputBtn(){
        console.log(renderCalDate(this));
        closeMenuOutside(this.parentElement.parentElement.parentElement.parentElement)
    }
    

}



function renderCalDate(calSquare){
    let classElements = [...calSquare.classList].filter(elem=>elem.includes("valid"));
    const squareDay = calSquare.querySelector("span").innerText
    let [mm, yy] = classElements.join().split("-").slice(2)
    mm = Number(mm); yy = Number(yy);
    if(calSquare.className.includes("prev")){
        mm--;
        if(mm===0){
            mm=12
            yy--;
        }
    };
    if(calSquare.className.includes("next")){
        mm++;
        if(mm===13){
            mm=1
            yy++;
        }
    };
    return `${addZero(squareDay)}/${addZero(mm)}/${yy}`
}
function isDayPast(square, mmYY){
    const [mm, yy] = mmYY.split(" ");
    const day = Number(square.querySelector("span").innerText) 
    const squareDate = new Date(`${yy}/${returnMonth(mm)+1}/${day}`)

    const todayDay = removeTime(new Date());

    if(squareDate<todayDay) return true;
    else if(squareDate>=todayDay) return false;



}
function isMonthPassed(mmYY){
    const [mm,yy] = mmYY.split(" ");
    const date = new Date();
    date.setDate(1);
    const noTimeDate = removeTime(date);
    const otherDate = new Date(`${yy}/${returnMonth(mm)+1}/${1}`);
    if(otherDate<noTimeDate )return true
    else if(otherDate>noTimeDate ) return false
    else return null;
}






//gets the necessary data to generate a cal with prev and next month leftover days
function getCalInfo(date){
    let [mm,yy] = date.split(" ");
    const currentDate = new Date(`${yy}/${returnMonth(mm)+1}/${1}`);
    //calculates which weekday (0-6) the 1st of the current month is
    let firstWeekDay = detectFirstDayMonth(date.split(" ")).split("").slice(0,3).join("");
    firstWeekDay = weekArr.indexOf(firstWeekDay);
    //how many days are in current month
    let daysOfMonth = daysInMonth(currentDate);

    //prev month has how many days
    let prevMonthDate = new Date(currentDate);
    prevMonthDate.setMonth(prevMonthDate.getMonth()-1);
    return [firstWeekDay, daysOfMonth, daysInMonth(prevMonthDate)];
}


//top part with arrows------------------------------------------------------------------
function calTop(calParent, output){
    const calTopPart = elementCreator("div", ["class", "cal-top"], false, calParent);
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
        adderCalDiv.remove();
        const newCal = CalFactory(this.parentElement.parentElement,textPart.innerText, output);
    }
    
    function backToOGDate(e){
        const textPart = this.parentElement.parentElement.querySelector(".cal-date-text");
        textPart.innerText = getMonthAndYear();
        this.style.display="none";
    
        //deletes old cal and creates new one from the new month or year change same as above you ya lazy cunt
        const calDiv = this.parentElement.parentElement.parentElement.parentElement;
        const adderCalDiv = calDiv.querySelector(".adder-cal-div");
        adderCalDiv.remove()
        const newCal = CalFactory(calDiv, textPart.innerText, output);
        e.stopPropagation();
    }
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