import { X } from 'lucide-react';

interface Props {
    id: string;
    title: string;
    children: React.ReactNode;
}

function Modal({ id, title, children }: Props) {
    return <dialog id={id} className='modal'>
        <div className='modal-box '>
            <form method='dialog'>
                <button className='absolute right-2 top-2 btn'><X /></button>
            </form>
            <h2 className='text-2xl'>{title}</h2>
            {children}
        </div>
        <form method="dialog" className="modal-backdrop">
            <button></button>
        </form>
    </dialog>
}

export default Modal