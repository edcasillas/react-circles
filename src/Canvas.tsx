import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { drawCircle, drawLine } from "./figure-drawers";
import { getEventLocation } from "./input-utils";
import Location from "./Location";

const Canvas = () => {
    const [previousLocation, setPreviousLocation] = useState<Location>({x: -1, y: -1});
    const [currentLocation, setCurrentLocation] = useState<Location>({x: -1, y: -1});

    const [context, setContext] = useState<CanvasRenderingContext2D | undefined>(undefined);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(()=> {
        //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
        //youtube.com/watch?v=K8HICLm-Jj0
        // https://codepen.io/chengarda/pen/wRxoyB
        // https://www.swilliams.io/w/react-on-itch/
        const canvas = canvasRef.current;
        if(!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        ctx.fillStyle = 'blue';

        setContext(ctx);
        
    }, []);

    useEffect(()=> {
        if(!context) return;
        const hasPrevious = previousLocation.x >= 0 && previousLocation.y >= 0;
        if(hasPrevious) {
            drawLine(context, previousLocation, currentLocation);
            drawCircle(context, previousLocation, 25);
        }
        drawCircle(context, currentLocation, 25);

    }, [currentLocation, context, previousLocation]);

    function onPointerDown(e : MouseEvent) {
        drawNewCircleAtPosition(e);
        setPreviousLocation(currentLocation);
        const pointerLocation = getEventLocation(e);
        setCurrentLocation(pointerLocation);
    }

    function handleTouch(e : TouchEvent, singleTouchHandler : (this: HTMLCanvasElement, ev: MouseEvent) => any) {
        
    }

    function drawNewCircleAtPosition(e : MouseEvent) {
        setPreviousLocation(currentLocation);
        const pointerLocation = getEventLocation(e);
        setCurrentLocation(pointerLocation);
    }

    return <canvas 
                ref={canvasRef} 
                className={'main_canvas'} 
                onMouseDown={(e) => {onPointerDown(e.nativeEvent)}}
                />;
};

export default Canvas;