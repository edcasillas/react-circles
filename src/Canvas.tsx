import { useEffect, useState } from "react";
import { useRef } from "react";
import CirclesApi from "./CirclesApi";
import { getColliderIndex } from "./collisions";
import { ACTIVE_CIRCLE_COLOR, CIRCLE_COLOR, ENABLE_CALL_TO_BACKEND, ENABLE_ZOOM, MAX_ZOOM, MIN_ZOOM, SCROLL_SENSITIVITY } from "./Constants";
import { draw } from "./figure-drawers";
import { getPointerLocation } from "./input-utils";
import Location, { addLocations, distanceBetweenLocations, subtractLocations } from "./Location";

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
    const [zoom, setZoom] = useState(1); // Current actual zoom

    // Circle coloring / fetch from backend
    const [defaultCircleColor, setDefaultCircleColor] = useState(CIRCLE_COLOR);
    const [lastCircleColor, setLastCircleColor] = useState(ACTIVE_CIRCLE_COLOR);

    // Initialization
    useEffect(()=> {
        if(context) return;

        if(ENABLE_CALL_TO_BACKEND) {
            const api = new CirclesApi('http://127.0.0.1:1984');
            api.GetData(onBackendResponse);
        }

        const canvas = canvasRef.current;
        if(!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        setContext(ctx);
        
    }, []);

    // Just make sure everything goes smoothly if the window is resized.
    useEffect(()=> {
        function handleWindowResize() {
            const canvas = canvasRef.current;
            if(canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        }
        window.addEventListener('resize', handleWindowResize);
    });

    // Draw - every "update"/"tick"
    useEffect(()=>{
        if(!context) return;
        draw(context, locations, viewOffset, zoom, defaultCircleColor, lastCircleColor);
        //if(canvasRef.current) console.log("Canvas w/h: " + JSON.stringify({w: canvasRef.current.width, h: canvasRef.current.height}));
    });

    // Handle panning/dragging
    useEffect(()=> {
        if(!context) return;
        if(distanceBetweenLocations(dragEnd, dragStart) === 0) return;

        const dragAmount = subtractLocations(dragEnd, dragStart);

        if(indexBeingDragged >= 0) {
            const newLocations = locations;
            locations[indexBeingDragged] = {
                x: locations[indexBeingDragged].x + dragAmount.x,
                y: locations[indexBeingDragged].y + dragAmount.y
            };
            setLocations(newLocations);
        } else {
            const scaledDragAmount = {
                x: dragAmount.x * zoom,
                y: dragAmount.y * zoom
            };
            setViewOffset(addLocations(viewOffset, scaledDragAmount));
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
            x: (location.x - viewOffset.x) / zoom,
            y: (location.y - viewOffset.y) / zoom
        }
    }

    function onPointerDown(e : Event) {
        const pointerLocation = getPointerLocation(e);

        setIsDragging(true);

        let _shouldSpawnOnPointerUp = true;

        const pointerLocationInCanvas = getLocationInCanvas(pointerLocation);
        setDragStart(pointerLocationInCanvas);
        setTotalDragStart(pointerLocationInCanvas);

        //console.log("pointerLocation: " + JSON.stringify(pointerLocation) + "\npointerLocationInCanvas: " + JSON.stringify(pointerLocationInCanvas));

        const colliderIndex = getColliderIndex(pointerLocationInCanvas, locations);
        setIndexBeingDragged(colliderIndex);
        if(colliderIndex >= 0) {
            _shouldSpawnOnPointerUp = false;
        } 
        setShouldSpawnOnPointerUp(_shouldSpawnOnPointerUp);
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
            const pointerLocationInCanvas = getLocationInCanvas(pointerLocation);

            // Check if at any point of the panning operation the distance moved is greater than the spawning threshold, 
            // and in that case avoid a new circle to be created.
            const distanceMoved = subtractLocations(pointerLocationInCanvas, totalDragStart);

            //console.log("pointerLocation: " + JSON.stringify(pointerLocation) + "\npointerLocationInCanvas: " + JSON.stringify(pointerLocationInCanvas));

            if(Math.abs(distanceMoved.x) > dragThreshold.x || Math.abs(distanceMoved.y) > dragThreshold.y) {
                setShouldSpawnOnPointerUp(false);
            }

            setDragEnd(pointerLocationInCanvas);
        }
    }

    function handleTouch(e: TouchEvent, singleTouchHandler: (ev: Event) => void) {
        if(e.touches.length === 1) {
            singleTouchHandler(e);
        } 
        // else the user is probably pinching; will get back to this later if I have time
    }

    function adjustZoom(zoomAmount: number) {
        if(isDragging || !ENABLE_ZOOM) return;

        let currentZoom = zoom;

        let newZoom = currentZoom + zoomAmount;
        newZoom = Math.min(newZoom, MAX_ZOOM);
        newZoom = Math.max(newZoom, MIN_ZOOM); 

        setZoom(newZoom);
    }

    function onBackendResponse(defaultColor: string, lastColor: string, greeting: string) {
        console.log(defaultColor + ";" + lastColor + ";" + greeting);
        setDefaultCircleColor(defaultColor);
        setLastCircleColor(lastColor);
    }

    // DEBUG
    /*useEffect(()=>{
        console.log("defaultColor: " + defaultCircleColor);
        console.log("LastCircleColor: " + lastCircleColor);
    }, [defaultCircleColor, lastCircleColor])*/

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