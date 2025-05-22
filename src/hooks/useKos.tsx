import { addDoc, collection, serverTimestamp } from '@firebase/firestore';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { db } from '../lib/firebase';
import { getId } from '../lib/getId';
import { schemaPenghuni } from '../schema/penghuni';

import { getDocs } from "@firebase/firestore";
import useSWR, { mutate } from "swr";
import { TSchemaPenghuni } from "../schema/penghuni";

const fetcher = async () => {
    const querySnapshot = await getDocs(collection(db, 'kos'));
    return querySnapshot.docs.map(doc => ({
        ...doc.data() as TSchemaPenghuni
    }));
};


function useKos() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schemaPenghuni)
    })
    const onSubmit = handleSubmit(async data => {
        try {
            await addDoc(collection(db, 'kos'), {
                ...data,
                created_at: serverTimestamp()
            });
            toast.success('kos added!')
        } catch {
            toast.error('Error added kos')
        }
        mutate('penghuni')
        // @ts-ignore
        getId('modal_penghuni').close()
    })

    const { data, isLoading } = useSWR<TSchemaPenghuni[]>("penghuni", fetcher)

    return {
        register, onSubmit, errors, isSubmitting,
        data, isLoading
    };
}

export default useKos;