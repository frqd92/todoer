import '/src/calendar/smartInput/smartInput.css';
import { createInfoBox } from '../../utilities/infoBox/infoBox';
import { elementCreator } from '../../utilities/elementCreator';
import { getCurrentDateText } from '../../utilities/dateUtils';
const months = ["January", "February", "March","April","May", "June", "July", "August", "September", "October", "November", "December"];
const date = new Date();

export function createSmartInput(outputBtn){
    const inputDiv = elementCreator("div", ["id", "cal-smart-input"], false, false);
    const input = elementCreator("input", false, "Write date & press enter", inputDiv, false, true); 
    const infoFormats = "Write the available formats for the smart input blah blah"
    inputDiv.appendChild(createInfoBox(infoFormats));
    
    
    autoCompleteMonth(input);
    makeSmart(input, outputBtn);

    return inputDiv;
}

function makeSmart(input, btn){
    input.addEventListener("keydown", renderDate);
    let formatObj = {};
    function renderDate(e){
        if(e.key==="Enter"){
            let invalid=false;
            formatObj.day="";formatObj.month="";formatObj.year="";
            const isDateNum = formatDateNum(this, formatObj);
            if(!isDateNum){ //if date is in number format
                let isDateText = formatDateText(this, formatObj);
                if(!isDateText){
                    invalid=true;
                }
            }
            if(!invalid){ //if date in input passes all the checks
                console.log(processDate(formatObj, btn, input));
                return processDate(formatObj, btn, input);
            }
            else{ //if date format is wrong
                if(btn){
                    errorMsg("Error in date format", input)
                }
                else{
                    input.value="";
                    input.placeholder="invalid date"
                    return false;
                }
            }
        }
    }
}

function processDate(obj, btn, input){ //if it passes all the checks
    obj.month=obj.month+1;
    let addZero = [obj.day, obj.month].map(elem=>elem<10?"0"+Number(elem):Number(elem));
    return `${addZero[0]}/${addZero[1]}/${obj.year}`;

    
}
function formatDateText(input, formatObj){
    const inputArr = input.value.split(" ");
    let monthCount=0, dayCount=0, yearCount=0;
    if(inputArr[inputArr.length-1]===""){
        inputArr.pop()
    };
    inputArr.forEach((elem)=>{
        const word = elem.split("");
        let bool = checkForOrdinal(elem,formatObj); //ex. 12th of january
        if(bool){
            dayCount++
        }
        else{
            if(!isNaN(elem) && (elem>0 && elem<32)){
                let day = checkDay(elem);
                formatObj.day = Number(day);
                dayCount++;
            }
        };
        if(/^[,;.-\s]+/.test(word[word.length-1])){
            word.pop();
        }
        let wordTest = word.every((elem)=>/[a-zA-Z]/.test(elem));
        if(wordTest){ //month check if word
            let month = word;
            month[0] = month[0].toUpperCase();
            if(months.includes(month.join(""))){
                monthCount++;
                const monthInNum = months.indexOf(month.join(""))+1
                formatObj.month = monthInNum; 
            }
        }
        if(/^\d{4}$/.test(elem)){ //year check
            formatObj.year = Number(elem);
            yearCount++;
           
        }
    });
    if(formatObj.year===""){
        if(formatObj.month === date.getMonth()+1){
            if(formatObj.day< date.getDate()){
                formatObj.year=date.getFullYear() + 1;
            }
            else{
                formatObj.year=date.getFullYear();
            }
        }
        if(formatObj.month > date.getMonth()+1){
            formatObj.year=date.getFullYear();
        }
        else if(formatObj.month < date.getMonth()+1){
            formatObj.year=date.getFullYear() + 1;
        }
        yearCount++;
    }
    formatObj.month=formatObj.month-1;
    if(dayCount>1 ||monthCount>1 || yearCount>1){
        return false;
    }
    if(checkIfValid(formatObj, input)){
        return true;
    }
    else {
        return false;
    }
}

