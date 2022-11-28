import { useEffect, useState } from "react";
import { useRef } from "react";
import { getColliderIndex } from "./collisions";
import { draw } from "./figure-drawers";
import { getPointerLocation } from "./input-utils";
import Location, { addLocations, subtractLocations } from "./Location";

const dragThreshold = {x:5, y: 5};

const Canvas = () => {
    const [locations, setLocations] = useState<Location[]>([]); // Array with the position of each circle in the canvas
    
    // the canvas itself
    const [context, setContext] = useState<CanvasRenderingContext2D | undefined>(undefined);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Pan
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Location>({x: 0, y: 0});
    const [dragEnd, setDragEnd] = useState<Location>({x: 0, y: 0});
    const [totalDragStart, setTotalDragStart] = useState<Location>({x: 0, y: 0});
    const [viewOffset, setViewOffset] = useState<Location>( { x: 0, y: 0 });
    const [shouldSpawnOnPointerUp, setShouldSpawnOnPointerUp] = useState(true);

    // Drag
    const [indexBeingDragged, setIndexBeingDragged] = useState(-1);

    // Initialization
    useEffect(()=> {
        const canvas = canvasRef.current;
        if(!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        setContext(ctx);
        
    }, []);

    // Draw - every "update"/"tick"
    useEffect(()=>{
        if(!context) return;
        draw(context, locations, viewOffset);
    });

    // Handle panning/dragging
    useEffect(()=> {
        if(!context) return;
        const dragAmount = subtractLocations(dragEnd, dragStart);

        if(indexBeingDragged >= 0) {
            const newLocations = locations;
            locations[indexBeingDragged] = {
                x: locations[indexBeingDragged].x + dragAmount.x,
                y: locations[indexBeingDragged].y + dragAmount.y
            };
            setLocations(newLocations);
        } else {
            setViewOffset(addLocations(viewOffset, dragAmount));
            context.translate(
                dragAmount.x,
                dragAmount.y
            )
        }

        
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

        const pointerLocationInCanvas = subtractLocations(pointerLocation, viewOffset);
        const colliderIndex = getColliderIndex(pointerLocationInCanvas, locations);
        if(colliderIndex >= 0) {
            setIndexBeingDragged(colliderIndex);
            setShouldSpawnOnPointerUp(false);
        } else {
            setShouldSpawnOnPointerUp(true);
        }
    }

    function onPointerUp(e : MouseEvent) {
        setIsDragging(false);

        if(shouldSpawnOnPointerUp) {
            const pointerLocation = getPointerLocation(e);
            const pointerLocationInCanvas = subtractLocations(pointerLocation, viewOffset);
            addCircleAt(pointerLocationInCanvas);
        }
        setIndexBeingDragged(-1);
    }

    function onPointerMove(e: MouseEvent) {
        if(isDragging) {
            const pointerLocation = getPointerLocation(e);

            // Check if at any point of the panning operation the distance moved is greater than the spawning threshold, 
            // and in that case avoid a new circle to be created.
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