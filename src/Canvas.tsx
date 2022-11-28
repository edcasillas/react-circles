import { useEffect, useState } from "react";
import { useRef } from "react";
import { getColliderIndex } from "./collisions";
import { MAX_ZOOM, MIN_ZOOM, SCROLL_SENSITIVITY } from "./Constants";
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

    // Zoom
    const [zoom, setZoom] = useState(1);

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
        draw(context, locations, viewOffset, zoom);
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

    function getLocationInCanvas(location: Location) {
        return {
            x: location.x / zoom - viewOffset.x,
            y: location.y / zoom - viewOffset.y
        }
    }

    function onPointerDown(e : Event) {
        const pointerLocation = getPointerLocation(e);

        setIsDragging(true);
        setDragStart(pointerLocation);
        setTotalDragStart(pointerLocation);
        setShouldSpawnOnPointerUp(true);

        // TODO GetLocationWithZoomAndOffset
        const pointerLocationInCanvas = getLocationInCanvas(pointerLocation); //subtractLocations(pointerLocation, viewOffset);

        const colliderIndex = getColliderIndex(pointerLocationInCanvas, locations);
        if(colliderIndex >= 0) {
            setIndexBeingDragged(colliderIndex);
            setShouldSpawnOnPointerUp(false);
        } else {
            setShouldSpawnOnPointerUp(true);
        }
    }

    function onPointerUp(e : Event) {
        setIsDragging(false);

        if(shouldSpawnOnPointerUp) {
            const pointerLocation = getPointerLocation(e);
            const pointerLocationInCanvas = getLocationInCanvas(pointerLocation); //subtractLocations(pointerLocation, viewOffset);
            addCircleAt(pointerLocationInCanvas);
        }
        setIndexBeingDragged(-1);
    }

    function onPointerMove(e: Event) {
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

    function handleTouch(e: TouchEvent, singleTouchHandler: (ev: Event) => void) {
        if(e.touches.length === 1) {
            singleTouchHandler(e);
        } 
        // else the user is probably pinching; will get back to this later if I have time
    }

    function adjustZoom(zoomAmount: number) {
        if(isDragging) return;

        let currentZoom = zoom;
        
        currentZoom += zoomAmount;
        currentZoom = Math.min(currentZoom, MAX_ZOOM);
        currentZoom = Math.max(currentZoom, MIN_ZOOM);

        setZoom(currentZoom);
    }

    useEffect(()=>{
        console.log("Current zoom: " + zoom);
    }, [zoom])

    return <canvas 
                ref={canvasRef} 
                className={'main_canvas'} 

                onMouseDown={(e) => {onPointerDown(e.nativeEvent)}}
                onTouchStart={(e) => {handleTouch(e.nativeEvent, onPointerDown)}}
                
                onMouseUp={(e) => {onPointerUp(e.nativeEvent)}}
                onTouchEnd={(e) => {handleTouch(e.nativeEvent, onPointerUp)}}

                onMouseMove={(e)=>{onPointerMove(e.nativeEvent)}}
                onTouchMove={(e)=>{handleTouch(e.nativeEvent, onPointerMove)}}

                onWheel={(e)=>{adjustZoom(e.deltaY*SCROLL_SENSITIVITY)}}

                />;
};

export default Canvas;