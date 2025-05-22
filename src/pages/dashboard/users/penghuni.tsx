import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from '@firebase/firestore';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ellipsis, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useSWR, { mutate } from 'swr';
import BoxRotate from '../../../components/boxRotate';
import Modal from '../../../components/modal';
import Table from '../../../components/table';
import { db } from '../../../lib/firebase';
import { $ } from '../../../lib/utils';
import { schemaPenghuni, TSchemaPenghuni } from '../../../schema';

const fetcher = async () => {
    const querySnapshot = await getDocs(collection(db, 'penghuni'));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as TSchemaPenghuni
    }));
};
type TypeSubmit = 'add' | 'edit' | 'delete'
const useHooks = () => {
    const { watch, setValue, register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
        resolver: yupResolver(schemaPenghuni)
    })
    const [typeSubmit, setTypeSubmit] = useState<TypeSubmit>()
    const { data, isLoading } = useSWR('penghuni', fetcher)

    const total = watch('image')
    useEffect(() => {
        if (!total?.length) { return }

        // @ts-ignore
        if (total[0].size > 100 * 1024) {
            setValue('imageChange', '')
            setValue('image', '')
            console.log(watch('imageChange'))
            toast.error('max size 100kb')
            return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
            // @ts-ignore
            setValue('imageChange', reader.result)
        }
        // @ts-ignore
        reader.readAsDataURL(total[0])
    }, [total])

    const openModal = (data?: TSchemaPenghuni, type: TypeSubmit = 'add') => {
        reset()
        if (data) {
            setValue('id', data.id)
            setValue('nama', data.nama)
            setValue('no_hp', data.no_hp)
            setValue('imageChange', data.image)
            setTypeSubmit(type)
        }
        // @ts-ignore
        $('#modal_penghuni').showModal()
    }

    const onSubmit = handleSubmit(async (data) => {
        try {
            const newData = {
                ...data,
                image: watch('imageChange') ?? '',
                created_at: serverTimestamp()
            }
            if (typeSubmit == 'add') {
                await addDoc(collection(db, 'penghuni'), newData);
                toast.success('penghuni added!')
            }
            else if (typeSubmit == 'edit') {
                await updateDoc(doc(db, 'penghuni', data.id!), newData);
                toast.success('penghuni edited!')
            }
            else if (typeSubmit == 'delete') {
                await deleteDoc(doc(db, 'penghuni', data.id!));
                toast.success('penghuni deleted!')
            }
        } catch (e) {
            toast.error(`error ${typeSubmit} penghuni`)
        }
        mutate('penghuni')
        // @ts-ignore
        $('#modal_penghuni').close()
    })
    return {
        setValue, register, onSubmit, isSubmitting,
        isLoading, data, watch, errors, openModal,
        typeSubmit
    }
}

function Penghuni() {
    const { data, register, onSubmit, isSubmitting,
        isLoading, watch, openModal, typeSubmit,
    } = useHooks()

    if (isLoading) {
        return <div className='center' id='loading'>
            <BoxRotate />
        </div>
    }

    return (<>
        <div>
            <div className='bottom-10 right-10 fixed z-10'>
                <button className='btn btn-primary'
                    // @ts-ignore
                    onClick={openModal}
                ><Plus />Penghuni</button>
            </div>
            <div className="overflow-x-auto mt-4">
                <Table rows={['#', 'Penghuni', 'No Hp', '']}>
                    {
                        data?.map((data, i) => <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{data.nama}</td>
                            <td>{data.no_hp}</td>
                            <td>
                                <div className="dropdown dropdown-end">
                                    <button id='dropdown' className="p-0"><Ellipsis /></button>
                                    <ul className="menu dropdown-content bg-base-300  z-1 w-48  p-2">
                                        <li><button id='edit' onClick={() => openModal(data, 'edit')}>Edit</button></li>
                                        <li><button id='delete' onClick={() => openModal(data, 'delete')}>Delete</button></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>)
                    }
                </Table>
            </div>
        </div>
        <Modal id='modal_penghuni' title={`${typeSubmit} penghuni`}>
            <form className='mt-6 flex gap-4 flex-col' onSubmit={onSubmit}>
                <label className='text-sm'>Nama penghuni:
                    <input disabled={isSubmitting || typeSubmit == 'delete'} {...register('nama')} className="input w-full" type="text" placeholder="nama" />
                </label>
                <label className='text-sm'>No HP penghuni:
                    <input disabled={isSubmitting || typeSubmit == 'delete'} {...register('no_hp')} className="input w-full" type="number" placeholder="no hp" />
                </label>
                <label className='text-sm'>Photo penghuni: *max 100kb
                    {
                        <img
                            src={watch('imageChange') || watch('image') || '/emptyImage.png'}
                            alt="Image Preview"
                            className={'mt-2 w-full h-32 object-cover'}
                        />
                    }
                    <div className='flex items-center gap-4'>
                        <input disabled={isSubmitting || typeSubmit == 'delete'} {...register('image')} className="file-input w-full" type="file" accept='image/*' />
                    </div>
                </label>
                <button className='btn' disabled={isSubmitting} type='submit'>Submit</button>
            </form>
        </Modal>
    </>);
}

export default Penghuni;