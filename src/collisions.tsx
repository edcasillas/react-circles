import { CIRCLE_RAD } from "./Constants";
import Location, { distanceBetweenLocations } from "./Location";

export function getColliderIndex(point: Location, circleLocations : Location[]) {
    let minDistance = CIRCLE_RAD;
    let index = -1;

    let i = 0;
    while(i < circleLocations.length) {
        const dist = distanceBetweenLocations(point, circleLocations[i]);
        if(dist < minDistance) {
            minDistance = dist;
            index = i;
        }
        i++;
    }
    return index;
}