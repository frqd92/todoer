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