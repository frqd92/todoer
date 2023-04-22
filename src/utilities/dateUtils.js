export const monthArr = ["January", "February", "March","April","May", "June", "July", "August", "September", "October", "November", "December"];
export const weeksExp = ["Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
//if today is mon feb 2023... "day" returns Monday.... "month" returns February...year 2023
//if no chosen date then date is today
export function getCurrentDateText(value, chosenDate){
    let date;
    if(!chosenDate){date = new Date()}
    else{date = new Date(chosenDate)}
    switch(value){
      case "day": 
        return date.toLocaleString('en-us', {weekday: 'long'});
      case "month":
        return date.toLocaleString('en-us', {month: 'long'});
      case "year":
        return date.getFullYear();
    }
  }

  //gets day of a date as a string
export function chosenDayFunc(year, month, day) {
    const chosenDay = new Date(`${year}/${month}/${day}`);
    return chosenDay.toLocaleString('en-us', {weekday: 'long'})
}

export function returnMonth(month){
  if(isNaN(month)) return monthArr.indexOf(month);
  else return monthArr[month];
}
//returns april 2023
export function getMonthAndYear(){
    const date = new Date();
    return returnMonth(date.getMonth()) + " " + date.getFullYear();
}

//returns "dd/mm/yyyy" as an array [dd,mm,yyyy] 
export function strDateToArr(str){
  return str.replaceAll(/[^0-9]/g," ").split(" ").map(elem=>Number(elem));
}

export function detectFirstDayMonth(selectDate){
  let [mm,yy] = selectDate;
  mm = isNaN(Number(mm))?returnMonth(mm):mm;
  const date = new Date(yy,mm, 1);
  return getCurrentDateText("day", date);
}

export function daysInMonth(date){
  return new Date(date.getFullYear(), date.getMonth()+1,0 ).getDate();
}

//returns a date object without time zone or time, used for day comparisons..
export function removeTime(date){
  return new Date(`${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`);
}

//returns today in mm/dd/yyyy format if no parameter
export function getToday(val, monthAdd){
  const date = new Date();
  const month = monthAdd?date.getMonth()+1:date.getMonth();

  if(!val){
    return `${date.getDate()}/${month}/${date.getFullYear()}`;
  }
  else{
    switch(val){
      case "day": return date.getDate();
      case "month": return date.getMonth();
      case "year": return date.getFullYear();
    }
  }
}


export function addZero(elem){
  return Number(elem)<10?"0"+elem:elem;

}
//str 17/4/2023 becomes 17/04/2023, ignore above function
export function addZeroDispDate(str){
  let arr = str.split("/");
  for(let i=0;i<2;i++){
    if(Number(arr[i])<10){
      arr[i]= "0"+ arr[i];
    }
  }
  return arr.join("/");
}

export function addSuffix(val){
  const num = Number(val);
  if(num===11 ||num===12 || num===13 ){return num + "th"}
  else{
    const lastVal = Number(num.toString().split("").pop());
    switch(lastVal){
      case 1: return num + "st";
      case 2: return num + "nd";
      case 3: return num + "rd";
      default: return num + "th";
    }
  }
}

//ex 22/02/2023 returns 4th wed
export function whichWeekDayOfMonth(val){
  const weekDays = ["Monday", "Tuesday","Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  val=strDateToArr(val);
  const [dd,,]= val;
  const dueWeekDay = getCurrentDateText("day", `${val[2]}/${val[1]}/${val[0]}`);
  const firstWeekDayMonth = getCurrentDateText("day", `${val[2]}/${val[1]}/1`);
  const indexOfFirstWeekDay = weekDays.indexOf(firstWeekDayMonth);
  let weekDayCount=indexOfFirstWeekDay;
  let overallCount=0;
  let whichWeek = 0;
  while(overallCount<Number(dd)){
    if(dueWeekDay===weekDays[weekDayCount]){
      whichWeek++;
    }
    weekDayCount++;

    if(weekDayCount===7){
      weekDayCount=0;
    }
    overallCount++;
    
  }
  return whichWeek
}

export function weekDayFind(strDate){
  const date = new Date(strDate);
  return date.toLocaleString('en-us', {weekday: 'long'});
}

//displays full text formatted date
//ex. string "2/2/2023" returns 2nd of march, 2023
export function fullFormattedDate(date, minusOne){
  const [dd,mm,yy] = date.split("/");
  const month = minusOne?Number(mm)-1:Number(mm);
  return `${addSuffix(Number(dd))} of ${returnMonth(month)}, ${yy}`
}

export function addOneToMonth(date, isSub){
  let arr = date.split("/");
  const num = isSub?-1:1;
  arr[1] = Number(arr[1])<9?"0" + (Number(arr[1])+num):(Number(arr[1])+num);
  return arr.join("/");
}

//can't use the one in dateUtil because I messed up and used a bad date format (month 0-11) but there's already a bunch of other functions using it... Plan shit better next time kunt
export function chosenDayFunc2(str) {
  const [day,month,year] = str.split("/"); 
  const chosenDay = new Date(year, month, day);
  return chosenDay.toLocaleString('en-us', {weekday: 'long'})
}
// recursive function that looks for the week date range of a specific date
// messed up because of the 0-11 month shenanigans
export function recursiveFunc(date, isIncrement){
  const isIn = isIncrement;
  const limit = isIncrement?"Sunday":"Monday";
  const step = isIncrement?1:-1;
  if(chosenDayFunc2(date)===limit) return date;

  const [dd,mm,yy] = date.split("/");
  const newDate = findRelativeDate(`${dd}/${mm}/${yy}`, step);
  const weekDay = chosenDayFunc2(newDate);
  if(weekDay===limit) return newDate;
  else return recursiveFunc(newDate, isIn);
}

//adds a zero to nums less than 10
//ex. arr [2,2,2023] returns string 02/02/2023
export function formatNumDate(date, addMonth){
  let val = date;
  if(typeof date==="string"){
    val = date.split("/");
  }
  for(let i=0;i<2;i++){
    if(i===1 && addMonth) val[i]++;
    if(val[i]<10 && val[i][0]!=="0"){
      val[i] = "0"+(val[i]);
    }
  }
  return `${val[0]}/${val[1]}/${val[2]}`
}

//ex enter a date as a string "2/2/2023" and num 7
//finds date 7 days from that date.. if negative then goes back 7
export function findRelativeDate(date, num, isMonth){
  let dd,mm,yy;
  if(typeof date==="object"){
    [dd,mm,yy] = date;
  }
  else{
    [dd,mm,yy] = date.split("/");
  }

  if(isMonth) mm = Number(mm-1);
  const inputDate = new Date(yy,mm,dd);
  const nextDate = new Date(inputDate);
  nextDate.setDate(inputDate.getDate() + num);
  return `${nextDate.getDate()}/${nextDate.getMonth()}/${nextDate.getFullYear()}`
}

//"3rd of march, 2023" becomes 3/2/2023
export function textDateToNum(str){
  const arr = str.split(" ");
  const day = arr[0].split("").filter(elem=>!isNaN(elem)).join("")
  const monthComma = arr[arr.length-2].split("");
  monthComma.pop()
  const month = returnMonth(monthComma.join(""));
  const year = arr[arr.length-1];
  return `${day}/${month}/${year}`

}


//calculates the which week of the year it is
export function whichWeekOfYear(dateObj){
  const year = new Date(dateObj.getFullYear(), 0, 1);
  const days = Math.floor((dateObj - year) / (24*60*60*1000));
  return  Math.ceil(( dateObj.getDay() + 1 + days) / 7);
}

//date in the dom (displayed as a str in dd/mm/year) to date object
//str "dd/mm/yyyy" to new Date("yyyy/mm/dd")
export function dispDateStrToObjDate(strDate){
  const [strD, strM, strY] = strDate.split("/");
  return new Date(`${strY}/${strM}/${strD}`)
}



//converts arr to date obj

export function arrToDateObj(arr){
  const [dd, mm, yy] = arr;
  return new Date(`${yy}/${Number(mm)+1}/${dd}`)
}

//same as the other one but fucked up with formats again
export function findRelativeDateForRepeats(date, num){
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + num);
  return new Date(`${nextDate.getFullYear()}/${nextDate.getMonth()+1}/${nextDate.getDate()}`)
}

//same as other one but less stupid format
export function daysInMonthRepeat(date){
  return new Date(date.getFullYear(), date.getMonth()+1,0 ).getDate();
}

//returns bool if date is today
export function checkIfToday(date){
  const today = removeTime(new Date());
  return date.getTime()===today.getTime()?true:false;
}

//returns bool if date has passed
export function isPast(date){
  const today = removeTime(new Date());
  return date.getTime()<today.getTime()?true:false;


}