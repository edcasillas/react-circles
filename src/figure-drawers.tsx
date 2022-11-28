import { CIRCLE_RAD } from "./Constants";
import Location from "./Location";

export function drawCircle(
    canvas: CanvasRenderingContext2D,
    location: Location, r: number = CIRCLE_RAD ) {
    const circle = new Path2D();
    circle.arc(location.x, location.y, r, 0, 2 * Math.PI);
    canvas.fill(circle);
    canvas.stroke(circle);
}

export function drawLine(
    canvas: CanvasRenderingContext2D,
    from: Location,
    to: Location) {
        const line = new Path2D();
        line.moveTo(from.x, from.y);
        line.lineTo(to.x, to.y);
        canvas.stroke(line);
}

export function draw(canvas: CanvasRenderingContext2D, locations: Location[], viewOffset : Location) {
    console.log("");
    console.log("window");
    console.log({x: window.innerWidth,y: window.innerHeight});
    console.log("Offset");
    console.log(viewOffset);
    console.log("Will clear");
    const clearEnd = {x:-viewOffset.x, y:0, w: Math.max(window.innerWidth - viewOffset.x, window.innerWidth),h: Math.max(window.innerHeight - viewOffset.y, window.innerHeight)};
    console.log(clearEnd);
    console.log("");

    canvas.clearRect(
        -viewOffset.x, -viewOffset.y, 
        Math.max(window.innerWidth - viewOffset.x, window.innerWidth), Math.max(window.innerHeight - viewOffset.y, window.innerHeight));

    canvas.strokeRect(
        0, 0, 
        window.innerWidth, window.innerHeight);

    // First draw all the lines so they are below the circles
    for(let i = 1; i < locations.length; i++) {
        drawLine(canvas, locations[i-1], locations[i]);
    }

    locations.forEach((location)=>{drawCircle(canvas, location)});
}