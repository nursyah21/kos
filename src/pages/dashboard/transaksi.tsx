import { addDoc, collection, doc, serverTimestamp, updateDoc } from '@firebase/firestore';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ellipsis, Plus } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, NavLink } from 'react-router';
import { toast } from 'sonner';
import { mutate } from 'swr';
import BoxRotate from '../../components/boxRotate';
import Modal from '../../components/modal';
import Table from '../../components/table';
import { useFetcherKamar, useFetcherKos, useFetcherPenghuni, useFetcherPetugas, useFetcherTransaksi } from '../../lib/fetcher';
import { db } from '../../lib/firebase';
import { upload } from '../../lib/upload';
import type { TSchemaTransaksi } from '../../schema';
import { schemaTransaksi } from '../../schema';
import type { HtmlDialog } from '../../types/types';

type TypeSubmit = 'add' | 'delete' | 'detail'
const useHooks = () => {
    const { watch, setValue, register, reset, formState: { isSubmitting } } = useForm({
        resolver: yupResolver(schemaTransaksi)
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

    const openModal = (data?: TSchemaTransaksi, type: TypeSubmit = 'add') => {
        setTypeSubmit(type)
        reset()
        if (data) {
            setValue('id', data.id)
            setValue('kos', data.kos)
            setValue('petugas', data.petugas)
            setValue('_petugas', data.petugas.id)
            setValue('kamar', data.kamar)
            setValue('_kamar', data.kamar.id)
            setValue('tgl_bayar', data.tgl_bayar)
            setValue('biaya', data.biaya)
            setValue('imageChange', data.image)
        }

        document.querySelector<HtmlDialog>('#modal_transaksi')?.showModal()
    }

    // handle submit not work so we just use manual
    // dont waste your time to fix it, if it work so it work
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const newData = {
                kamar: dataKamar?.filter(e => e.id == watch('_kamar')).map(e => ({
                    ...e,
                    kos: dataKos?.filter(i => i.id == e.kos)[0],
                    penghuni: dataPenghuni?.filter(i => i.id == e.penghuni)[0],
                }))[0],
                petugas: dataPetugas?.filter(e => e.id == watch('_petugas'))[0],
                tgl_bayar: watch('tgl_bayar'),
                image: watch('imageChange') ?? '/emptyImage.png',
                created_at: serverTimestamp(),
                is_deleted: false
            }
            if (typeSubmit == 'add') {
                await addDoc(collection(db, 'transaksi'), newData);
                toast.success('transaksi added!')
            }
            else if (typeSubmit == 'delete') {
                await updateDoc(doc(db, 'transaksi', watch('id')!),
                    {
                        is_deleted: true,
                        deleted_at: serverTimestamp()
                    });
                toast.success('transaksi deleted!')
            }
            else if (typeSubmit == 'detail') {
                document.querySelector<HtmlDialog>('#modal_transaksi')?.close()
                return
            }
            mutate(['transaksi', false])
            document.querySelector<HtmlDialog>('#modal_transaksi')?.close()
        } catch (err) {
            console.log(err)
            toast.error(`error ${typeSubmit} transaksi`)
        }
    }

    const { data: _data, isLoading: _isLoading } = useFetcherTransaksi()
    const { data: _dataKamar, isLoading: isLoadingKamar } = useFetcherKamar()
    const { data: dataKos, isLoading: isLoadingKos } = useFetcherKos()
    const { data: dataPenghuni, isLoading: isLoadingPenghuni } = useFetcherPenghuni()
    const { data: dataPetugas, isLoading: isLoadingPetugas } = useFetcherPetugas()

    const isLoading = _isLoading || isLoadingKamar || isLoadingPenghuni || isLoadingKos || isLoadingPetugas

    const data = _data
        ?.map(e => {
            return {
                ...e,
                _penghuni: e.kamar.penghuni?.nama,
                _kamar: e.kamar.kamar,
                _petugas: e.petugas.nama,
                _kos: e.kamar.kos?.kos,
                _biaya: e.kamar.biaya
            }
        })

    const dataKamar = _dataKamar
        ?.filter(e =>
            dataPenghuni?.filter(i => i.id == e.penghuni).length)
        ?.map(e => ({
            ...e,
            data: `${e.kamar} - ${dataKos?.filter(i => i.id == e.kos)[0]?.kos}`,
            biaya: e.biaya,
            tgl_masuk: e.tgl_masuk
        }))

    return {
        setValue, register, onSubmit, isSubmitting,
        watch, openModal, isUploading,
        typeSubmit, isLoading, dataKamar,
        data, dataPetugas, dataPenghuni
    }
}

