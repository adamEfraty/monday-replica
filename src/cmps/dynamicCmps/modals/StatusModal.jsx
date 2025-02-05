import { getSvg } from "../../../services/svg.service.jsx"


export function StatusModal({ onStatusChange, labelWidth }) {

    //temporary statuses selection
    const statuses = [{ text: 'Done', color: '#00C875' }, { text: 'Working on it', color: '#FDAB3D' },
    { text: 'Stuck', color: '#DF2F4A' }, { text: '', color: '#C4C4C4' }]


    return (
        <section className="status-modal"
        style={{"--cell-width": `${labelWidth}px`}}>
            <div className="white-arrow">{getSvg('white-arrow')}</div>
            
            {/* list of quick access statuses */}
            <ul >
                {
                    statuses.map(status =>
                        <li key={status.text}
                            onClick={() => onStatusChange(status)}
                            style={{ backgroundColor: status.color }}>
                            <p>{status.text}</p>
                        </li>
                    )
                }
            </ul>
        </section>
    )
}