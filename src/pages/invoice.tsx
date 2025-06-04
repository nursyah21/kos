import { useParams } from "react-router";
import BoxRotate from "../components/boxRotate";
import { useFetcherInvoice } from "../lib/fetcher";
import { Printer } from "lucide-react";
import Table from "../components/table";

const useHooks = () => {
    const { id } = useParams()
    const { data: dataFetching, isLoading } = useFetcherInvoice(id!)

    const data = [
        ['penghuni', dataFetching?.penghuni],
        ['petugas', dataFetching?.petugas],
        ['kos', dataFetching?.kos],
        ['kamar', dataFetching?.kamar],
        ['tgl bayar', dataFetching?.tgl_bayar],
        ['biaya', dataFetching?.biaya],
    ]

    return { data, isLoading, }
}

function Invoice() {
    const { data, isLoading } = useHooks()

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
                <p>dicetak: {new Date().toLocaleString()}</p>
            </div>
            <Table rows={['', '']}>
                {data?.map((item, id) =>
                    <tr key={id}>
                        <td>{item[0]}</td>
                        <td>{item[1]}</td>
                    </tr>
                )}
            </Table>

            <button className="btn btn-primary dont-print" onClick={() => window.print()}>
                <Printer /> Print
            </button>
        </div>
    </>);
}

export default Invoice;