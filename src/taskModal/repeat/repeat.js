import { elementCreator } from "../../utilities/elementCreator";
import { inputOnlyNum } from "../../utilities/inputUtils";
import '/src/taskModal/repeat/repeat.css'
export function createModalRepeat(parentBtn){
    const repeatDiv = elementCreator("div", ["class", "add-repeat-menu"], false, parentBtn);

    createTimeTab(repeatDiv);
    createRepeatFactor(repeatDiv)
    return repeatDiv;
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
            const lastChar = everyText.innerText.split("").pop();
             if(lastChar==="s"){everyText.innerText = everyText.innerText.slice(0,-1);}
        }
    })
    everyInput.focus()
    everyInput.placeholder = "1-99"

}

function tabClickFunc(){

    applyClassList(this)
    checkEveryType(this)

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


}
function checkEveryType(tab){
    const repeatMenu = tab.parentElement.parentElement;
    const everyType = repeatMenu.querySelector(".every-type-text");
    const inputVal = Number(repeatMenu.querySelector(".every-input").value);
    everyType.innerText = inputVal>1?tab.innerText.toLowerCase() + "s":tab.innerText.toLowerCase();
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

