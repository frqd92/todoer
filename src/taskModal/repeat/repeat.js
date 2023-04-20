import { CreateMainCal } from "../../calendar/mainCal";
import { addSuffix, getCurrentDateText, getToday, weekDayFind, whichWeekDayOfMonth } from "../../utilities/dateUtils";
import { elementCreator } from "../../utilities/elementCreator";
import { inputOnlyNum } from "../../utilities/inputUtils";
import { closeMenuOutside } from "../createModal";
import '/src/taskModal/repeat/repeat.css'
export function createModalRepeat(parentBtn){
    const repeatDiv = elementCreator("div", ["class", "add-repeat-menu"], false, parentBtn);

    createTimeTab(repeatDiv);
    createRepeatFactor(repeatDiv);
    createEffective(repeatDiv, parentBtn);
    return repeatDiv;
}



function createEffective(parent, outputBtn){
    const mainDiv = elementCreator("div", ["class", "repeat-effective-div"], false, parent);
    const left = elementCreator("div", ["class", "effective-left"], "Effective:", mainDiv);
    const right = elementCreator("div", ["class", "effective-right"], false, mainDiv);
    const dropBtn = elementCreator("div", ["class", "effective-btn"], false, right);
    const btnText = elementCreator("p", ["class", "effective-btn-text"], "forever", dropBtn);
    const arrow = elementCreator("span", ["class", "effective-btn-arrow"], "<", dropBtn);

    const dropMenu = elementCreator("div", ["class", "effective-drop-menu", "effective-menu-hide"], false, right);
    
    const arr = ["forever", "until", "x times"];
    for(let i=0;i<3;i++){
        const menuRow = elementCreator("div", ["class", "effective-menu-row"], arr[i], dropMenu);
        menuRow.addEventListener("click", menuRowFunc);
    };
    const xTimesDiv = createXTimes(dropMenu)

    createSave()
    
    function createSave(){
        const btnDiv = elementCreator("div", ["class", "repeat-save-div"], false, parent);
        const saveBtn = elementCreator("div", ["class", "repeat-save-btn"], "Save", btnDiv);
        const noRepeatBtn = elementCreator("div", ["class", "no-repeat-btn"], "No repeat", btnDiv);
        noRepeatBtn.addEventListener("click", noRepeatFunc);
        saveBtn.addEventListener("click", saveRepeatOptions);

    }

    function saveRepeatOptions(){
        const repeatData = readRepeatData()
        if(repeatData!==undefined){
            outputBtn.innerText = repeatData;
            const repeatMenu = this.closest(".add-menu-repeat");
            closeMenuOutside(repeatMenu);
            if(isOverflown(outputBtn)) outputBtn.classList.add("repeat-overflown")
            else outputBtn.classList.remove("repeat-overflown")
        }

        function isOverflown(element){//thank you stackoverflow
            return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
          }

    }
    function readRepeatData(){
        let repeatData = "";
        const menu = parent.parentElement;
        const repeatEveryDiv = menu.querySelectorAll(".repeat-every-div > *");
        repeatEveryDiv.forEach((elem, i)=>{
            if(i!==1){repeatData+= " " + elem.innerText}
            else {repeatData+= " " + elem.value};
        })
        repeatData+= " ";
        const repeatWeek = menu.querySelector(".show-hidden-week");
        const repeatMonth = menu.querySelector(".show-hidden-month");
        if(repeatWeek!==null){
            const checks = repeatWeek.querySelectorAll(".repeat-checkbox-checked");
            if(checks.length<1){
                repeatWeek.classList.add("repeat-week-invalid")
                setTimeout(()=>{repeatWeek.classList.remove("repeat-week-invalid")}, 1000);
                return
            };
            repeatData+="on ";
            const weekArr = [];
            checks.forEach(check=>{
                const checkbox = check.querySelector("p").innerText.toLowerCase();
                weekArr.push(checkbox);
            })
            for(let i=0;i<weekArr.length;i++){
                if(weekArr.length===1){
                    repeatData+=weekArr[i];
                }
                else if(weekArr.length===2){
                    if(i===1) repeatData+= " and " + weekArr[i];
                    else repeatData+=weekArr[i];
                }
                else{
                    if(i===0) repeatData+= weekArr[i];
                    else if(i!==weekArr.length-1) repeatData+= ", " + weekArr[i];
                    else repeatData +=  " and " + weekArr[i];
                }
            }
            repeatData+=" ";
        }
        else if(repeatMonth!==null){
            const [leftOption, rightOption] = repeatMonth.childNodes;
            repeatData+="on ";
            if(leftOption.className.includes("chosen")){
                repeatData += leftOption.innerText + " day ";
            }
            else{ 
                repeatData += rightOption.innerText + " ";
            }
        }
        const effectiveBtnText = menu.querySelector(".effective-btn-text").innerText;
        repeatData += effectiveBtnText

        return repeatData.split(" ").slice(3).join(" ");
    }

    function noRepeatFunc(){
        outputBtn.innerText="No repeat";
        outputBtn.classList.remove("repeat-overflown")
        const repeatMenu = this.closest(".add-menu-repeat");
        closeMenuOutside(repeatMenu)
    }

    function createXTimes(timesRow){
        const xTimesDiv = elementCreator("div", ["class", "repeat-x-div"], false, timesRow);
        const input = elementCreator("input", false, "1-999", xTimesDiv, false, true);
        input.addEventListener("input", (e)=>{inputOnlyNum(e, input, [1,999])});
        const enterBtn = elementCreator("div", ["class","x-times-btn"], "Enter", xTimesDiv);
        input.addEventListener("keypress", enterXValueKey);
        enterBtn.addEventListener("click", enterXValue);
        return xTimesDiv;
    
        function enterXValueKey(e){if(e.key==="Enter"){enterXValue()}}
        function enterXValue(){
            if(input.value.length<1) return
            btnText.innerText = input.value + " times"; 
            input.value="";
            xTimesDiv.classList.remove("repeat-x-show");
            closeMenu()
        }
    }
    function menuRowFunc(){
        rmvClass()
        switch(this.innerText){
            case "forever":
                btnText.innerText="forever";
                closeMenu()
                break;
            case "until":
                const untilCal = CreateMainCal("until", btnText, true, false);
                if(right.querySelector(".main-cal-until")===null){
                    right.appendChild(untilCal);
                }
                this.classList.add("chosen-rep-row");
                xTimesDiv.classList.remove("repeat-x-show");
                break;
            case "x times":
                removeCal()
                this.classList.add("chosen-rep-row");
                xTimesDiv.classList.add("repeat-x-show");


        }
    }

    function rmvClass(){
        dropMenu.childNodes.forEach(row=>{row.classList.remove("chosen-rep-row")});
    }
    function removeCal(){
        if(right.querySelector(".main-cal-until")!==null){
            right.querySelector(".main-cal-until").remove();
        }
    }
    dropBtn.addEventListener("click", effectiveDropFunc);

    function effectiveDropFunc(){!this.className.includes("effective-clicked")?openMenu():closeMenu()};
    
    function openMenu(){
        dropBtn.classList.add("effective-clicked");
        dropMenu.classList.remove("effective-menu-hide");
        arrow.classList.add("effective-arrow-on");
        window.addEventListener("click", closeMenuOutsideClick);
    }

    function closeMenu(){
        dropBtn.classList.remove("effective-clicked");
        dropMenu.classList.add("effective-menu-hide");
        arrow.classList.remove("effective-arrow-on");
        window.removeEventListener("click", closeMenuOutsideClick);
        removeCal()
        rmvClass()
        xTimesDiv.classList.remove("repeat-x-show");

    }
    function closeMenuOutsideClick(e){
        if(!e.target.closest(".effective-right")) closeMenu();
    };
    
}


