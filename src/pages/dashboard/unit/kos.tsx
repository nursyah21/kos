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
import { useFetcherKos } from '../../../lib/fetcher';
import { db } from '../../../lib/firebase';
import { upload } from '../../../lib/upload';
import type { TSchemaKos } from '../../../schema';
import { schemaKos } from '../../../schema';
import type { HtmlDialog } from '../../../types/types';

type TypeSubmit = 'add' | 'edit' | 'delete'
const useHooks = () => {
    const { watch, setValue, register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
        resolver: yupResolver(schemaKos)
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

    const openModal = (data?: TSchemaKos, type: TypeSubmit = 'add') => {
        setTypeSubmit(type)
        reset()
        if (data) {
            setValue('id', data.id)
            setValue('kos', data.kos)
            setValue('address', data.address)
            setValue('imageChange', data.image)
        }
        document.querySelector<HtmlDialog>('#modal_kos')?.showModal()
    }

    const onSubmit = handleSubmit(async (data) => {
        try {
            const newData = {
                ...data,
                image: watch('imageChange') ?? '/emptyImage.png',
                created_at: serverTimestamp()
            }

            if (typeSubmit == 'add') {
                await addDoc(collection(db, 'kos'), newData);
                toast.success('kos added!')
            }
            else if (typeSubmit == 'edit') {
                await updateDoc(doc(db, 'kos', data.id!), newData);
                toast.success('kos edited!')
            }
            else if (typeSubmit == 'delete') {
                await deleteDoc(doc(db, 'kos', data.id!));
                toast.success('kos deleted!')
            }
        } catch (e) {
            toast.error(`error ${typeSubmit} kos`)
        }
        mutate('kos')

        document.querySelector<HtmlDialog>('#modal_kos')?.close()
    })
    return {
        setValue, register, onSubmit, isSubmitting,
        watch, errors, openModal, isUploading,
        typeSubmit
    }
}


function Kos() {
    const { register, onSubmit, isSubmitting,
        watch, openModal, typeSubmit, isUploading
    } = useHooks()

    const { data, isLoading } = useFetcherKos()

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
                        [['/dashboard/unit/kamar', 'Kamar'],
                        ['/dashboard/unit/kos', 'Kos']].map((item, id) =>
                            <NavLink key={id} to={item[0]} className={({ isActive }) => isActive ? '' : 'opacity-60'}>
                                <h2 className="text-2xl font-semibold">{item[1]}</h2>
                            </NavLink>
                        )
                    }
                </div>
                <form className='w-full' onSubmit={onSubmit}>
                    <input {...register('search')} type="text" className='input w-full mt-4' placeholder='Search kos...' />
                </form>
            </div>
            <p className='text-sm text-slate-400 text-right'>
                total: {data?.length}
            </p>
            <div className='flex bottom-10 right-10 fixed z-10'>
                <div>
                    <button className='btn btn-primary' onClick={() => openModal()}
                    ><Plus />Kos</button>
                </div>
            </div>

            <div className="overflow-x-auto mt-4">
                <Table rows={['#', 'Kos', 'Alamat', '']}>
                    {
                        data?.filter(e => {
                            if (!watch('search')) {
                                return true
                            }
                            return new RegExp(watch('search')!, 'i').test(e.kos)
                        }).map((data, i) => <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{data.kos}</td>
                            <td>{data.address}</td>
                            <td>
                                <div className="dropdown dropdown-end">
                                    <button id='dropdown' className="p-0"><Ellipsis /></button>
                                    <ul className="border menu dropdown-content bg-base-300  w-48  p-2">
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
        <Modal id='modal_kos' title={`${typeSubmit} kos`}>
            <form className='mt-6 flex gap-4 flex-col' onSubmit={onSubmit}>
                <label className='text-sm'>kos:
                    <input disabled={isSubmitting || typeSubmit == 'delete'} {...register('kos')} className="input w-full" type="text" placeholder="kos" />
                </label>
                <label className='text-sm'>Alamat:
                    <input disabled={isSubmitting || typeSubmit == 'delete'} {...register('address')} className="input w-full" type="text" placeholder="alamat" />
                </label>
                <label className='text-sm'>Photo kos: *max 5mb
                    {
                        <img
                            // fallback to make sure image can show properly
                            src={watch('imageChange') || '/emptyImage.png'}
                            alt="Image Preview"
                            className={'mt-2 w-full h-32 object-cover'}
                        />
                    }
                    <div className='flex items-center gap-4'>
                        <input disabled={isUploading || isSubmitting || typeSubmit == 'delete'} {...register('image')} className="file-input w-full" type="file" accept='image/*' />
                    </div>
                </label>
                <button className='btn' disabled={isUploading || isSubmitting} type='submit'>Submit</button>
            </form>
        </Modal>
    </>);
}

export default Kos;