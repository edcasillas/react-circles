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

export function distanceBetweenLocations(a: Location, b: Location) : number {
    return Math.sqrt(
        Math.pow(a.y-b.y,2) + Math.pow(a.x-b.x,2)
    );
}