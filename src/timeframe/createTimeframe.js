import '/src/timeframe/timeframe.css'
import { elementCreator } from "../utilities/elementCreator";

export function createTimeframeDiv(){
    const timeframeDiv = elementCreator("div", ["class", "timeframe-div"], false, document.body);
    createTimeRange(timeframeDiv);

}

function createTimeRange(timeframeDiv){
    const timeRangeDiv = elementCreator("div", ["class", "tf-time-range-div"], false, timeframeDiv);
    const trArray = ["All", "Month", "Week", "Day"];
    trArray.forEach(elem=>{
        const rangeDiv = elementCreator("p", ["class", "tf-range-row"], false, timeRangeDiv);
        elementCreator("p", ["class", "tf-range-p"], elem, rangeDiv);
        rangeDiv.addEventListener("click", tfRowFunc)
    })
    const rangeArrow = elementCreator("span", ["class","tf-range-arrow"], ">", timeRangeDiv);
    const calContainer = elementCreator("div", ["class", "tf-cal-container"], false,timeframeDiv);

    function tfRowFunc(){
        const pElem = this.querySelector(".tf-range-p");




        const leftVal = pElem.getBoundingClientRect().left
        const topVal = pElem.getBoundingClientRect().top;
        const elemWidth = getComputedStyle(pElem).width;
        rangeArrow.style.left =`calc(${leftVal}px + ${elemWidth} + 2px)`;
        rangeArrow.style.top = topVal + "px";

    }




    timeframeDiv.addEventListener('click', function init() {
        timeframeDiv.removeEventListener('click', init, false);
        timeframeDiv.className = timeframeDiv.className + ' resizable';
        var resizer = document.createElement('div');
        resizer.className = 'resizer';
        timeframeDiv.appendChild(resizer);
        resizer.addEventListener('mousedown', initDrag, false);
    }, false);
    
    var startX, startY, startWidth, startHeight;
    
    function initDrag(e) {
       startX = e.clientX;
       startY = e.clientY;
       startWidth = parseInt(document.defaultView.getComputedStyle(p).width, 10);
       startHeight = parseInt(document.defaultView.getComputedStyle(p).height, 10);
       document.documentElement.addEventListener('mousemove', doDrag, false);
       document.documentElement.addEventListener('mouseup', stopDrag, false);
    }
    
    function doDrag(e) {
       timeframeDiv.style.width = (startWidth + e.clientX - startX) + 'px';
       timeframeDiv.style.height = (startHeight + e.clientY - startY) + 'px';
    }
    
    function stopDrag(e) {
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
    }
    







}