function formatDateNum(input, formatObj){
    const separators = ["/", ".", "-"];
    let isNum = true;
      let arr = input.value.split("");
      arr=arr.filter(elem=>elem!==" ");
      arr.forEach((elem,index)=>{
          if(separators.includes(elem))arr[index] = " ";
      })
      let dateArray = arr.join("").split(" ");
      let day,month,year;
      dateArray.forEach((elem, index)=>{
          if(elem.length===1) dateArray[index]= "0"+elem;  
          if(isNaN(elem))isNum = false;   
      })
      if(isNum===false)return false;
      else{
          if(dateArray.length==1)return false
          if(dateArray.length>2){
              if((dateArray[0].length===2 && dateArray[2].length===4) && dateArray.length===3){
                  day = dateArray[0];
                  month = Number(dateArray[1]-1);
                  year = dateArray[2];
              }
              else if((dateArray[0].length===4 && dateArray[2].length===2) && dateArray.length===3){
                  day = dateArray[2];
                  month = Number(dateArray[1]-1);
                  year = dateArray[0];
              }
              else if((dateArray[0].length===2 && dateArray[1].length===2 && dateArray[2].length===2) && dateArray.length===3){
                  day = dateArray[0];
                  month = Number(dateArray[1]-1);
                  year = "20" + dateArray[2];
              }
          }
          else{
              if((dateArray[0].length===4) && dateArray.length===2){
                  month = Number(dateArray[1]-1);
                  year = dateArray[0];
              }
              else if(dateArray[1].length===4 && dateArray.length===2){
                  month = Number(dateArray[0]-1)
                  year = dateArray[1];
              }
              else if(dateArray.length===2){
                  day = dateArray[0];
                  month = Number(dateArray[1]-1)
              }
          }
          if(day===undefined && month===undefined){
              return false;
          }
          else{
              if(day===undefined){
                  if((date.getMonth()) === month){
                      formatObj.day = date.getDate() + 1;
                  }
                  else{
                      formatObj.day = 1;
                  }
                  formatObj.month = month;
                  formatObj.year = year;
              }
              else if (year===undefined){
                  if((date.getMonth()) === month){
                      if(day<date.getDate()){
                          formatObj.year = date.getFullYear() + 1;
                      }
                      else{
                          formatObj.year = date.getFullYear();
                      }
                  }   
                  else if((date.getMonth()) > month){
                      formatObj.year = date.getFullYear() + 1;
                  }
                  else{
                      formatObj.year = date.getFullYear();
                  }
                  formatObj.day = day;
                  formatObj.month = month;

              }
              else{
                  formatObj.day = day;
                  formatObj.month = month;
                  formatObj.year = year;
              }
              if(checkIfValid(formatObj, input)){
                  return [day,month,year]
              }

          }
      }
}

function checkIfValid(obj, input){
    const date = new Date();
    let getDay = date.getDate();
    let getMonth = date.getMonth();
    let getYear = date.getFullYear();
    let day = Number(obj.day);
    let month = Number(obj.month);
    let year = Number (obj.year);
    let daysInChosenMonth = daysInMonth(obj.month, obj.year);
    if(!daysInChosenMonth){
        errorMsg("Invalid Date Format", input);
        return false
    }
    if(day>daysInChosenMonth || day<1){
        errorMsg(`Days must be less than ${daysInChosenMonth} or greater than 0`, input);
        return false;
    }

    else if(month>11 || month<0) {
        errorMsg("Months must be between 1-12", input);
        return false;
    }
    else if(year<getYear){
        errorMsg("No time traveling", input);
        return false;
    }
    else if(year===getYear && (month===getMonth) && day<getDay){
        errorMsg("No time traveling", input);
        return false;
    }

    else{
        if(year < getYear){
            errorMsg("Check year", input);
            return false;
        };
        if(getYear===year){
            if(month < getMonth){
                errorMsg("Check month", input);
                return false;
            }
            if(month ===getMonth){
                if(day < getDay){
                errorMsg("Check day", input);
                return false;
                }
            }
        }
    }

    return true;
};


function errorMsg(value, input){ //move to dom folder after
    const div = input.parentElement;
    input.classList.add("date-input-invalid");
    if(input.className.includes("ineffect-other")){}
    else{
        if(document.querySelector(".modal-input-error")===null){
            const errorBox = elementCreator("div", ["class","modal-input-error"], value, div);
            setTimeout(()=>{
                errorBox.style.opacity="0";
            },2300)
            setTimeout(()=>{
                errorBox.remove();
            },2600)
        }
    }

}


function daysInMonth(mm, year) {
    let month = isNaN(mm)?returnMonth(mm):mm;

    let chosenMonth = new Date(year,month,1);

    return new Date(chosenMonth.getFullYear(), chosenMonth.getMonth()+1,0 ).getDate();
  }

export function returnMonth(month){

    if(isNaN(month)) return months.indexOf(month);
    else return months[month+1];

}


function autoCompleteMonth(input){
    const monthKeys = ["ja","fe" ,"mar", "ap", "may", "jun", "jul", "au", "se", "oc", "no", "de"];
    input.addEventListener("input", autoComp);
    function autoComp(e){
        if(e.inputType!=="deleteContentBackward"){
            let wordArray = this.value.toLowerCase().split(" ");
            wordArray.forEach((word, indexWord)=>{
                monthKeys.forEach((month, indexMonth)=>{
                    if(word.toLowerCase().includes(month) && (word[0].toLowerCase() === month[0])){
                        wordArray[indexWord]=months[indexMonth];
                    }
                })
            })
            this.value = wordArray.join(" ");
        }
    }
}


function checkDay(num){
    if(num.length===1){
        num = "0" + num;
    }
    if(num>0 && num<32){
        return num;
    }
}


function checkForOrdinal(val, obj){
    let bool = false;
    let ordinal = ["th", "rd", "st", "nd"];
    ordinal.forEach(elem=>{
        if(val.includes(elem)){
            let num = val.replace(elem, "");
            const dayFormat = checkDay(num);
            if(dayFormat!==undefined){
                obj.day = Number(dayFormat);
                bool = true;
            }
        }
    })
    return bool;
}
function chosenDayFunc(year, month, day) {
    const chosenDay = new Date(`${year}/${month}/${day}`);
    return chosenDay.toLocaleString('en-us', {weekday: 'long'})
}

