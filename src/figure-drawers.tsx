import { ACTIVE_CIRCLE_COLOR, CIRCLE_COLOR, CIRCLE_RAD } from "./Constants";
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

export function draw(canvas: CanvasRenderingContext2D, locations: Location[], viewOffset : Location, zoom: number, zoomMultiplier: number) {
    canvas.scale(zoomMultiplier, zoomMultiplier);

    // Clear everything because we are going to redraw
    canvas.clearRect(
        -viewOffset.x / zoom, 
        -viewOffset.y / zoom, 
        
        Math.max(window.innerWidth - viewOffset.x, window.innerWidth) / zoom, 
        Math.max(window.innerHeight - viewOffset.y, window.innerHeight) / zoom);

    // DEBUG -------------------------------------
    canvas.font = `${48}px ${"courier"}`;
    canvas.fillText("By Ed Casillas - Zoom: " + zoom, 0, 48);

    // Original rect
    canvas.strokeStyle='green';
    canvas.strokeRect(0,0,window.innerWidth / zoom, window.innerHeight / zoom);

    // Clear rect
    canvas.strokeStyle='red';
    canvas.strokeRect(
        -viewOffset.x / zoom, 
        -viewOffset.y / zoom, 
        
        Math.max(window.innerWidth - viewOffset.x, window.innerWidth) / zoom, 
        Math.max(window.innerHeight - viewOffset.y, window.innerHeight) / zoom);

    // -------------------------------------------

    
    canvas.strokeStyle = 'black'

    // First draw all the lines so they are below the circles
    for(let i = 1; i < locations.length; i++) {
        drawLine(canvas, locations[i-1], locations[i]);
    }

    canvas.fillStyle = CIRCLE_COLOR;
    locations.forEach((location)=>{drawCircle(canvas, location)});

    // Draw the last circle again, but in red so the user knows where the next one is coming to
    if(locations.length > 0) {
        canvas.fillStyle = ACTIVE_CIRCLE_COLOR;
        drawCircle(canvas, locations[locations.length -1]);
    }
}