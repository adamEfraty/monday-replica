import { utilService } from "../../../services/util.service"
import { boardService } from "../../../services/board"

export function GroupTitleColorModal({colorModal, colorModalRef, groupColor, onUpdateGroup}){

    const colors = boardService.getGroupsColors()
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