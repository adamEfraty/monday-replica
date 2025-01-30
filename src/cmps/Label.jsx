
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function Label({ label, id }) {


    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,


    };
    return (
        <div ref={setNodeRef} {...listeners} {...attributes}  
        style={style}
        key={`label-${label.id}`}
        className="label">
            <p>{label.name}</p>
            <i class="fa-solid fa-ellipsis"></i>
        </div>
    )

}