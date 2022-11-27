import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { drawCircle, drawLine } from "./figure-drawers";
import { getEventLocation } from "./input-utils";
import Location from "./Location";

const Canvas = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [clicks, setClicks] = useState(0);
    const [debugLocation, setDebugLocation] = useState<Location>({x: 0, y: 0});
    const [context, setContext] = useState<CanvasRenderingContext2D | undefined>(undefined);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(()=> {
        //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
        //youtube.com/watch?v=K8HICLm-Jj0
        // https://codepen.io/chengarda/pen/wRxoyB
        const canvas = canvasRef.current;
        if(!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        ctx.fillStyle = 'blue';

        drawLine(ctx, 100,35,200,55);
        drawCircle(ctx, 100, 35, 10);
        drawCircle(ctx, 200, 55, 10);

        setContext(ctx);
        
    }, []);

    useEffect(()=> {
        console.log('useEffect: clicked ' + clicks + ' times');
        console.log(debugLocation);

        if(context) {
            drawCircle(context, debugLocation.x, debugLocation.y, 25);
        }

    }, [clicks, debugLocation]);

    function onPointerDown(e : MouseEvent) {
        /*isDragging = true
        dragStart.x = getEventLocation(e).x/cameraZoom - cameraOffset.x
        dragStart.y = getEventLocation(e).y/cameraZoom - cameraOffset.y*/
        setClicks(clicks + 1);
        
        const pointerLocation = getEventLocation(e);
        setDebugLocation(pointerLocation);
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

    return <canvas 
                ref={canvasRef} 
                className={'main_canvas'} 
                onMouseDown={(e) => {onPointerDown(e.nativeEvent)}}
                />;
};

export default Canvas;