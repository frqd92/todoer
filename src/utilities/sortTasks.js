import { dispDateStrToObjDate } from "./dateUtils";
export function sortByDate(arr, isAsc){
    return makeDeepCopy(arr).sort((a,b)=>{
        const aDate =  dispDateStrToObjDate(a.due).getTime();
        const bDate =  dispDateStrToObjDate(b.due).getTime();
        return isAsc? aDate - bDate : bDate-aDate;
    })
}

export function returnRangeTasks(arr, from, to){
    return makeDeepCopy(arr).filter(elem=>{
        const date = dispDateStrToObjDate(elem.due);

        if(!to){
            if(date===from){ return elem }
        }
        else{
            if(date>=from && date<=to){ return elem }
        }
    })
}




function zeroAdder(num){return num<10?"0"+num:num;}

function makeDeepCopy(arr){
    let copiedArr, value, key;
    if(typeof arr !=="object" || arr ===null) return arr;
    copiedArr = Array.isArray(arr) ? [] : {};
    for(key in arr){
      value = arr[key];
      copiedArr[key] = makeDeepCopy(value);
    }
    return copiedArr;
}