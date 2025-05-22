import { X } from 'lucide-react';

function useModal() {
    const showModal = (modal_id = '') =>
        document.getElementById(modal_id).showModal()

    const Modal = ({ id = '', title = '', children }) =>
        <dialog id={id} className='modal'>
            <div className='modal-box '>
                <form method='dialog'>
                    <button className='absolute right-2 top-2'><X /></button>
                </form>
                <h2 className='text-2xl'>{title}</h2>
                {children}
            </div>
            <form method="dialog" className="modal-backdrop">
                <button></button>
            </form>
        </dialog>

    return { showModal, Modal };
}

export default useModal;