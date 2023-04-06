const monthArr = ["January", "February", "March","April","May", "June", "July", "August", "September", "October", "November", "December"];
//if today is mon feb 2023... "day" returns Monday.... "month" returns February...year 2023
//if no chosen date then date is today
export function getCurrentDateText(value, chosenDate){
    let date;
    if(!chosenDate){
      date = new Date();
    }
    else{
      date = new Date(chosenDate);
    }
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


