import { Printer } from "lucide-react";
import { useParams } from "react-router";
import BoxRotate from "../components/boxRotate";
import Table from "../components/table";
import { useFetcherInvoice } from "../lib/fetcher";
import ttd from '../assets/ttd.png'

const useHooks = () => {
    const { id } = useParams()
    const { data: dataFetching, isLoading } = useFetcherInvoice(id!)

    const data = [
        ['penghuni', dataFetching?.penghuni.split('-')[0]],
        ['no hp', dataFetching?.penghuni.split('-')[1]],
        ['petugas', dataFetching?.petugas.split('-')[0]],
        ['no hp', dataFetching?.petugas.split('-')[1]],
        ['kos', dataFetching?.kos.split('-')[0]],
        ['alamat kos', dataFetching?.kos.split('-')[1]],
        ['kamar', dataFetching?.kamar],
        ['tgl bayar', dataFetching?.tgl_bayar],
        ['biaya', `Rp${(dataFetching?.biaya! * 1000).toLocaleString()}`],
    ]

    const print = () => {
        window.print()
    }
    if (dataFetching?.penghuni) {
        window.document.title = `Invoice - ${dataFetching.penghuni.split(' ')[0]} - ${dataFetching.tgl_bayar}`
    }

    return { data, isLoading, print }
}

function Invoice() {
    const { data, isLoading, print } = useHooks()

    if (isLoading) {
        return <div className='center'>
            <BoxRotate />
        </div>
    }
    if (data[0][1] == undefined) {
        return <div className="center">
            <h2 className="text-2xl">Invoice not found</h2>
        </div>
    }



    return (<>
        <div className="container max-w-2xl mx-auto my-4">
            <div className="p-4">
                <h2 className="text-2xl">Invoice</h2>
                <p>dicetak: {new Date().toISOString().slice(0, 10)}, {new Date().toLocaleTimeString()}</p>
            </div>
            <Table rows={['', '']}>
                {data?.map((item, id) =>
                    <tr key={id}>
                        <td className="py-1">{item[0]}</td>
                        <td className="py-1">{item[1]}</td>
                    </tr>
                )}
            </Table>
            <div className="printable hidden">
                <img src={ttd} alt="ttd" className="w-48" />
                <p>Pemilik Kos</p>
            </div>

            <button className="btn btn-primary dont-print" onClick={print}>
                <Printer /> Print
            </button>
        </div>
    </>);
}

export default Invoice;