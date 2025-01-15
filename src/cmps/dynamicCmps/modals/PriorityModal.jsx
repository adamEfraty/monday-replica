

export function PriorityModal({ onPriorityChange }) {

    //temporary priorities selection


    const priorities = [{ text: 'Low', color: '#86B6FB' }, { text: 'Medium', color: '#5559DF' },
    { text: 'High', color: '#401694' }, { text: 'Critical ⚠️', color: '#333333' }, { text: ' ', color: '#C4C4C4' }]


    return (
        <section className="priority-modal">
            {/* list of quick access prioritise */}
            <ul className="item-flex">
                {
                    priorities.map((priority, index) =>
                        <li key={index} className="modal-item"
                            onClick={() => {
                                console.log(priority)
                                onPriorityChange(priority)
                            }}
                            style={{ backgroundColor: priority.color }}>
                            <p>{priority.text}</p>
                        </li>
                    )
                }
            </ul>

        </section>
    )
}