export function drawCircle(
    canvas: CanvasRenderingContext2D,
    x: number, y: number, r: number) {
    const circle = new Path2D();
    circle.arc(x, y, r, 0, 2 * Math.PI);
    canvas.fill(circle);
    canvas.stroke(circle);
}

export function drawLine(
    canvas: CanvasRenderingContext2D,
    fromX: number, fromY: number,
    toX: number, toY: number) {
        const line = new Path2D();
        line.moveTo(fromX, fromY);
        line.lineTo(toX, toY);
        canvas.stroke(line);
}