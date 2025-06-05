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
        ['penghuni', dataFetching?.penghuni],
        ['no hp', dataFetching?.penghuni_nohp],
        ['petugas', dataFetching?.petugas],
        ['no hp', dataFetching?.penghuni_nohp],
        ['kos', dataFetching?.kos],
        ['alamat kos', dataFetching?.kos_address],
        ['kamar', dataFetching?.kamar],
        ['tgl bayar', dataFetching?.tgl_bayar],
        ['biaya', `Rp${dataFetching?.biaya}`],
    ]

    const print = () => {
        window.print()
    }
    if (dataFetching?.penghuni) {
        window.document.title = `Invoice - ${dataFetching.penghuni.split(' ')[0]} - ${dataFetching.tgl_bayar}`
    }

    const notfound = dataFetching?.is_deleted


    return { data, isLoading, print, notfound }
}

function Invoice() {
    const { data, isLoading, print, notfound } = useHooks()

    if (isLoading) {
        return <div className='center'>
            <BoxRotate />
        </div>
    }

    if (notfound) {
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