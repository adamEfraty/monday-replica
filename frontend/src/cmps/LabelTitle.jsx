import { useSelector } from "react-redux";
import { useState, useRef, useEffect, useCallback } from "react";
import { onUpdateReduxLabelWidth, onUpdateLocalLabelWidth } from "../store/actions/boards.actions.js";



export function LabelTitle({ label, boardId }) {

    const [isDragging, setIsDragging] = useState(false)
    const labelRef = useRef(null)
    // so no every width change there will be call to storage
    const board = useSelector((state) => 
        state.boardModule.boards.find(board=>board._id === boardId));
    const [hoverLable, setHoverLabel] = useState(false)

    // controls hoverlabel state
    useEffect(() => {
        const handleHoverLabel = (event) => {
            if (labelRef.current) 
                labelRef.current.contains(event.target) 
                ? setHoverLabel(true)
                : setHoverLabel(false)
        }

        document.addEventListener("mouseover", handleHoverLabel);
        return () => document.removeEventListener("mouseout", handleHoverLabel);
    }, []);

    // Ensure `handleMouseMove` is stable
    const handleMouseMove = useCallback((event) => {
        if (!isDragging || !labelRef.current) return
        const labelBoundaries = labelRef.current.getBoundingClientRect()
        const newWidth = event.clientX - labelBoundaries.x + 50 // the 50 is becuse of the check box
        const MIN_WIDTH = 250
        onUpdateReduxLabelWidth(board, boardId, label.id, Math.max(newWidth, MIN_WIDTH))
    }, [isDragging, board, boardId, label.id])

    // Ensure `handleMouseUp` is stable
    const handleMouseUp = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false)
        onUpdateLocalLabelWidth(boardId, label.id, label.width)
    }, [isDragging, boardId, label.id, label.width])

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        } else {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        };
    }, [isDragging, handleMouseMove, handleMouseUp])

    // Handle mouse down correctly
    const handleMouseDown = () => {
        setIsDragging(true)
    }

    return (
        <section ref={labelRef}
        className="label-inner-title"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}>
            <p>{label.name}</p>
            <div className="drag-label"
            style={hoverLable ? {opacity: '1'} : {opacity: '0'}}
            onPointerDown={e => e.stopPropagation()}
            onMouseDown={handleMouseDown}/>
        </section>
    )
}