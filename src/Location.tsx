/**
 * Defines a location in the Canvas
 */
export default interface Location {
    x: number;
    y: number;
}

export function addLocations(a : Location, b: Location) : Location {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    };
}

export function subtractLocations(a : Location, b: Location) : Location {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    };
}