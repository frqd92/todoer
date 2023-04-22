import '/src/singleRowCal/singleRow.css';
import { elementCreator } from '../utilities/elementCreator';
import { addZeroDispDate, checkIfToday, daysInMonth, dispDateStrToObjDate, isPast, removeTime, returnMonth, weekDayFind} from '../utilities/dateUtils';
import { countMonthTasks } from '../taskDisp/calTask';
import { makeAdd } from '../Header/createHeader';


export function createMonthCal(){

    const calContainer = document.querySelector(".tf-cal-container");

    const calDiv = elementCreator("div", ["class", "sr-month-div"], false, calContainer);
    
    createMonthSquares(calDiv);

    
}

function createMonthSquares(parent){
    const weekNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const [mmElem,yyElem] = document.querySelector(".month-date-range").innerText.split(" ");
    const currentMonth = new Date(`${yyElem}/${returnMonth(mmElem) + 1}/1`);
    const daysInCurrentMonth = daysInMonth(currentMonth);
    let currentWeekDay = weekNames.indexOf(weekDayFind(`${yyElem}/${returnMonth(mmElem) + 1}/1`).slice(0,3))

    for(let i=0;i<daysInCurrentMonth;i++){
        const square = MonthSquareFact(i);
    }


    function MonthSquareFact(i){
        const square = elementCreator("div", ["class", "sr-m-square"], false, parent);
        const clDate = addZeroDispDate(`${i+1}/${currentMonth.getMonth()+1}/${yyElem}`)
        square.id = `datecal-${clDate}`;
        const weekNum = elementCreator("div", ["class", "sr-month-num"],i+1 , square);
        const numOfTasksCont = elementCreator("div", ["class", "sr-month-task-cont"], false, square);
        const taskDiv = elementCreator("div", ["class", "sr-task-div", "cal-month-task-hide"], false, square)
        const weekLabel = elementCreator("div", ["class", "sr-month-label-week"],weekNames[currentWeekDay], square);
        const calAddBtn = elementCreator("div", ["class", "sr-cal-add-task"], "+", false);
        if(!isPast(dispDateStrToObjDate(clDate))){
            square.appendChild(calAddBtn )
            calAddBtn.style.display = "none"
            calAddBtn.addEventListener("click", makeAdd)
        }

        currentWeekDay++;
        if(currentWeekDay===7)currentWeekDay=0;
        square.addEventListener("click", openSquareClick);
        square.addEventListener("mouseover", openSquareHover);
        square.addEventListener("mouseleave", closeAllHover);
        if(checkIfToday(dispDateStrToObjDate(clDate))){
            square.classList.add("today-cal-month-square")
        }

        function openSquareHover(){
            square.classList.add("open-cal-square");
            numOfTasksCont.style.display = "none";
            weekLabel.style.display = "none";
            calAddBtn.style.display = "block"
            taskDiv.classList.remove("cal-month-task-hide")
        }
        function openSquareClick(){
            closePrevClick()
            square.classList.add("open-cal-square");
            square.classList.add("clicked-month")
            numOfTasksCont.style.display = "none";
            weekLabel.style.display = "none"
            calAddBtn.style.display = "block"
            taskDiv.classList.remove("cal-month-task-hide")
        }


        function closePrevClick(){
            const prevOpen = document.querySelectorAll(".open-cal-square");
            if(prevOpen.length===0) return
            prevOpen.forEach(elem=>{
                const numTasks = elem.querySelector(".sr-month-task-cont");
                const divTask = elem.querySelector(".sr-task-div")
                elem.classList.remove("open-cal-square");
                elem.classList.remove("clicked-month");
                numTasks.style.display = "block";
                divTask.classList.add("cal-month-task-hide")
                weekLabel.style.display = "block";
                calAddBtn.style.display = "none"

            })

        }

        function closeAllHover(){
            const prevSquares = document.querySelectorAll(".sr-m-square");
            if(prevSquares.length>0){
                prevSquares.forEach(elem=>{
                    if(elem.className.includes("clicked-month")) return;
                    const numTasks = elem.querySelector(".sr-month-task-cont");
                    const divTask = elem.querySelector(".sr-task-div")
                    elem.classList.remove("open-cal-square");
                    numTasks.style.display = "block";
                    divTask.classList.add("cal-month-task-hide")
                    weekLabel.style.display = "block"
                    if(calAddBtn!==null) calAddBtn.style.display = "none";
                })


            }
        }
    }
    countMonthTasks()
}