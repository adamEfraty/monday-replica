import Popover from '@mui/material/Popover';
import { useState } from 'react';
import { updateGroup } from '../../../store/actions/boards.actions';
const colors = [
    "#FF5733", "#FFC300", "#DAF7A6", "#33FF57", "#33FFF3",
    "#3375FF", "#8E44AD", "#FF33A6", "#FF8C00", "#2ECC71",
    "#3498DB", "#9B59B6", "#F1C40F", "#E74C3C",
];

export function Color({ closeAll, color, boardId, groupId }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedColor, setSelectedColor] = useState(color);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    async function handleColorSelect(color) {
        setSelectedColor(color);
        const updatedColor = { color: color }
        await updateGroup(boardId, groupId, updatedColor)

        handleClose();
        closeAll()
    };


    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div className='flex-inside-color'>

            <div
                style={{
                    backgroundColor: selectedColor || 'gray',
                    color: 'white',

                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    width: '20px',
                    height: '20px'
                }}
                onClick={handleClick}
            >
            </div>

            <div>choose a color</div>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div style={{ display: 'flex', padding: '10px', width: '250px', flexWrap: 'wrap' }}>
                    {colors.map((color) => (
                        <div
                            key={color}
                            onClick={() => handleColorSelect(color)}
                            style={{
                                backgroundColor: color,
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                margin: '5px',
                                cursor: 'pointer',
                                border: selectedColor === color ? '2px solid black' : 'none',
                            }}
                        />
                    ))}
                </div>
            </Popover>
        </div>
    );
}
