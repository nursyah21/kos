import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from '@firebase/firestore';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ellipsis, Plus } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { mutate } from 'swr';
import BoxRotate from '../../components/boxRotate';
import Modal from '../../components/modal';
import Table from '../../components/table';
import { useFetcherKamar, useFetcherKos, useFetcherPenghuni, useFetcherPetugas, useFetcherTransaksi } from '../../lib/fetcher';
import { db } from '../../lib/firebase';
import { upload } from '../../lib/upload';
import { $ } from '../../lib/utils';
import type { TSchemaTransaksi } from '../../schema';
import { schemaTransaksi } from '../../schema';

type TypeSubmit = 'add' | 'edit' | 'delete'
const useHooks = () => {
    const { watch, setValue, register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
        resolver: yupResolver(schemaTransaksi)
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

    const openModal = (data?: TSchemaTransaksi, type: TypeSubmit = 'add') => {
        reset()
        if (data) {
            setValue('id', data.id)
            setValue('kos', data.kos)
            setValue('petugas', data.petugas)
            setValue('kamar', data.kamar)
            setValue('tgl_bayar', data.tgl_bayar)
            setValue('biaya', data.biaya)
            setValue('imageChange', data.image)
            setTypeSubmit(type)
        }
        // @ts-ignore
        $('#modal_transaksi').showModal()
    }

    // handle submit not work so we just use manual
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const newData = {
                kamar: watch('kamar'),
                biaya: dataKamar?.filter(e => e.id == watch('kamar'))[0].biaya,
                petugas: watch('petugas'),
                tgl_bayar: watch('tgl_bayar'),
                image: watch('imageChange') ?? '/emptyImage.png',
                created_at: serverTimestamp()
            }
            if (typeSubmit == 'add') {
                await addDoc(collection(db, 'transaksi'), newData);
                toast.success('transaksi added!')
            }
            else if (typeSubmit == 'edit') {
                await updateDoc(doc(db, 'transaksi', watch('id')!), newData);
                toast.success('transaksi edited!')
            }
            else if (typeSubmit == 'delete') {
                await deleteDoc(doc(db, 'transaksi', watch('id')!));
                toast.success('transaksi deleted!')
            }
        } catch (err) {
            console.log(err)
            toast.error(`error ${typeSubmit} transaksi`)
        }
        mutate('transaksi')
        // @ts-ignore
        $('#modal_transaksi').close()
    }

    const { data: _data, isLoading: _isLoading } = useFetcherTransaksi()
    const { data: _dataKamar, isLoading: isLoadingKamar } = useFetcherKamar()
    const { data: dataKos, isLoading: isLoadingKos } = useFetcherKos()
    const { data: dataPenghuni, isLoading: isLoadingPenghuni } = useFetcherPenghuni()
    const { data: dataPetugas, isLoading: isLoadingPetugas } = useFetcherPetugas()

    const isLoading = _isLoading || isLoadingKamar || isLoadingPenghuni || isLoadingKos || isLoadingPetugas

    const data = _data?.map(e => {
        const kamar = _dataKamar?.filter(i => i.id == e.kamar)[0]
        const kos = dataKos?.filter(i => i.id == kamar?.kos)[0]
        const penghuni = dataPenghuni?.filter(i => i.id == kamar?.penghuni)[0]
        const petugas = dataPetugas?.filter(i => i.id == e.petugas)[0]
        return {
            ...e,
            _kamar: `${kamar?.kamar} - ${kos?.kos}`,
            _penghuni: penghuni?.nama,
            _petugas: petugas?.nama
        }
    })

    const dataKamar = _dataKamar
        ?.filter(e =>
            dataPenghuni?.filter(i => i.id == e.penghuni).length)
        ?.map(e => ({
            id: e.id,
            data: `${e.kamar} - ${dataKos?.filter(i => i.id == e.kos)[0]?.kos}`,
            biaya: e.biaya,
            tgl_masuk: e.tgl_masuk,
            penghuni: dataPenghuni?.filter(i => i.id == e.penghuni).map(j => `${j.nama} - ${j.no_hp}`)[0]
        }))

    return {
        setValue, register, onSubmit, isSubmitting,
        watch, errors, openModal, isUploading,
        typeSubmit, handleSubmit, isLoading, dataKamar,
        data, dataPetugas
    }
}

