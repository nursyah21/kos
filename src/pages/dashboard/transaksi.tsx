import { Ellipsis, EllipsisVertical, Plus } from 'lucide-react';
import BoxRotate from '../../components/boxRotate';
import Modal from '../../components/modal';
import Table from '../../components/table';
import { $ } from '../../lib/utils';
import { schemaPenghuni, TSchemaKamarKos, TSchemaPenghuni, TSchemaTransaksi } from '../../schema';
import { addDoc, collection, getDocs, serverTimestamp } from '@firebase/firestore';
import { db } from '../../lib/firebase';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { useFetcherTransaksi } from '../../lib/fetcher';

function useHooks() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schemaPenghuni)
    })
    const onSubmit = handleSubmit(async data => {
        try {
            await addDoc(collection(db, 'transaksi'), {
                ...data,
                created_at: serverTimestamp()
            });
            toast.success('transaksi added!')
        } catch {
            toast.error('Error added transaksi')
        }
        mutate('transaksi')
        // @ts-ignore
        $('modal_transaksi').close()
    })

    const openModal = () => {
        // @ts-ignore
        $('modal_transaksi')?.showModal()
    }

    return {
        register, onSubmit, errors, isSubmitting,
        openModal
    };
}

function Transaksi() {
    const { register, onSubmit, isSubmitting,
        openModal
    } = useHooks()

    const { data, isLoading } = useFetcherTransaksi()


    if (isLoading) {
        return <div className='center'>
            <BoxRotate />
        </div>
    }

    return (<>
        <div className="p-4 container">
            <div className='flex justify-between sticky top-0 py-2 bg-base-100 z-10'>
                <h2 className="text-2xl font-semibold">Transaksi</h2>
                <button className='btn btn-primary'
                    onClick={openModal}
                ><Plus /> Penghuni</button>
            </div>
            <div className="overflow-x-auto mt-4">
                <Table rows={['#', 'Penghuni', 'Tgl Bayar', 'Total (Rb)', 'Petugas', '']}>
                    {
                        data?.map((data, i) => <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{data.penghuni}</td>
                            <td>
                                <div className="dropdown dropdown-end">
                                    <button className=" p-0"><Ellipsis /></button>
                                    <ul className="border menu dropdown-content bg-base-300  w-48  p-2">
                                        <li><button id='edit' onClick={() =>
                                            // @ts-ignore
                                            openModal(data, 'edit')}>Edit</button></li>

                                        <li><button id='delete' onClick={() =>
                                            // @ts-ignore
                                            openModal(data, 'delete')}>Delete</button></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>)
                    }
                </Table>
            </div>
        </div>
        <Modal id='modal_transaksi' title='Add Penghuni'>
            <form method='dialog' className='mt-6 flex gap-4 flex-col' onSubmit={onSubmit}>
                <label className='text-sm'>Nama:
                    <input {...register('nama')} className="input w-full" type="text" placeholder="nama" required />
                </label>
                <label className='text-sm'>No HP:
                    <input {...register('no_hp')} className="input w-full" type="number" placeholder="no hp" required />
                </label>
                {/* <label className='text-sm'>Tgl Bayar:
                    <input {...register('tgl_bayar')} className="input w-full" type="date" placeholder="tgl bayar" required />
                </label>
                <label className='text-sm'>Petugas:
                    <input {...register('petugas')} className="input w-full" type="text" placeholder="petugas" required list='petugas' />
                    <datalist id='petugas'>
                        <option value="nursyah">nursyah</option>
                        <option value="neriyani">neriyani</option>
                    </datalist>
                </label> */}
                {/* <label className='text-sm'>Total Bayar:
                    <div className='flex items-center gap-4'>
                        <input {...register('total')} className="input w-full" type="number" placeholder="1000" required /> Rb
                    </div>
                </label> */}
                <button className='btn' disabled={isSubmitting} type='submit'>Submit</button>
            </form>
        </Modal>
    </>);
}

export default Transaksi;