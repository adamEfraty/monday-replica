import React, { useState } from 'react';

function Priority({ info, onTaskUpdate }) {
    const [modal, setModal] = useState(false);
    const [currentPriority, setCurrentPriority] = useState(info);

    // Function to set the background color based on priority
    function color(priority) {
        if (priority === 'HIGH') return '#fdab3d'; // orangeish
        if (priority === 'MEDIUM') return '#579bfc'; // blue
        if (priority === 'LOW') return '#4eb648'; // green
        return 'coral'; // default color for other priorities
    }

    // Inline style for the priority background color
    const style = { backgroundColor: color(currentPriority), width: '100%', height: '100%' };


    const handlePriorityClick = (priority) => {
        setCurrentPriority(priority);
        setModal(false);
    };


    const handleOutsideClick = () => {
        setModal(false);
    };

    return (
        <div className="item white has-modal" onClick={() => setModal(true)} style={style}>
            {currentPriority}

            {modal && (
                <div className="modal-backdrop" onClick={handleOutsideClick} style={{ zIndex: 1000 }}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ zIndex: 1001 }}>
                        <h3>Choose a Priority</h3>
                        <div className="color-list">
                            <div
                                className="color-box"
                                onClick={() => handlePriorityClick('HIGH')}
                                style={{ backgroundColor: '#fdab3d' }}
                            >
                                HIGH
                            </div>
                            <div
                                className="color-box"
                                onClick={() => handlePriorityClick('MEDIUM')}
                                style={{ backgroundColor: '#579bfc' }}
                            >
                                MEDIUM
                            </div>
                            <div
                                className="color-box"
                                onClick={() => handlePriorityClick('LOW')}
                                style={{ backgroundColor: '#4eb648' }}
                            >
                                LOW
                            </div>

                        </div>
                        <button className="btn" onClick={() => setModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Priority;
