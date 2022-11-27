import { useEffect, useState } from "react";
import { useRef } from "react";
import { draw } from "./figure-drawers";
import { getEventLocation as getPointerLocation } from "./input-utils";
import Location from "./Location";

const Canvas = () => {
    const [locations, setLocations] = useState<Location[]>([]);

    const [context, setContext] = useState<CanvasRenderingContext2D | undefined>(undefined);

    // Pan
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Location>({x: 0, y: 0});
    const [dragEnd, setDragEnd] = useState<Location>({x: 0, y: 0});
    const [viewOffset, setViewOffset] = useState<Location>( { x: 0, y: 0 });

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
        //ctx.translate(viewOffset.x, viewOffset.y);

        setContext(ctx);
        
    }, []);

    useEffect(()=>{
        if(!context) return;
        console.log('drawing here');
        draw(context, locations);
    });

    useEffect(()=> {
        if(!context) return;
        console.log("View Offset changed:");
        //console.log(viewOffset);
        //context.translate(viewOffset.x, viewOffset.y);

        context.translate(
            dragEnd.x - dragStart.x,
            dragEnd.y - dragStart.y
        )
        setDragStart(dragEnd);

        draw(context, locations);

        //context.resetTransform();
        //context.translate(-window.innerWidth / 2 + viewOffset.x, -window.innerHeight / 2 + viewOffset.y);
    }, [context, dragEnd]);

    function addCircleAt(location: Location) {
        const newLocations = locations;
        newLocations.push(location);
        setLocations(newLocations);
    }

    function onPointerDown(e : MouseEvent) {
        const pointerLocation = getPointerLocation(e);

        addCircleAt(pointerLocation);

        setIsDragging(true);
        setDragStart(pointerLocation);
    }

    function onPointerUp(e : MouseEvent) {
        setIsDragging(false);
    }

    function onPointerMove(e: MouseEvent) {
        if(isDragging) {
            const pointerLocation = getPointerLocation(e);
            setDragEnd(pointerLocation);
            /*setViewOffset(
                {
                    x: pointerLocation.x - dragStart.x,
                    y: pointerLocation.y - dragStart.y
                }
            );*/
        }
    }

    return <canvas 
                ref={canvasRef} 
                className={'main_canvas'} 

                onMouseDown={(e) => {onPointerDown(e.nativeEvent)}}
                // TODO onTouchStart
                
                onMouseUp={(e) => {onPointerUp(e.nativeEvent)}}
                // TODO onTouchEnd

                onMouseMove={(e)=>{onPointerMove(e.nativeEvent)}}
                // TODO onTouchMove

                />;
};

export default Canvas;