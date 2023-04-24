import { createID } from "../taskModal/processTask";
import { addZeroDispDate, dispDateStrToObjDate, weeksExp } from "../utilities/dateUtils";
import { arrToDateObj, findRelativeDateForRepeats, whichWeekDayOfMonth, formatNumDate, daysInMonthRepeat} from "/src/utilities/dateUtils";

export function processRepeat(taskObj, dDate){
    const dueDate = dispDateStrToObjDate(taskObj.due);
    const dateEntered = dispDateStrToObjDate(taskObj.dateEntered);
    const repeatObj = readRepeatObjVal(taskObj.repeat);
    const repEvery = repeatObj.every;
    const repFactorNum = repeatObj.numRepeatsEvery;
    const dispDates = dDate.map(dat=>arrToDateObj(dat).getTime());
    const firstDisp = dispDates[0];
    const finalDisp = dispDates[dispDates.length-1];
    const repType = repeatObj.repeatFactor;

    let untilFinal;

    if(repType==="until"){
        untilFinal = arrToDateObj(repeatObj.untilDate).getTime();
    }
    else if(repType==="forever"){
        untilFinal = finalDisp+10000;
    }
    else if(repType==="times"){
        untilFinal = calculateTimesFinal(repEvery,repeatObj.repeatNumOfTimes ,dueDate, repFactorNum);
    }
    if(firstDisp>untilFinal || finalDisp<dueDate.getTime()){return}

    if(repEvery==="day"){     
        //returns an array of dates where repeated tasks are found in the current view mode
        const foundDates = calculateUntil(dateEntered, repFactorNum, firstDisp, finalDisp, untilFinal);
        return dateArrToTaskObj(foundDates, taskObj); 
    }
    else if(repEvery==="week"){
        const foundDates = dateLooperWeek(repeatObj.everyData, dueDate, untilFinal, finalDisp, firstDisp, repFactorNum);
        return dateArrToTaskObj(foundDates, taskObj);
    }
    else if(repEvery==="month"){
        const everyType = repeatObj.everyData
        let foundDate;
        if(everyType.length===1){
            foundDate = dateLooperMonthDate(dDate, dueDate, everyType[0], repFactorNum);
        }
        else{
            foundDate = dateLooperMonthDay(dDate, dueDate, everyType, repFactorNum);
            
        }
        if(foundDate!==undefined) return dateArrToTaskObj([foundDate], taskObj)
    }
    else if(repEvery==="year"){
        const foundDate = yearFunc(dDate, dueDate, repFactorNum);
        if(foundDate!==undefined){
            return dateArrToTaskObj([foundDate], taskObj);
        }

    }

}

function calculateTimesFinal(every, numTimes, startDate, repEvery){
    if(every==="day"){
        return findRelativeDateForRepeats(startDate, repEvery*numTimes);
    }
    else if(every==="week"){
        return findRelativeDateForRepeats(startDate, repEvery*numTimes*7);
    }
    else if(every==="month"){
        const newMonth = new Date(startDate);
        newMonth.setDate(1);
        newMonth.setMonth(startDate.getMonth() + repEvery*numTimes)
        const daysInNewMonth = daysInMonthRepeat(newMonth);
        return new Date(`${newMonth.getFullYear()}/${newMonth.getMonth()+1}/${daysInNewMonth}`)
    }
    else if(every==="year"){
        const newYear = new Date(startDate);
        newYear.setMonth(12);
        newYear.setDate(31)
        newYear.setFullYear(startDate.getFullYear() + (repEvery*numTimes) + 1)
        return newYear;
    }
}
//creates deep copies of the original task object and creates new ones with the repeated dates and changes the due date accordingly
function dateArrToTaskObj(arr, taskObj){
    if(arr){
        const repeatedTaskObj = [];
        arr.forEach(date=>{
            const taskCopy = Object.assign({}, taskObj);
            const dateStr = addZeroDispDate(`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`);
            taskCopy.due = dateStr;
            taskCopy.isRepObject = true;
            taskCopy.originalID = taskCopy.uniqueID;
            taskCopy.uniqueID = createID();
            taskCopy.repeatedElement = true;
            repeatedTaskObj.push(taskCopy);
        })

        return repeatedTaskObj;
    }

}

function calculateUntil(first, factor, firstDisp, finalDisp, untilFinal){
    let nextDate = first;
    const foundDates = [];
    while(nextDate.getTime()<=finalDisp){
        if(nextDate.getTime()<=untilFinal){
            nextDate = findRelativeDateForRepeats(nextDate, factor);
            if((nextDate.getTime()>=firstDisp && nextDate.getTime()<=finalDisp) && nextDate.getTime()<=untilFinal){
                foundDates.push(nextDate);
            }
        }
        else if(nextDate>untilFinal){
            return foundDates
        }
    }
    return foundDates
}

