import React, { useEffect } from "react";
import { useRef } from "react";
import { drawCircle, drawLine } from "./figure-drawers";

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(()=> {
        //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
        //youtube.com/watch?v=K8HICLm-Jj0
        const canvas = canvasRef.current;
        if(!canvas) return;

        canvas.width = 640;
        canvas.height = 480;

        const context = canvas.getContext('2d');
        if(!context) return;

        context.fillStyle = 'blue';
        /*context.fillRect(0,0,100,100);
        context.strokeRect(100,100,50,50);*/

        drawLine(context, 100,35,200,55);
        drawCircle(context, 100, 35, 10);
        drawCircle(context, 200, 55, 10);
        
    }, []);

    return <canvas ref={canvasRef} />;
};

export default Canvas;