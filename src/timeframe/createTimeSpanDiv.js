import { timeframeOption, isLogged } from "../state";
import { elementCreator } from "../utilities/elementCreator";
import { fullFormattedDate, addOneToMonth, recursiveFunc, formatNumDate, returnMonth, getToday, textDateToNum, findRelativeDate, whichWeekOfYear, dispDateStrToObjDate } from "../utilities/dateUtils";
import '/src/timeframe/timespan.css';
import { createSRCal } from "./createTimeframe";
import { createTaskDisplay} from "../taskDisp/createTaskDisp";
import { fillAllCalSquares } from "../singleRowCal/singleRowAll";

export function createTimeSpan(parent){
    const type = timeframeOption.toLocaleLowerCase();
    const div = elementCreator("div", ["class", "ts-main-div"], false, parent);
    const leftArrow = createArrow(div, true);
    const timeSpanDiv = elementCreator("div", ["class", "ts-div"], false, div);
    const rightArrow = createArrow(div);
    arrowEffect([leftArrow, rightArrow]);
    arrowFunc(div, type)
    dateProcess(timeSpanDiv, type);

    return div;
}    



function arrowFunc(div, type){
    const leftArr = div.querySelector(".taskbox-left-div");
    const rightArr = div.querySelector(".taskbox-right-div");
    switch(type){
        case "day": arrowDailyFunc(leftArr,rightArr);break;
        case "week": arrowWeeklyFunc(leftArr, rightArr);break;
        case "month": arrowMonthlyFunc(leftArr, rightArr); break;
        case "all" : arrowAllFunc(leftArr, rightArr);break;
    }
}

function arrowAllFunc(left, right){
    [left,right].forEach(btn=>{btn.addEventListener("click", incrDecrYears)})
    function incrDecrYears(){
        const firstYear = Number(document.querySelector(".sr-year-square").innerText)
        if(this.className.includes("taskbox-left-div")){
            fillAllCalSquares(false, firstYear-7);
        }
        else{
            fillAllCalSquares(false, firstYear+7);
        }
    }
}
function arrowDailyFunc(left, right){
    [left,right].forEach(btn=>{btn.addEventListener("click", incrDecrDay);})
    function incrDecrDay(){
        const text = left.parentElement.querySelector(".day-date-range");
        const date = textDateToNum(text.innerText);
        if(this.className.includes("taskbox-left-div")){
            text.innerText = fullFormattedDate(findRelativeDate(date,-1));
        }
        else{
            text.innerText = fullFormattedDate(findRelativeDate(date,1));
        }
        createSRCal();
        createTaskDisplay()
    }
}
function arrowWeeklyFunc(left,right){
    [left,right].forEach(btn=>{
        btn.addEventListener("click", incrDecrWeek);
    })
    function incrDecrWeek(){
        const text = left.parentElement.querySelector(".week-date-range")
        const date = text.querySelectorAll("p");
        const from = date[0];
        const to = date[1];
        if(this.className.includes("taskbox-right-div")){
            const rDateFrom = addOneToMonth(to.innerText, true);
            from.innerText = formatNumDate(addOneToMonth(findRelativeDate(rDateFrom,1)));
            to.innerText = formatNumDate(addOneToMonth(findRelativeDate(rDateFrom,7)));
        }
        else{
            const rDateTo = addOneToMonth(from.innerText, true);
            to.innerText = formatNumDate(addOneToMonth(findRelativeDate(rDateTo,-1)));
            const rDateFrom = addOneToMonth(to.innerText, true);
            from.innerText = formatNumDate(addOneToMonth(findRelativeDate(rDateFrom,-6)));
        }
        const whichWeekDiv = text.querySelector(".ts-week-text");
        whichWeekDiv.innerText = formatWeekOfYear(from.innerText)

        createSRCal();
        createTaskDisplay()
 
        
    }

}
function arrowMonthlyFunc(left,right){
    [left,right].forEach(btn=>{btn.addEventListener("click", incrDecrMonth);})
    function incrDecrMonth(){
       const text = left.parentElement.querySelector(".month-date-range");
       const dateText = text.innerText.split(" ");
       const date = new Date(`1/${dateText[0]}/${dateText[1]}`);
       this.className.includes("taskbox-right-div")?calc(1, 11, "January"):calc(-1, 0, "December");
        function calc(num, month, str){
            date.getMonth()!==month?text.innerText = 
            `${returnMonth(date.getMonth() + num)} ${date.getFullYear()}`: text.innerText = `${str} ${Number(dateText[1])+num}`;
       }
    createSRCal();
    createTaskDisplay()

    }
}


function dateProcess(parent, type){
    const div = elementCreator("div", ["class", `${type}-date-range`], false, parent);
    if(type==="day"){
        div.innerText = fullFormattedDate(getToday());
    }
    else if(type==="week"){
        const [lText, rText] = formatForWeek();
        const left = elementCreator("p", ["class", "ts-from"], lText, false);
        const right = elementCreator("p", ["class", "ts-to"], rText, false);
        div.appendChild(left); 
        elementCreator("span", ["class", "ts-week-text"], formatWeekOfYear(lText), div)
        div.appendChild(right);
    }
    else if(type==="month"){
        div.innerText = returnMonth(getToday("month")) + " " + getToday("year");
    }
    else if(type==="all"){
      div.innerText= "All tasks"
    }
    return div;

    function formatForWeek(){
       const from = recursiveFunc(getToday(), false);
       const to = recursiveFunc(getToday(), true);
        return [addOneToMonth(formatNumDate(from.split("/"))), addOneToMonth(formatNumDate(to.split("/")))]
    }

}

function formatWeekOfYear(strDate){
    const dateObj = dispDateStrToObjDate(strDate);
    const week = whichWeekOfYear(dateObj);
    return `${week} / 52`
}






//arrow stuff
function createArrow(parent, isLeft){
    const arrow = isLeft?"<":">";
    const arrClass = isLeft?"taskbox-left-div":"taskbox-right-div";
    const arrowDiv = elementCreator("div", ["class", "taskbox-arrow-div", arrClass], false, parent);
    for(let i=0;i<3;i++){elementCreator("p", ["class", `arrow-${arrow}`], arrow, arrowDiv);}
    return arrowDiv
}

function arrowEffect(btns){
    btns.forEach(btn=>{
        btn.addEventListener("mouseover", arrowHover, {once:true});
    
    })

    function arrowHover(e){
        const arrows = this.querySelectorAll("p");
        const arrowDirection = this.childNodes[0].className.split("").pop();
        const isLeft = arrowDirection==="<"?true:false;
        const btn = this;
        let timer = 0; 
        if(isLeft){for(let i=arrows.length-1;i>=0;i--){callTimer(i)}}
        else{for(let i=0;i<arrows.length;i++){callTimer(i)}}
        function callTimer(i){
            timeFunc(timer, arrows[i], i);
            timer+=100; 
        }
        function timeFunc(timer, elem, index){
            setTimeout(()=>{elem.classList.add("taskbox-animate")}, timer);
            setTimeout(()=>{
                elem.classList.remove("taskbox-animate");
                if(index===2){
                    btn.addEventListener("mouseover", arrowHover, {once:true});
              
                }
            }, timer + 300)
        }
    }
}