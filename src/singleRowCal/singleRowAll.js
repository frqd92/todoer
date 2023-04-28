import { createTaskDisplay, renderTasks } from "../taskDisp/createTaskDisp";
import { elementCreator } from "../utilities/elementCreator";

export function createAllCal(){
    const calContainer = document.querySelector(".tf-cal-container");
    const allMainDiv = elementCreator("div", ["class", "sr-all-div"], false, calContainer)
    const allSquare = elementCreator("div", ["class", "sr-all-square", "selected-year-square"], "All", allMainDiv);
    allSquare.addEventListener("click", allSquareFunc)
    allSquare.isAll = true;
    const yearsDiv = elementCreator("div", ["class", "sr-years-div"], false, allMainDiv);
    for(let i=0;i<7;i++){
        const calYearSquare = elementCreator("div", ["class", "sr-year-square"], false, yearsDiv);
        calYearSquare.addEventListener("click", allSquareFunc)
    }
}

function allSquareFunc(){
    if(!this.isAll){
        const allSquare = document.querySelector(".sr-all-square");
        allSquare.classList.remove("selected-year-square")
    }
    changeYearText(this);
    createTaskDisplay();
    removeOtherCL();
    this.classList.add("selected-year-square");
}


function removeOtherCL(){
    document.querySelectorAll(".sr-year-square").forEach((square, index)=>{
        square.classList.remove("selected-year-square")
    })
}

function changeYearText(sq){
    const textDiv = document.querySelector(".all-date-range");
    const text = sq.innerText === "All"?"All tasks":sq.innerText;
    textDiv.innerText = text;
}


export function fillAllCalSquares(bool, val){
    removeOtherCL()
    const allSquares = document.querySelectorAll(".sr-year-square");
    //bool renders the year dates relative to today's year
    //while !bool is relative to the user's choice when they change the year range
    let initialVal;
    if(bool){
        initialVal = new Date().getFullYear() - 3;
    }
    else{
        initialVal = val;
    }
    allSquares.forEach(square=>{
        square.innerText = initialVal;
        initialVal++;
        if(Number(square.innerText)===new Date().getFullYear()){
            square.classList.add("this-year-square")
        }
        else{
            square.classList.remove("this-year-square")

        }
    })

}