import '/src/timeframe/timeframe.css'
import { elementCreator } from "../utilities/elementCreator";
import { timeframeChange, timeframeOption, isLogged } from '../state';
import { createTimeSpan } from './createTimeSpanDiv';
import { createWeekCal } from '../singleRowCal/singleRowWeek';
import { createMonthCal } from '../singleRowCal/singleRowMonth';
import { createDayCal } from '../singleRowCal/singleRowDay';
import { createTaskDisplay } from '../taskDisp/createTaskDisp';
import { createAllCal, fillAllCalSquares } from '../singleRowCal/singleRowAll';



export function createTimeframeDiv(bodyParent){
    const timeSpanBtnsDiv = elementCreator("div", ["class", "timespan-div"], false, bodyParent);
    const timeframeDiv = elementCreator("div", ["class", "timeframe-div"], false, bodyParent);
    createTimeSpan(timeSpanBtnsDiv)
    createTimeRange(timeframeDiv, timeSpanBtnsDiv);
    checkPrevChosen();
    createSRCal();
}
export function createSRCal(){
    //clear previous cal
    const calContainer = document.querySelectorAll(".tf-cal-container div");
    if(calContainer.length>0) calContainer.forEach(elem=>{elem.remove()})

    switch(timeframeOption){
        case "Week": createWeekCal(); break;
        case "Month": createMonthCal(); break;
        case "Day": createDayCal(); break;
        case "All": createAllCal();fillAllCalSquares(true); break;
    }
    
}
function createTimeRange(timeframeDiv, timeSpanBtnsDiv){
    const timeRangeDiv = elementCreator("div", ["class", "tf-time-range-div"], false, timeframeDiv);
    const trArray = ["All", "Month", "Week", "Day"];
    trArray.forEach(elem=>{
        const rangeDiv = elementCreator("p", ["class", "tf-range-row", `tf-tr-${elem}`], false, timeRangeDiv);
        elementCreator("p", ["class", "tf-range-p"], elem, rangeDiv);
        elementCreator("span", ["class", "tf-row-arrow"], ">", rangeDiv);
        rangeDiv.addEventListener("click", tfRowChoose);
    })
    const calContainer = elementCreator("div", ["class", "tf-cal-container"], false,timeframeDiv);

    const hideTF = elementCreator("div", ["class", "hide-tf-btn"], false, timeframeDiv);
    const hideArrow = elementCreator("span", ["class","hide-tf-arrow"],false, hideTF)
    hideTF.addEventListener("click", hideShowTF)

        

    
    function tfRowChoose(){
        if(!this.className.includes("tf-chosen-row")){
            // row stuff
            const pElem = this.querySelector(".tf-range-p");
            timeframeChange(pElem.innerText, true);
            document.querySelectorAll(".tf-range-row").forEach(row=>{row.classList.remove("tf-chosen-row")})
            this.classList.add("tf-chosen-row");
            moveArrow();

            //time span upper part stuff
            timeSpanBtnsDiv.childNodes.forEach(child=>child.remove());
            createTimeSpan(timeSpanBtnsDiv)

            //single row cal from button;
            createSRCal();
            createTaskDisplay()

        }
        
    }

    function hideShowTF(){
        if(!hideTF.className.includes("tf-hidden")){
            hideTF.classList.add("tf-hidden");
            calContainer.classList.add("hidden-timeframe")
            timeRangeDiv.classList.add("hidden-timeframe")
            timeframeDiv.classList.add("hidden-tf");
            hideArrow.classList.add("hide-tf-arrow-down");

        }
        else{
            hideTF.classList.remove("tf-hidden");
            timeRangeDiv.classList.remove("hidden-timeframe")
            calContainer.classList.remove("hidden-timeframe")
            timeframeDiv.classList.remove("hidden-tf")
            hideArrow.classList.remove("hide-tf-arrow-down");
        }
    }
    function moveArrow(){
        const currentRow = document.querySelector(`.tf-tr-${timeframeOption}`);
        const rowArrow = currentRow.querySelector(".tf-row-arrow");
        let prevChosen = document.querySelector(".tf-chosen-arrow")

        prevChosen.classList.remove("tf-chosen-arrow");
        setTimeout(()=>{
            rowArrow.classList.add("tf-chosen-arrow");
        }, 200) 
    
    }

}

function checkPrevChosen(){
    const row = document.querySelector(`.tf-tr-${timeframeOption}`);
    row.classList.add("tf-chosen-row")
    const arrow = row.querySelector(".tf-row-arrow");
    arrow.classList.add("tf-chosen-arrow")
    
}

