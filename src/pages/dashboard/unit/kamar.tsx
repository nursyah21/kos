import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from '@firebase/firestore';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ellipsis, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router';
import { toast } from 'sonner';
import useSWR, { mutate } from 'swr';
import BoxRotate from '../../../components/boxRotate';
import Modal from '../../../components/modal';
import Table from '../../../components/table';
import { db } from '../../../lib/firebase';
import { upload } from '../../../lib/upload';
import { $ } from '../../../lib/utils';
import { schemaKamarKos, TSchemaKamarKos, TSchemaKos, TSchemaPenghuni } from '../../../schema';

const fetcher = async () => {
    const penghuniSnapshot = await getDocs(collection(db, 'penghuni'));
    const kosSnapshot = await getDocs(collection(db, 'kos'));
    const kamarSnapshot = await getDocs(collection(db, 'kamar'));

    return {
        penghuni: penghuniSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as TSchemaPenghuni
        })),
        kamar: kamarSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as TSchemaKamarKos
        })),
        kos: kosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as TSchemaKos
        }))
    }
};
type TypeSubmit = 'add' | 'edit' | 'delete'
const useHooks = () => {
    const { watch, setValue, register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
        resolver: yupResolver(schemaKamarKos)
    })
    const [typeSubmit, setTypeSubmit] = useState<TypeSubmit>()
    const [isUploading, setIsUploading] = useState(false)

    const total = watch('image')
    useEffect(() => {
        if (!total?.length) { return }

        // @ts-ignore
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

    const openModal = (data?: TSchemaKamarKos, type: TypeSubmit = 'add') => {
        reset()
        if (data) {
            setValue('id', data.id)
            setValue('kamar', data.kamar)
            setValue('kos', data.kos)
            setValue('biaya', data.biaya)
            setValue('biaya', data.biaya)
            setValue('penghuni', data.penghuni)
            setValue('tgl_masuk', data.tgl_masuk)
            setValue('imageChange', data.image)
            setTypeSubmit(type)
        }
        // @ts-ignore
        $('#modal_kamar').showModal()
    }

    const onSubmit = handleSubmit(async (data) => {
        try {
            const newData = {
                ...data,
                image: watch('imageChange') ?? '',
                created_at: serverTimestamp()
            }
            if (typeSubmit == 'add') {
                await addDoc(collection(db, 'kamar'), newData);
                toast.success('kamar added!')
            }
            else if (typeSubmit == 'edit') {
                await updateDoc(doc(db, 'kamar', data.id!), newData);
                toast.success('kamar edited!')
            }
            else if (typeSubmit == 'delete') {
                await deleteDoc(doc(db, 'kamar', data.id!));
                toast.success('kamar deleted!')
            }
        } catch (e) {
            toast.error(`error ${typeSubmit} kamar`)
        }
        mutate('kamar')
        // @ts-ignore
        $('#modal_kamar').close()
    })
    return {
        setValue, register, onSubmit, isSubmitting,
        watch, errors, openModal,
        typeSubmit, isUploading
    }
}


function Kamar() {
    const { register, onSubmit, isSubmitting,
        watch, openModal, typeSubmit, isUploading
    } = useHooks()
    const { data, isLoading } = useSWR('kamar', fetcher)

    if (isLoading) {
        return <div className='center' id='loading'>
            <BoxRotate />
        </div>
    }
    const imageId = watch('imageChange') || watch('image') || 'default-image-id';


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
                    <input {...register('search')} type="text" className='input w-full mt-4' placeholder='Search kamar...' />
                </form>
            </div>
            <div className='bottom-10 right-10 fixed z-10'>
                <button className='btn btn-primary'
                    // @ts-ignore
                    onClick={openModal}
                ><Plus />Kamar</button>
            </div>
            <div className="overflow-x-auto">
                <Table rows={['#', 'kamar', 'Kos', 'Penghuni', 'Tgl Masuk', 'Biaya (Rb)', '']}>
                    {
                        data?.kamar?.filter(e => {
                            if (!watch('search')) {
                                return true
                            }
                            return new RegExp(watch('search')!, 'i').test(e.kamar)
                        }).map((data, i) => <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{data.kamar}</td>
                            <td>{data.kos}</td>
                            <td>{data.penghuni}</td>
                            <td>{data.tgl_masuk}</td>
                            <td>{data.biaya}</td>
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
        <Modal id='modal_kamar' title={`${typeSubmit} kamar`}>
            <form className='mt-6 flex gap-4 flex-col' onSubmit={onSubmit}>
                <label className='text-sm'>kamar:
                    <input disabled={isSubmitting || typeSubmit == 'delete'} {...register('kamar')} className="input w-full" type="text" placeholder="kamar" required />
                </label>
                <label className='text-sm'>Biaya (Rb):
                    <input disabled={isSubmitting || typeSubmit == 'delete'} {...register('biaya')} className="input w-full" type="number" placeholder="kamar" required />
                </label>
                <label className='text-sm'>Photo kamar: *max 5mb
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
                <label className='text-sm'>Kos:
                    <select  {...register('kos')} className="select w-full" required>
                        <option defaultValue={''} disabled selected>pilih kamar kos</option>
                        {data?.kos.map((e, id) =>
                            <option value={e.id} key={id}>{e.kos}</option>
                        )}
                    </select>
                </label>
                <label className='text-sm'>Penghuni:
                    <select  {...register('penghuni')} className="select w-full" >
                        <option disabled selected>pilih penghuni</option>
                        {data?.penghuni.map((e, id) =>
                            <option value={e.id} key={id}>{e.nama} - {e.no_hp}</option>
                        )}
                    </select>
                </label>
                <label className='text-sm'>Tgl Masuk:
                    <input disabled={isSubmitting || typeSubmit == 'delete'} {...register('tgl_masuk')} className="input w-full" type="date" placeholder="tgl masuk" />
                </label>

                <button className='btn' disabled={isUploading || isSubmitting} type='submit'>Submit</button>
            </form>
        </Modal>
    </>);
}

export default Kamar;