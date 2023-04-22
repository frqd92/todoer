import '/src/singleRowCal/singleRow.css';
import { elementCreator } from '../utilities/elementCreator';
import { addZeroDispDate, daysInMonth, returnMonth, weekDayFind} from '../utilities/dateUtils';
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
        const calAddBtn = elementCreator("div", ["class", "sr-cal-add-task", "sr-cal-add-task-hide"], "+", square);
        calAddBtn.addEventListener("click", makeAdd)
        
        currentWeekDay++;
        if(currentWeekDay===7)currentWeekDay=0;
        //square.addEventListener("mouseover", showTaskDivHover, {once:true});
        square.addEventListener("click", openSquare);


        function openSquare(){
            closeAll()
            square.classList.add("open-cal-square");
            numOfTasksCont.style.display = "none";
            taskDiv.classList.remove("cal-month-task-hide")
        }

        function closeSquare(sqr){
            const numTasks = sqr.querySelector(".sr-month-task-cont");
            const divTask = sqr.querySelector(".sr-task-div")
            sqr.classList.remove("open-cal-square");
            numTasks.style.display = "block";
            divTask.classList.add("cal-month-task-hide")
        }
        function closeAll(){
            const prevOpen = document.querySelector(".open-cal-square");
            console.log(prevOpen);
            if(prevOpen!==null){
                closeSquare(prevOpen)
            }
        }
    }
    countMonthTasks()
}