export function closeMenuFromCal(dropBtn, dropMenu, arrow){
    dropBtn.classList.remove("effective-clicked");
    dropMenu.classList.add("effective-menu-hide");
    arrow.classList.remove("effective-arrow-on");
    const untilBtn = dropMenu.querySelectorAll("div")[1];
    untilBtn.classList.remove("chosen-rep-row")
}



function createTimeTab(parent){
    const timeTabDiv = elementCreator("div", ["class", "repeat-tab-div"], false, parent);
    const arr = ["Day", "Week", "Month", "Year"];
    for(let i=0;i<4;i++){
        const tabBtn = elementCreator("div", ["class", "repeat-tab"], arr[i], timeTabDiv);
        if(i===0) tabBtn.classList.add("selected-repeat-tab");
        tabBtn.addEventListener("click", tabClickFunc);
    }
}

function createRepeatFactor(parent){
    const mainDiv = elementCreator("div", ["class", "repeat-factor-div"], false, parent);

    const repeatEveryDiv = elementCreator("div", ["class", "repeat-every-div"], false, mainDiv);
    elementCreator("span", false, "Repeat every", repeatEveryDiv);
    const everyInput = elementCreator("input", ["class", "every-input"], "1", repeatEveryDiv);
    const everyText = elementCreator("span", ["class", "every-type-text"], "day", repeatEveryDiv);
    everyInput.addEventListener("input", repeatInputFunc);
    everyInput.addEventListener("focusout", ()=>{
        if(everyInput.value.length===0){
            everyInput.value=1;
            const isPlural = everyText.innerText.split("").pop();
             if(isPlural==="s"){everyText.innerText = everyText.innerText.slice(0,-1);}
        }
    })
    everyInput.focus()
    everyInput.placeholder = "1-99";



    const repeatWeekDiv = elementCreator("div", ["class", "repeat-week-div"], false, mainDiv);
    const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for(let i=0;i<7;i++){
        const checkBox = elementCreator("div", ["class", "repeat-checkbox"],false, repeatWeekDiv);
        const label = elementCreator("p", false, weekLabels[i], checkBox);
        const checkOuter = elementCreator("div", false , false, checkBox);
        const checkInner = elementCreator("span", ["class", "repeat-checkbox-inner"] , "X", checkOuter);
        checkBox.addEventListener("click", checkBoxFunc);

    }
    function checkBoxFunc(){
        const inner = this.querySelector(".repeat-checkbox-inner");
        if(!this.className.includes("repeat-checkbox-checked")){
            this.classList.add("repeat-checkbox-checked");
            inner.classList.add("repeat-checkbox-inner-show")
        }
        else{
            this.classList.remove("repeat-checkbox-checked");
            inner.classList.remove("repeat-checkbox-inner-show")
        }
    }
    const repeatMonthDiv = elementCreator("div", ["class", "repeat-month-div"], false, mainDiv);
    const [repDay, [repWeekDay, weekD]] = getRepMonthDay(parent);
    const leftBtn = elementCreator("div", ["class", "chosen-month-tab-left"], `every ${repDay}`, repeatMonthDiv);
    const rightBtn = elementCreator("div", false, `every ${repWeekDay} ${weekD}`, repeatMonthDiv);
    leftBtn.addEventListener("click", leftFunc);
    rightBtn.addEventListener("click", rightFunc);
    function leftFunc(){
        rightBtn.classList.remove("chosen-month-tab-right");
        leftBtn.classList.add("chosen-month-tab-left");

    }
    function rightFunc(){
        leftBtn.classList.remove("chosen-month-tab-left");
        rightBtn.classList.add("chosen-month-tab-right");

    }
}

