import Location from "./Location";

const circleRadius = 25;

export function drawCircle(
    canvas: CanvasRenderingContext2D,
    location: Location, r: number = circleRadius) {
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

export function draw(canvas: CanvasRenderingContext2D, locations: Location[]) {
    canvas.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // First draw all the lines so they are below the circles
    for(let i = 1; i < locations.length; i++) {
        drawLine(canvas, locations[i-1], locations[i]);
    }

    locations.forEach((location)=>{drawCircle(canvas, location)});
}