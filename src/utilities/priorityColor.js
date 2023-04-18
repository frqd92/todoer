export function prioToColor(priority){
    const obj = {
        normal : "rgba(85, 189, 64, 0.424)",
        high :"rgba(209, 136, 33, 0.436)",
        highest : "rgba(222, 52, 0, 0.43)"
    }

    return obj[priority];
}