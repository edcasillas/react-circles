import Location from "./Location";

/**
 * Gets the relevant location from a mouse or single touch event
 */
export function getPointerLocation(e : Event) : Location {
    if(e instanceof TouchEvent) {
        if (e.touches && e.touches.length === 1) {
            return { x:e.touches[0].clientX, y: e.touches[0].clientY, color: "white" }
        }
    } else {
        if (e instanceof MouseEvent && e.clientX && e.clientY) {
            return { x: e.clientX, y: e.clientY, color: "white" }
        }
    }
    return {x: 0, y: 0, color: "white"};
}