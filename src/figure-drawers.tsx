import Location from "./Location";

export function drawCircle(
    canvas: CanvasRenderingContext2D,
    location: Location, r: number) {
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