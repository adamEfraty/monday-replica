import { useState } from "react";

export function Status({ info }) {
    const [modal, setModal] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(info);

    // Function to set the background color based on the status
    function color(status) {
        if (status === 'IN PROGRESS') return '#fdab3d'; // orangeish
        if (status === 'STUCK') return '#e2445c'; // red
        if (status === 'DONE') return '#00c875'; // green
        return 'coral'; // default color for other statuses
    }

    // Inline style for the status background color
    const style = { backgroundColor: color(currentStatus), width: '100%', height: '100%' };

    // Function to handle the color change when a user clicks a color box
    const handleColorClick = (status) => {
        setCurrentStatus(status);
        setModal(false); // Close the modal after the color is selected
    };

    // Function to close the modal when clicking outside of it
    const handleOutsideClick = () => {
        setModal(false); // Close modal when clicking outside of it
    };

    return (
        <div className="item white has-modal" onClick={() => setModal(true)} style={style}>
            {currentStatus}

            {/* Modal for selecting the status */}
            {modal && (
                <div className="modal-backdrop" onClick={handleOutsideClick} style={{ zIndex: 1000 }}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ zIndex: 1001 }}>
                        <h3>Choose a Status</h3>
                        <div className="color-list">
                            <div
                                className="color-box"
                                onClick={() => handleColorClick('IN PROGRESS')}
                                style={{ backgroundColor: '#fdab3d' }}
                            >
                                IN PROGRESS
                            </div>
                            <div
                                className="color-box"
                                onClick={() => handleColorClick('STUCK')}
                                style={{ backgroundColor: '#e2445c' }}
                            >
                                STUCK
                            </div>
                            <div
                                className="color-box"
                                onClick={() => handleColorClick('DONE')}
                                style={{ backgroundColor: '#00c875' }}
                            >
                                DONE
                            </div>

                        </div>
                        <button className="btn" onClick={() => setModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
