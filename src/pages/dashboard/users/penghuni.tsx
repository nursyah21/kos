import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from '@firebase/firestore';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ellipsis, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router';
import { toast } from 'sonner';
import { mutate } from 'swr';
import BoxRotate from '../../../components/boxRotate';
import Modal from '../../../components/modal';
import Table from '../../../components/table';
import { useFetcherPenghuni } from '../../../lib/fetcher';
import { db } from '../../../lib/firebase';
import { upload } from '../../../lib/upload';
import type { TSchemaPenghuni } from '../../../schema';
import { schemaPenghuni } from '../../../schema';
import type { HtmlDialog } from '../../../types/types';

type TypeSubmit = 'add' | 'edit' | 'delete' | 'detail'
const useHooks = () => {
    const { watch, setValue, register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
        resolver: yupResolver(schemaPenghuni)
    })
    const [typeSubmit, setTypeSubmit] = useState<TypeSubmit>()
    const [isUploading, setIsUploading] = useState(false)

    const total = watch('image') as any
    useEffect(() => {
        if (!total?.length) { return }

        if (total[0].size > 5 * 1024 * 1024) {
            toast.error('max size 5mb')
            return
        }
        setIsUploading(true)
        upload(total[0]).then(async res => {
            const data = await res.json()
            setValue('imageChange', data.url)
            toast.success('upload success')
        }).catch(err => {
            console.log(err)
            toast.error('upload error')
        }).finally(() => setIsUploading(false))

    }, [total])

    const openModal = (data?: TSchemaPenghuni, type: TypeSubmit = 'add') => {
        setTypeSubmit(type)
        reset()
        if (data) {
            setValue('id', data.id)
            setValue('nama', data.nama)
            setValue('no_hp', data.no_hp)
            setValue('imageChange', data.image)
        }

        document.querySelector<HtmlDialog>('#modal_penghuni')?.showModal()
    }

    const onSubmit = handleSubmit(async (_data) => {
        try {
            const newData = {
                ..._data,
                image: watch('imageChange') ?? '',
                created_at: serverTimestamp()
            }
            if ((typeSubmit == 'add' || typeSubmit == 'edit') &&
                data?.some(e => e.nama === _data.nama &&
                    (typeSubmit !== 'edit' || e.id !== _data.id)
                )) {
                toast.error(`${_data.nama} already exist`)
                return
            }
            if (typeSubmit === 'add') {
                await addDoc(collection(db, 'penghuni'), newData);
                toast.success('penghuni added!')
            }
            else if (typeSubmit === 'edit') {
                await updateDoc(doc(db, 'penghuni', _data.id!), newData);
                toast.success('penghuni edited!')
            }
            else if (typeSubmit === 'delete') {
                await deleteDoc(doc(db, 'penghuni', _data.id!));
                toast.success('penghuni deleted!')
            }
            else if (typeSubmit === 'detail') {
                document.querySelector<HtmlDialog>('#modal_penghuni')?.close()
                return
            }
            mutate('penghuni')
            document.querySelector<HtmlDialog>('#modal_penghuni')?.close()
        } catch (err) {
            console.log(err)
            toast.error(`error ${typeSubmit} penghuni`)
        }
    })
    const { data, isLoading } = useFetcherPenghuni()


    return {
        setValue, register, onSubmit, isSubmitting,
        watch, errors, openModal, isLoading, data,
        typeSubmit, isUploading
    }
}


function Penghuni() {
    const { register, onSubmit, isSubmitting,
        watch, openModal, isLoading, data, typeSubmit, isUploading
    } = useHooks()

    if (isLoading) {
        return <div className='center' id='loading'>
            <BoxRotate />
        </div>
    }

    return (<>
        <div className="p-4 container">
            <div className='flex flex-col justify-between sticky top-0 py-2 bg-base-100 z-10'>
                <div className='flex gap-4'>
                    {
                        [['/dashboard/users/penghuni', 'Penghuni'],
                        ['/dashboard/users/petugas', 'Petugas']].map((item, id) =>
                            <NavLink key={id} to={item[0]} className={({ isActive }) => isActive ? '' : 'opacity-60'}>
                                <h2 className="text-2xl font-semibold">{item[1]}</h2>
                            </NavLink>
                        )
                    }
                </div>
                <form className='w-full' onSubmit={onSubmit}>
                    <input {...register('search')} type="text" className='input w-full mt-4' placeholder='Search penghuni...' />
                </form>
            </div>
            <p className='text-sm text-slate-400 text-right'>
                total: {data?.length}
            </p>
            <div className='bottom-10 right-10 fixed z-10'>
                <button className='btn btn-primary' onClick={() => openModal()}
                ><Plus />Penghuni</button>
            </div>
            <div className="overflow-x-auto mt-4">
                <Table rows={['#', 'Penghuni', 'No Hp', '']}>
                    {
                        data?.filter(e => {
                            if (!watch('search')) {
                                return true
                            }
                            return new RegExp(watch('search')!, 'i').test(e.nama)
                        }).map((data, i) => <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{data.nama}</td>
                            <td>{data.no_hp}</td>
                            <td>
                                <div className="dropdown dropdown-end">
                                    <button id='dropdown' className="p-0"><Ellipsis /></button>
                                    <ul className="border menu dropdown-content bg-base-300  w-48  p-2">
                                        <li><button id='detail' onClick={() => openModal(data, 'detail')}>Detail</button></li>
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
                    <input disabled={isSubmitting || typeSubmit === 'delete' || typeSubmit === 'detail'} {...register('nama')} className="input w-full" type="text" placeholder="nama" />
                </label>
                <label className='text-sm'>No HP penghuni:
                    <input disabled={isSubmitting || typeSubmit === 'delete' || typeSubmit === 'detail'} {...register('no_hp')} className="input w-full" type="number" placeholder="no hp" />
                </label>
                <label className='text-sm'>Photo penghuni: *max 5mb
                    {
                        <img
                            // fallback to make sure image can show properly
                            src={watch('imageChange') || '/emptyImage.png'}
                            alt="Image Preview"
                            className={'mt-2 w-full h-32 object-cover'}
                        />
                    }
                    <div className='flex items-center gap-4'>
                        <input disabled={isUploading || isSubmitting || typeSubmit === 'delete' || typeSubmit === 'detail'} {...register('image')} className="file-input w-full" type="file" accept='image/*' />
                    </div>
                </label>
                <button className='btn' disabled={isUploading || isSubmitting} type='submit'>{typeSubmit === 'detail' ? 'Close' : 'Submit'}</button>
            </form>
        </Modal>
    </>);
}

export default Penghuni;