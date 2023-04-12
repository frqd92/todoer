import { elementCreator } from "./elementCreator";
import '/src/taskModal/addModal.css'
export function createBodyModal(div){
    function createDiv(){
        const bgDiv = elementCreator("div", ["class", "bg-div-modal"], false, document.body, true);
        bgDiv.addEventListener("click", closeDiv);
        setTimeout(()=>{
            div.classList.add("bg-div-show");
            bgDiv.classList.add("bg-div-show");
        }, 100);

    }
    function closeDiv(){
        const bgDiv = document.querySelector(".bg-div-modal")
        // insert logic that saves unsaved content
        div.classList.remove("bg-div-show");
        bgDiv.classList.remove("bg-div-show");
        setTimeout(()=>{
            div.remove();
            bgDiv.remove();
        }, 100)
}

    return {closeDiv, createDiv};
}