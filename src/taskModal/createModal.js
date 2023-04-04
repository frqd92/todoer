import { elementCreator } from "../utilities/elementCreator";

export function createAddModal(isEdit){
    const classL = !isEdit?"add":"edit";
    const mainDiv = elementCreator("div", ["class", `modal-${classL}`], false, false);

    const addInputDiv = createInput(mainDiv, "Title*");
    const addDescDiv = createInput(mainDiv, "Description");
    const modalElements = ["Due date", "Group", "Priority", "Repeat", "Notes"];
    for(let i=0;i<5;i++){addFactory(mainDiv, modalElements[i])};

    if(!isEdit) feedValues(mainDiv);

    return mainDiv;
}

function feedValues(div, arr){
    const allElements = div.querySelectorAll(".add-btn");

    if(!arr){
        const content = ["Today", "None", null, "No", "None"];
        allElements.forEach((elem, i)=>{
            if(i!==2){
                elem.innerText=content[i];
            }
        })

    }

    
}



function addFactory(parent, type){
    const classL = type.split(" ").shift().toLowerCase();
    const mainDiv = elementCreator("div", ["class", "add-element"], false, parent);
    const label = elementCreator("div", ["class", "add-label"], type, mainDiv);
    const btn = elementCreator("div", ["class", "add-btn", `add-btn-${classL}`], false, mainDiv);
    if(classL==="priority"){
        btn.addEventListener("click", makePriorityMenu);
    }
    else{
        btn.addEventListener("click", makeMenu, {once:true});
    }
    function makeMenu(){
        const menuDiv = elementCreator("div", ["class", "add-menu" , `add-menu-${classL}`], false, mainDiv);
        setTimeout(()=>{menuDiv.style.opacity=1}, 100)
        parent.addEventListener("click", closeM);
    }
    function makePriorityMenu(){
      
    }
    function closeM(e){
        if(!e.target.closest(`.add-btn-${classL}`) && !e.target.closest(`.add-menu-${classL}`) ){
            closeMenu();
        }
    }
    function closeMenu(){
        if(mainDiv.querySelector(`.add-menu-${classL}`)!==null){
            mainDiv.querySelector(`.add-menu-${classL}`).style.opacity=0;
            setTimeout(()=>{mainDiv.querySelector(`.add-menu-${classL}`).remove()}, 100)
            btn.addEventListener("click", makeMenu, {once:true});
        }
    }

    return mainDiv;
}
















// Title and description inputs------------------------------------------------------------------------------
function createInput(parent, type){
    const div = elementCreator("div", ["class", "outer-form-input-div"],false, parent)
    const inputDiv = elementCreator("div", ["class", "modal-input-div"], false, div);
    const placeholder = elementCreator("div", ["class", "modal-placeholder"],type, inputDiv);
    const input = elementCreator("div", ["class", "modal-input"],false, inputDiv);
    input.setAttribute("contenteditable", "true");

    const textLengthDiv = elementCreator("div", ["class", "modal-text-length"], false, div);
    input.addEventListener("input", formInputLogic);
    function formInputLogic(){
        const invalidLength = type==="Description"?"200":"100";
        this.innerText.length>0?placeholder.innerText="":placeholder.innerText=type;
        inputDiv.offsetHeight>80?inputDiv.classList.add("overflown-input"):inputDiv.classList.remove("overflown-input");
        if(input.innerText.length>0){
            textLengthDiv.style.display="block";
            textLengthDiv.innerText = `Characters: ${input.innerText.length}/${invalidLength}`;
        }
        else{
            textLengthDiv.style.display="none";
        }
        if(input.innerText.length>Number(invalidLength)){
            inputDiv.classList.add("modal-invalid-input");
            textLengthDiv.classList.add("form-invalid-over");
        }
        else{
            inputDiv.classList.remove("modal-invalid-input");
            textLengthDiv.classList.remove("form-invalid-over");
        }
    }
}