function Transaksi() {
    const { register, onSubmit, isSubmitting,
        watch, openModal, typeSubmit, isUploading, isLoading,
        data, dataKamar, dataPetugas
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
                    <h2 className="text-2xl font-semibold">Transaksi</h2>
                </div>
                <form className='w-full' onSubmit={onSubmit}>
                    <input {...register('search')} type="text" className='input w-full mt-4' placeholder='Search transaksi penghuni...' />
                </form>
            </div>
            <div className='flex bottom-10 right-10 fixed z-10'>
                <div>
                    <button className='btn btn-primary'
                        // @ts-ignore
                        onClick={openModal}
                    ><Plus />Transaksi</button>
                </div>
            </div>

            <div className="overflow-x-auto mt-4">
                <Table rows={['#', 'Penghuni', 'Kamar', 'Tgl Bayar', 'Biaya (Rb)', 'Petugas', '']}>
                    {
                        data?.filter(e => {
                            if (!watch('search')) {
                                return true
                            }

                            return new RegExp(watch('search')!, 'i').test(e._penghuni!)
                        })
                            ?.map((data, i) => <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{data._penghuni}</td>
                                <td>{data._kamar}</td>
                                <td>{data.tgl_bayar}</td>
                                <td>{data.biaya}</td>
                                <td>{data._petugas}</td>
                                <td>
                                    <div className="dropdown dropdown-end">
                                        <button id='dropdown' className="p-0"><Ellipsis /></button>
                                        <ul className="border menu dropdown-content bg-base-300  w-48  p-2">
                                            <li><button id='edit' onClick={() =>
                                                openModal(data, 'edit')}>Edit</button></li>

                                            <li><button id='delete' onClick={() =>
                                                openModal(data, 'delete')}>Delete</button></li>

                                            <li><Link id='invoice' to={`/invoice/${data.id}`} >Invoice</Link></li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>)
                    }
                </Table>
            </div>
        </div>
        <Modal id='modal_transaksi' title={`${typeSubmit} transaksi`}>
            <form className='mt-6 flex gap-4 flex-col' onSubmit={onSubmit}>
                <label className='text-sm'>kamar:
                    <select {...register('kamar')} defaultValue={'pilih kamar'} disabled={isSubmitting || typeSubmit == 'delete'} className="select w-full" required>
                        <option value="pilih kamar" disabled>pilih kamar</option>
                        {dataKamar?.map(e => <option key={e.id} value={e.id}>{e.data}</option>)}
                    </select>
                </label>
                <label className='text-sm'>penghuni:
                    <input {...register('penghuni')} value={
                        dataKamar?.filter(e => e.id == watch('kamar')).map(e => e.penghuni)[0]
                    } disabled className="input w-full" type="text" placeholder="penghuni" required />
                </label>
                <label className='text-sm'>Biaya (Rb):
                    <input {...register('biaya')} value={
                        dataKamar?.filter(e => e.id == watch('kamar')).map(e => e.biaya)[0]
                    } disabled className="input w-full" type="number" placeholder="biaya" required />
                </label>
                <label className='text-sm'>Tgl Masuk:
                    <input {...register('tgl_masuk')} value={
                        dataKamar?.filter(e => e.id == watch('kamar')).map(e => e.tgl_masuk)[0]
                    } disabled className="input w-full" type="date" required />
                </label>
                <label className='text-sm'>Tgl Bayar:
                    <input {...register('tgl_bayar')} disabled={isSubmitting || typeSubmit == 'delete'} {...register('tgl_bayar')} className="input w-full" type="date" placeholder="biaya" required />
                </label>
                <label className='text-sm'>Petugas:
                    <select {...register('petugas')} defaultValue={'pilih petugas'} disabled={isSubmitting || typeSubmit == 'delete'} className="select w-full" required>
                        <option value="pilih petugas" disabled>pilih petugas</option>
                        {dataPetugas?.map(e => (<option key={e.id} value={e.id}>{e.nama} - {e.no_hp}</option>))}
                    </select>
                </label>
                <label className='text-sm'>Photo bukti: *max 5mb
                    {
                        <img
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

export default Transaksi;