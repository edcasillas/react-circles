import { ACTIVE_CIRCLE_COLOR, CIRCLE_COLOR, CIRCLE_RAD, DEBUG_DRAW } from "./Constants";
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

export function draw(
    canvas: CanvasRenderingContext2D, 
    locations: Location[], 
    viewOffset : Location, 
    zoom: number, 
    zoomMultiplier: number,
    defaultColor: string = CIRCLE_COLOR,
    lastColor: string = ACTIVE_CIRCLE_COLOR,
    ) {
    canvas.scale(zoomMultiplier, zoomMultiplier);

    const clrZone = {
        x: -viewOffset.x / zoom, 
        y: -viewOffset.y / zoom, 
        
        w: window.innerWidth / zoom, //Math.max(window.innerWidth / zoom - viewOffset.x, window.innerWidth / zoom), 
        h: window.innerHeight / zoom //Math.max(window.innerHeight / zoom - viewOffset.y, window.innerHeight / zoom)
    };

    // Clear everything because we are going to redraw
    canvas.clearRect(clrZone.x, clrZone.y, clrZone.w, clrZone.h);

    // DEBUG -------------------------------------
    if(DEBUG_DRAW) {
        console.log("window: " + JSON.stringify({w: window.innerWidth, h: window.innerHeight}) + 
                    "\nzoomed at " + zoom + " : " + JSON.stringify({w: window.innerWidth / zoom, h: window.innerHeight / zoom}) +
                    "\nClear zone:" + JSON.stringify(clrZone) +
                    "\nOffset:" + JSON.stringify({x: viewOffset, })
                    );

        canvas.font = `${48}px ${"courier"}`;
        canvas.fillText("By Ed Casillas - Zoom: " + zoom, 0, 48);

        // Original rect
        canvas.strokeStyle='green';
        canvas.strokeRect(0,0,window.innerWidth / zoom, window.innerHeight / zoom);

        // Clear rect
        canvas.strokeStyle='red';
        canvas.moveTo(clrZone.x, clrZone.y);
        canvas.lineTo(clrZone.x + clrZone.w, clrZone.y + clrZone.h);
        canvas.stroke();
        canvas.strokeRect(clrZone.x, clrZone.y, clrZone.w, clrZone.h);
    }
    
    canvas.strokeStyle = 'black'

    // First draw all the lines so they are below the circles
    for(let i = 1; i < locations.length; i++) {
        drawLine(canvas, locations[i-1], locations[i]);
    }

    canvas.fillStyle = defaultColor;
    locations.forEach((location)=>{drawCircle(canvas, location)});

    // Draw the last circle again, but in red so the user knows where the next one is coming to
    if(locations.length > 0) {
        canvas.fillStyle = lastColor;
        drawCircle(canvas, locations[locations.length -1]);
    }
}