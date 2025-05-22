import { Ellipsis, Plus } from 'lucide-react';
import BoxRotate from '../../components/boxRotate';
import Modal from '../../components/modal';
import Table from '../../components/table';
import useKos from '../../hooks/useKos';
import { $ } from '../../lib/utils.ts';


function Kos() {
    const { register, onSubmit, isSubmitting,
        data, isLoading
    } = useKos()

    if (isLoading) {
        return <div className='center'>
            <BoxRotate />
        </div>
    }

    return (<>
        <div className="p-4 container">
            <div className='flex justify-between sticky top-0 py-2 bg-base-100 z-10'>
                <h2 className="text-2xl font-semibold">Kos</h2>
                <button className='btn btn-primary'
                    onClick={() => $('modal_kos')?.showModal()}
                ><Plus /> Kos</button>
            </div>
            <div className="overflow-x-auto mt-4">
                <Table rows={['#', 'Kamar Kos', 'Penghuni', 'Tgl Masuk', 'Biaya (Rb)', '']}>
                    {
                        data?.map((data, i) => <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{data.nama}</td>
                            <td>{data.no_hp}</td>
                            <td>{data.tgl_bayar}</td>
                            <td>{Number(data.total).toLocaleString()}</td>
                            <td>{data.petugas}</td>
                            <td>
                                <div className="dropdown dropdown-end">
                                    <button className=" p-0"><Ellipsis /></button>
                                    <ul className="menu dropdown-content bg-base-300  z-1 w-48  p-2">
                                        <li><a>Info</a></li>
                                        <li><a>Delete</a></li>
                                    </ul>
                                </div>
                            </td> 
                        </tr>)
                    }
                </Table>
            </div>
        </div>
        <Modal id='modal_kos' title='Add Kos'>
            <form method='dialog' className='mt-6 flex gap-4 flex-col' onSubmit={onSubmit}>
                <label className='text-sm'>Kos:
                    <input {...register('kos')} className="input w-full" type="text" placeholder="kos" required />
                </label>
                <label className='text-sm'>Nama penghuni:
                    <input {...register('nama')} className="input w-full" type="number" placeholder="nama" />
                </label>
                <label className='text-sm'>No HP Penghuni:
                    <input {...register('no_hp')} className="input w-full" type="number" placeholder="no hp" />
                </label>
                <label className='text-sm'>Tgl Masuk:
                    <input {...register('tgl_bayar')} className="input w-full" type="date" placeholder="tgl bayar" />
                </label>
                <label className='text-sm'>Petugas:
                    <input {...register('petugas')} className="input w-full" type="text" placeholder="petugas" required list='petugas' />
                    <datalist id='petugas'>
                        <option value="nursyah">nursyah</option>
                        <option value="neriyani">neriyani</option>
                    </datalist>
                </label>
                <label className='text-sm'>Total Bayar:
                    <div className='flex items-center gap-4'>
                        <input {...register('total')} className="input w-full" type="number" placeholder="1000" required /> Rb
                    </div>
                </label>
                <button className='btn' disabled={isSubmitting} type='submit'>Submit</button>
            </form>
        </Modal>
    </>);
}

export default Kos;