function Transaksi() {
    const { register, onSubmit, isSubmitting,
        watch, openModal, typeSubmit, isUploading, isLoading,
        data, dataKamar, dataPetugas, dataPenghuni
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
                        [['/dashboard/transaksi', 'Transaksi'],
                        ['/dashboard/transaksi/deleted', 'Archive']].map((item, id) =>
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
            <div className='flex bottom-10 right-10 fixed z-10'>
                <div>
                    <button className='btn btn-primary' onClick={() => openModal()}
                    ><Plus />Transaksi</button>
                </div>
            </div>

            <div className="overflow-x-auto mt-4">
                <Table rows={['#', 'Penghuni', 'Kamar', 'Kos', 'Tgl Bayar', 'Biaya (Rb)', 'Petugas', '']}>
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
                                <td>{data._kos}</td>
                                <td>{data.tgl_bayar}</td>
                                <td>{data._biaya}</td>
                                <td>{data._petugas}</td>
                                <td>
                                    <div className="dropdown dropdown-end">
                                        <button id='dropdown' className="p-0"><Ellipsis /></button>
                                        <ul className="border menu dropdown-content bg-base-300  w-48  p-2">
                                            <li><button id='detail' onClick={() => openModal(data, 'detail')}>Detail</button></li>
                                            <li><button id='delete' onClick={() =>
                                                openModal(data, 'delete')}>Soft Delete</button></li>
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
                <label className='text-sm'>Kamar:
                    <select {...register('_kamar')} defaultValue={''} disabled={isSubmitting || typeSubmit == 'delete' || typeSubmit == 'detail'} className="select w-full" required>
                        <option value="" disabled>pilih kamar</option>
                        {dataKamar?.map(e => <option key={e.id} value={e.id}>{e.data}</option>)}
                    </select>
                </label>
                <label className='text-sm'>Penghuni:
                    <input {...register('penghuni')} value={
                        dataPenghuni?.filter(e =>
                            e.id == dataKamar?.filter(i => i.id == watch('_kamar'))[0]?.penghuni
                        ).map(e => `${e.nama} - ${e.no_hp}`)
                    } disabled className="input w-full" type="text" placeholder="penghuni" required />
                </label>
                <label className='text-sm'>Biaya (Rb):
                    <input {...register('biaya')} value={
                        dataKamar?.filter(e => e.id == watch('_kamar'))[0]?.biaya
                    } disabled className="input w-full" type="number" placeholder="biaya" required />
                </label>
                <label className='text-sm'>Tgl Masuk:
                    <input {...register('tgl_masuk')} value={
                        dataKamar?.filter(e => e.id == watch('_kamar'))[0]?.tgl_masuk
                    } disabled className="input w-full" type="date" placeholder="tgl masuk" required />
                </label>
                <label className='text-sm'>Tgl Bayar:
                    <input {...register('tgl_bayar')} disabled={isSubmitting || typeSubmit == 'delete' || typeSubmit == 'detail'} className="input w-full" type="date" placeholder="biaya" required />
                </label>
                <label className='text-sm'>Petugas:
                    <select {...register('_petugas')} defaultValue={''} disabled={isSubmitting || typeSubmit == 'delete' || typeSubmit == 'detail'} className="select w-full" required>
                        <option value="" disabled>pilih petugas</option>
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
                        <input disabled={isUploading || isSubmitting || typeSubmit == 'delete' || typeSubmit == 'detail'} {...register('image')} className="file-input w-full" type="file" accept='image/*' />
                    </div>
                </label>
                <button className='btn' disabled={isUploading || isSubmitting} type='submit'>{typeSubmit == 'detail' ? 'Close' : 'Submit'}</button>
            </form>
        </Modal>
    </>);
}

export default Transaksi;