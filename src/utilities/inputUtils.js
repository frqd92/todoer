
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