function getRepMonthDay(repBtn ){
    const modalDiv = repBtn.closest(".modal-add")
    let dueBtnText = modalDiv.querySelector(".add-btn-due").innerText;
    if(dueBtnText==="Today"){dueBtnText= getToday(false, true);}
    const repDay = addSuffix(dueBtnText.split("/").shift()) 
    const repWDay = (addSuffix(whichWeekDayOfMonth(dueBtnText)));
    const repWD = weekDayFind(formatDate(dueBtnText))

    return [repDay, [repWDay, repWD]]
    function formatDate(val){return val.split("/").reverse().join("/")};
}


function tabClickFunc(){
    applyClassList(this)
    checkEveryType(this)

}

function applyClassList(tab){
    const tabDiv =  tab.parentElement;
    const allTabs = tabDiv.querySelectorAll(".repeat-tab");
    //clear
    allTabs.forEach(elem=>{
        const classes = elem.classList;
        classes.forEach(cl=>{
            if(cl.includes("selected")){
                elem.classList.remove(cl);
            }
        })
    })
    tab.classList.add("selected-repeat-tab");
}
function checkEveryType(tab){
    const repeatWeekDiv = tab.parentElement.parentElement.querySelector(".repeat-week-div");
    const repeatMonthDiv=  tab.parentElement.parentElement.querySelector(".repeat-month-div");
    const repeatMenu = tab.parentElement.parentElement;
    const everyType = repeatMenu.querySelector(".every-type-text");
    const inputVal = Number(repeatMenu.querySelector(".every-input").value);
    everyType.innerText = inputVal>1?tab.innerText.toLowerCase() + "s":tab.innerText.toLowerCase();
    tab.innerText==="Week"?repeatWeekDiv.classList.add("show-hidden-week"):repeatWeekDiv.classList.remove("show-hidden-week");
    tab.innerText==="Month"?repeatMonthDiv.classList.add("show-hidden-month"):repeatMonthDiv.classList.remove("show-hidden-month");

}

function repeatInputFunc(e){
    const everyType = this.parentElement.querySelector(".every-type-text");
    inputOnlyNum(e, this, [1, 99]);
    let arr = everyType.innerText.split("");
    if(Number(this.value)>1){
        if(arr[arr.length-1]==="s") return
        else everyType.innerText = everyType.innerText + "s";
    }
    else if(Number(this.value)===1){
        if(arr[arr.length-1]!=="s") return
        else everyType.innerText = everyType.innerText.slice(0,-1)
    }

}

