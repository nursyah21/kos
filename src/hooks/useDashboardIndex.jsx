import { collection, getDocs } from '@firebase/firestore';
import useSWR from 'swr';
import { db } from '../lib/firebase';

const fetcher = async () => {
    const querySnapshot = await getDocs(collection(db, 'dashboard'));
    return querySnapshot.docs.map(doc => ({
        ...doc.data()
    }));
};

function useDashboardIndex() {
    const { data, isLoading } = useSWR('dashboards', fetcher);

    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

    return { data, isLoading, bulan };
}

export default useDashboardIndex;