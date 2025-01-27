
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function Label({ label, id }) {


    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,


    };
    return (
        <div ref={setNodeRef} {...listeners} {...attributes} style={{ ...style, textAlign: 'center' }} key={`label-${label.id}`}>
            {label.name}
        </div>
    )

}