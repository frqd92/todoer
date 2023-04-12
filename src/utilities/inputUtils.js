import { elementCreator } from "./elementCreator";

elementCreator
//makes input only accept numbers in a specific range used with input event listener
// ex.  inputOnlyNum(e, this, [1,99]) -> only allows users to type numbers 1-99
export function inputOnlyNum(e, inp, arr){
    let input;
    !inp?input = this:input=inp;
    const [min, max] = arr;
    if(/[a-z\W]/i.test(e.data)){
        input.value = input.value.replaceAll(e.data,"");
    };
    if(Number(input.value)>max || Number(input.value)<min){
        input.value="";
    }
}

//creates a div in the input's parent (sibling to the input), that displays the char count
//maxChar is an integer of max characters
//can be regular inputs, textareas or content editable divs
export function displayCharCount(input, maxChar, classL){
    const charCounter = elementCreator("span", ["class", `disp-char-${classL}`], false, input.parentElement);
    input.addEventListener("input", updateChar);
    function updateChar(){
        const typeOfInput = input.nodeName.toLowerCase();
        let length;
        if(typeOfInput==="textarea" ||typeOfInput==="input"){length = input.value.length}
        else {length = input.textContent.length}
        if(length===0) charCounter.style.display="none";
        else charCounter.style.display="block";

        if(length>maxChar) charCounter.classList.add(`disp-char-${classL}-invalid`);
        else if(length<=maxChar) charCounter.classList.remove(`disp-char-${classL}-invalid`);

        charCounter.textContent = `${length}/${maxChar} characters`
    }
}