// loops week days to find repeat tasks
function dateLooperWeek(selWeekdays, start, until, finalDisp, startDisp, factor){
    let nextDate = start;
    const selectedDays = arrayFromSelWeekDays(selWeekdays);
    let weekFactor = factor;
    const datesArr = [];
    while(nextDate.getTime()<until){
        nextDate = findRelativeDateForRepeats(nextDate, 1);
        const dayOfWeek = nextDate.getDay()>0?nextDate.getDay()-1:6;
        if(selectedDays[dayOfWeek]!==undefined){
            if(nextDate.getTime()>=startDisp && nextDate.getTime()<=finalDisp && weekFactor===factor){
                datesArr.push(nextDate);
            }
        }
        if(dayOfWeek===6){
            if(weekFactor===factor){
               weekFactor=0;
            }
            weekFactor++;
        }
    }
    return datesArr;
}


function arrayFromSelWeekDays(sel){
    const compare = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    return compare.map(date=>!sel.includes(date)?undefined:date)
}


function yearFunc(dDate, start, every){
    const dispDates = dDate.map(dat=>arrToDateObj(dat));
    const startYear = start.getFullYear();
    let foundDate;
    dispDates.forEach(date=>{
        if(date.getFullYear()===startYear) return;
        const currentYear = date.getFullYear();
        const isValid = (currentYear-startYear)%every;
        if(isValid===0){
            if((date.getMonth()===start.getMonth()) && (date.getDate() === start.getDate())){
                foundDate = date;
                return;
            }
        }
    })
    if(foundDate!==undefined) return foundDate
}

function dateLooperMonthDate(dDate, start, everyNum, repEvery){
    const dispDates = dDate.map(dat=>arrToDateObj(dat));
    const startDisp = dispDates[0];
    const startMonth = start.getMonth();
    let foundDate;
    if(!isCurrentMonthValid(startDisp,start, repEvery)) return;
    dispDates.forEach(date=>{
        const dateMonth = date.getMonth();
        if(date.getDate()===everyNum){
            foundDate = date;
            return;
        }
    })
    if(foundDate!==undefined) return foundDate
}



function dateLooperMonthDay(dDate, start, everyArr, repEvery){
    const dispDates = dDate.map(dat=>arrToDateObj(dat));
    const startDisp = dispDates[0];
    const compare = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    let [everyNum, everyWeekDay] = everyArr;
    everyWeekDay = compare.indexOf(everyWeekDay);
    let foundDate;
    if(!isCurrentMonthValid(startDisp,start, repEvery)) return;
    dispDates.forEach(date=>{
        const stringDate = formatNumDate(`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`)
        const currDayOfWeek = date.getDay()>0?date.getDay()-1:6;
        const weekDay = whichWeekDayOfMonth(stringDate);
        if(weekDay===everyNum && currDayOfWeek===everyWeekDay){
            return foundDate = date;
        }
    })
    return foundDate;
}

function isCurrentMonthValid(stDisp, startMonth, repEvery){
    let start = new Date(startMonth);
    start.setDate(1);
    let startDisp = new Date(stDisp);
    startDisp.setDate(1);
    if(startDisp.getTime()===start.getTime()) return false;
    let everyCount = 0;
    while(start.getTime() !== startDisp.getTime() ){
        start = new Date(start);
        start.setMonth(start.getMonth() + 1);
        if(everyCount===repEvery){
            everyCount=0;
        }
        everyCount++;
    }
    return everyCount===repEvery?true:false;
}

function readRepeatObjVal(val){
    const obj = {};
    if (val==="No repeat") return false;
    obj.fullString = val;
    const arr = val.split(" ");
    if((arr.includes("day") || arr.includes("days")) && (!arr.includes("month") && !arr.includes("months"))){
        obj.every = "day";
        obj.numRepeatsEvery = Number(arr[0])
        
    }
    if(arr[1]==="week" || arr[1]==="weeks"){
        obj.every="week"
        const weekArr = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        const  weekDaysArr = []
        arr.forEach(elem=>{
            elem = elem.replace(",", "");
            if(weekArr.includes(elem)){
                weekDaysArr.push(elem)
            }
        })

        obj.numRepeatsEvery = Number(arr[0]);
        obj.everyData = weekDaysArr;
    }
    else if(arr.includes("month") || arr.includes("months")){
        let monthArr = [];
        obj.every="month";
        obj.numRepeatsEvery = Number(arr[0]);

        if(weeksExp.includes(arr[5])){
            monthArr[0]= Number(arr[4][0]);
            monthArr[1] = arr[5].substring(0,3).toLowerCase();
        }
        else{
            monthArr[0]= Number(arr[4].replaceAll(/[a-zA-Z]/g, "" ));
        }
        obj.everyData= monthArr;
    }
    else if(arr.includes("year") || arr.includes("years")){
        obj.every="year";
        obj.numRepeatsEvery = arr[0];
    }

    if(arr.includes("forever")){
        obj.repeatFactor = "forever";
    }
    else if(arr.includes("until")){
        obj.repeatFactor = "until";
        let [dd,mm,yy] = arr[arr.length-1].split("/");
        obj.untilDate = [Number(dd),Number(mm)-1,Number(yy)];

        
    }
    else if(arr.includes("time") || arr.includes("times")){
        obj.repeatFactor = "times";
        obj.repeatNumOfTimes = Number(arr[arr.length-2]);
       
    }
    return obj
}