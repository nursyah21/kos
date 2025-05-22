import { addDoc, collection, serverTimestamp } from '@firebase/firestore';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { db } from '../lib/firebase';
import { schemaPenghuni } from '../schema';

import { getDocs } from "@firebase/firestore";
import useSWR, { mutate } from "swr";
import { TSchemaPenghuni } from "../schema";
import { $ } from '../lib/utils';

const fetcher = async () => {
    const querySnapshot = await getDocs(collection(db, 'penghuni'));
    return querySnapshot.docs.map(doc => ({
        ...doc.data() as TSchemaPenghuni
    }));
};


function useTransaksi() {
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

    const { data, isLoading } = useSWR<TSchemaPenghuni[]>("transaksi", fetcher)

    return {
        register, onSubmit, errors, isSubmitting,
        data, isLoading
    };
}

export default useTransaksi;