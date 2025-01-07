const Member = ({ info, onTaskUpdate }) => {
    const style = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        // To position images over each other
        zIndex: 10,            // Ensure that images are stacked properly
        // Slight horizontal offset for overlap
    };

    return (
        <div
            onClick={() => onTaskUpdate("member update")}
            style={{ padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} // Wrap with relative container
        >
            {info.map((member, idx) => {
                const stackedStyle = {
                    ...style,
                    zIndex: info.length - idx, // Ensure the last image is on top
                    transform: `translateX(${idx * -12}px)`,
                    border: `2px solid ${member.color}` // Adjust horizontal overlap (X axis)
                };

                return (
                    <img
                        key={member.name}
                        src={member.image}
                        alt="img"
                        style={stackedStyle}
                    />
                );
            })}
        </div>
    );
};

export default Member;
