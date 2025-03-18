

export function GroupTitleColorModal({colorModal, colorModalRef, groupColor, onUpdateGroup}){

    const colors = ['#037F4C', '#00C875', '#9CD326', '#CAB641', '#FFCB00', 
        '#784BD1', '#9D50DD', '#007EB5', '#579BFC', '#66CCFF', '#BB3354', '#DF2F4A',
    '#FF007F', '#FF5AC4', '#FF642E', '#FDAB3D', '#7F5347', '#C4C4C4', '#757575']

    const colorOptions = colors.filter(color=> color !== groupColor)

    return(
        <section className="group-title-color-modal" 
        ref={colorModalRef}
        style={{visibility: colorModal? 'visible' : 'hidden'}}>
            <ul>
                {
                    colorOptions.map(color=>{

                        return(
                            <li key={color} onClick={()=>onUpdateGroup(color)}>
                                <div className= "color-option" 
                                    style={{backgroundColor: color}}/>
                            </li>
                        )
                    })
                }
            </ul>
        </section>
    )
}