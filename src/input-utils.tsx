import Location from "./Location";

/**
 * Gets the relevant location from a mouse or single touch event
 */
export function getEventLocation(e : MouseEvent | TouchEvent) : Location {
    if(e instanceof TouchEvent) {
        if (e.touches && e.touches.length === 1) {
            return { x:e.touches[0].clientX, y: e.touches[0].clientY }
        }
    } else {
        if (e.clientX && e.clientY) {
            return { x: e.clientX, y: e.clientY }
        }
    }
    return {x: 0, y: 0};
}