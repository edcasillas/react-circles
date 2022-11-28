import { useEffect, useState } from "react";
import { useRef } from "react";
import { draw } from "./figure-drawers";
import { getPointerLocation } from "./input-utils";
import Location, { addLocations, subtractLocations } from "./Location";

const dragThreshold = {x:5, y: 5};

const Canvas = () => {
    const [locations, setLocations] = useState<Location[]>([]);

    const [context, setContext] = useState<CanvasRenderingContext2D | undefined>(undefined);

    // Pan
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Location>({x: 0, y: 0});
    const [dragEnd, setDragEnd] = useState<Location>({x: 0, y: 0});
    const [totalDragStart, setTotalDragStart] = useState<Location>({x: 0, y: 0});
    const [viewOffset, setViewOffset] = useState<Location>( { x: 0, y: 0 });
    const [shouldSpawnOnPointerUp, setShouldSpawnOnPointerUp] = useState(true);

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

    useEffect(()=>{
        if(!context) return;
        draw(context, locations, viewOffset);
    });

    // Handle panning
    useEffect(()=> {
        if(!context) return;
        const dragAmount = subtractLocations(dragEnd, dragStart);
        setViewOffset(addLocations(viewOffset, dragAmount));

        context.translate(
            dragAmount.x,
            dragAmount.y
        )
        setDragStart(dragEnd);
    }, [context, dragEnd]);

    function addCircleAt(location: Location) {
        const newLocations = locations;
        newLocations.push(location);
        setLocations(newLocations);
    }

    function onPointerDown(e : MouseEvent) {
        const pointerLocation = getPointerLocation(e);

        setIsDragging(true);
        setDragStart(pointerLocation);
        setTotalDragStart(pointerLocation);
        setShouldSpawnOnPointerUp(true);
    }

    function onPointerUp(e : MouseEvent) {
        setIsDragging(false);

        if(shouldSpawnOnPointerUp) {
            const pointerLocation = getPointerLocation(e);
            const pointerLocationInCanvas = subtractLocations(pointerLocation, viewOffset);
            addCircleAt(pointerLocationInCanvas);
        }
    }

    function onPointerMove(e: MouseEvent) {
        if(isDragging) {
            const pointerLocation = getPointerLocation(e);

            const distanceMoved = subtractLocations(pointerLocation, totalDragStart);
            if(Math.abs(distanceMoved.x) > dragThreshold.x || Math.abs(distanceMoved.y) > dragThreshold.y) {
                setShouldSpawnOnPointerUp(false);
            }

            setDragEnd(pointerLocation);
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