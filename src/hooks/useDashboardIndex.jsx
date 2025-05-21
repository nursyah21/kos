import useSWR from 'swr';
import { fetcherDashboards } from '../lib/fetcher';

function useDashboardIndex() {
    const { data, isLoading } = useSWR('dashboards', fetcherDashboards);

    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

    return { data, isLoading , bulan};
}

export default useDashboardIndex;