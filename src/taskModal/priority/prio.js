import '/src/taskModal/priority/prio.css'
import { elementCreator } from '../../utilities/elementCreator';
export function makePriorityMenu(btn){
    const priorityDiv = elementCreator("div", ["class", "add-prio-menu"], false, btn);
    const arr = ["Normal", "High", "Highest"];
    const backDiv = elementCreator("div", ["class", "prio-back-div"], false, priorityDiv)
    for(let i=0;i<3;i++){
        const prioBtn = elementCreator("div", ["class", "prio-btn"], arr[i], priorityDiv)
        prioBtn.addEventListener("click", prioFunc)
    }
}

function prioFunc(){
    const prioDiv = this.parentElement.parentElement;
    const backDiv = prioDiv.querySelector(".prio-back-div");
    const btnText = this.innerText;
    clearClass()
    clearBtnClass()
    this.classList.add("selected-prio-btn");
    switch(btnText){
        case "Normal":
            backDiv.classList.add("prio-normal");
            break;
        case "High":
            backDiv.classList.add("prio-high");
            break;
        case "Highest":
            backDiv.classList.add("prio-highest");
            break;
    }
    function clearClass(){
        if(backDiv.classList.length>1){
            backDiv.classList.forEach(classL=>{
                if(classL!=="prio-back-div"){
                    backDiv.classList.remove(classL)
                }
            })
        }
    }
    function clearBtnClass(){
        const allBtns = prioDiv.querySelectorAll(".prio-btn");
        allBtns.forEach(btn=>{btn.classList.remove("selected-prio-btn")})
    }
}   