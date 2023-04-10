const monthArr = ["January", "February", "March","April","May", "June", "July", "August", "September", "October", "November", "December"];
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