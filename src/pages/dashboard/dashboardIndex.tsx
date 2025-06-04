import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import BoxRotate from '../../components/boxRotate';
import { useFetcherTransaksi } from '../../lib/fetcher';

function useHooks() {
    const { data: dataTransaksi, isLoading } = useFetcherTransaksi();

    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    const transaksi = dataTransaksi
        ?.filter(e => Number(e.tgl_bayar.split('-')[1]) == new Date().getMonth() + 1)
        .map(e => ({
            day: Number(e.tgl_bayar.split('-')[2]),
            biaya: Number(e.biaya) * 1000
        }))
        .sort((a, b) => a.day - b.day)

    const data = {
        ...transaksi,
        totalTransaksi: transaksi?.length,
        totalPendapatan: transaksi?.reduce((acc, cur) => acc + Number(cur.biaya), 0).toLocaleString(),

        dataTransaksi: transaksi?.reduce((acc, { day }) => {
            const existing = acc.find(i => i.day === day)
            existing
                ? existing.totalTransaksi += 1
                : acc.push({ day, totalTransaksi: 1 })
            return acc
        }, [{ day: 0, totalTransaksi: 0 }])
            .filter(e => e.day != 0),

        dataPendapatan: transaksi?.reduce((acc, { day, biaya }) => {
            const existing = acc.find(i => i.day === day)
            existing
                ? existing.totalPendapatan += biaya / 1000
                : acc.push({ day, totalPendapatan: biaya / 1000 })
            return acc
        }, [{ day: 0, totalPendapatan: 0 }])
            .filter(e => e.day != 0),
    }

    return { data, isLoading, bulan }
}

function DashboardIndex() {
    const { isLoading, bulan, data } = useHooks()

    if (isLoading) {
        return <div className='center'>
            <BoxRotate />
        </div>
    }

    return (<>
        <div className="p-4 container">
            <div className='flex justify-between'>
                <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
                <h2 className="font-bold my-2">{bulan[new Date().getMonth()]} {new Date().getFullYear()}</h2>
            </div>

            <div className="flex gap-4 py-12 sm:flex-row flex-col">
                <div className="flex-1 shadow-2xl rounded-xl">
                    <h2 className="text-xl font-semibold">Total Transaksi</h2>
                    <span className="text-xl">{data?.totalTransaksi}</span>
                </div>

                <div className="flex-1 shadow-2xl rounded-xl">
                    <h2 className="text-xl font-semibold">Total Pendapatan</h2>
                    <span className="text-xl">Rp{data?.totalPendapatan}</span>
                </div>
            </div>
            <div className="shadow-2xl rounded-xl">
                <h2 className="text-xl font-semibold my-4">Grafik Transaksi</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.dataTransaksi} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="totalTransaksi" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip contentStyle={{ color: 'black' }} formatter={e => e.toLocaleString()} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="shadow-2xl rounded-xl">
                <h2 className="text-xl font-semibold my-4">Grafik Pendapatan</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.dataPendapatan} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="totalPendapatan" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip contentStyle={{ color: 'black' }} formatter={e => e.toLocaleString() + 'k'} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className='flex gap-2'>
            </div>


        </div>
    </>);
}

export default DashboardIndex;