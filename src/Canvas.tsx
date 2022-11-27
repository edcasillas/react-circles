import React, { useEffect } from "react";
import { useRef } from "react";
import { drawCircle, drawLine } from "./figure-drawers";
import { getEventLocation } from "./input-utils";

interface Location {
    x: number;
    y: number;
}

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(()=> {
        //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
        //youtube.com/watch?v=K8HICLm-Jj0
        // https://codepen.io/chengarda/pen/wRxoyB
        const canvas = canvasRef.current;
        if(!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        canvas.addEventListener('mousedown', onPointerDown);
        canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))

        const context = canvas.getContext('2d');
        if(!context) return;

        context.fillStyle = 'blue';

        drawLine(context, 100,35,200,55);
        drawCircle(context, 100, 35, 10);
        drawCircle(context, 200, 55, 10);
        
    }, []);

    function onPointerDown(e : MouseEvent) {
        /*isDragging = true
        dragStart.x = getEventLocation(e).x/cameraZoom - cameraOffset.x
        dragStart.y = getEventLocation(e).y/cameraZoom - cameraOffset.y*/
        const pointerLocation = getEventLocation(e);
        console.log(pointerLocation);
    }

    function handleTouch(e : TouchEvent, singleTouchHandler : (this: HTMLCanvasElement, ev: MouseEvent) => any) {
        /*if ( e.touches.length == 1 ) {
            singleTouchHandler(e)
        }
        else if (e.type == "touchmove" && e.touches.length == 2) {
            isDragging = false
            handlePinch(e)
        }*/
    }

    return <canvas ref={canvasRef} className={'main_canvas'} />;
};

export default Canvas;