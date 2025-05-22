import { addDoc, collection, serverTimestamp } from '@firebase/firestore';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { db } from '../lib/firebase';
import { schemaPenghuni, TSchemaKos } from '../schema';

import { getDocs } from "@firebase/firestore";
import useSWR, { mutate } from "swr";
import { $ } from '../lib/utils';
import { TSchemaPenghuni } from "../schema";

const fetcher = async () => {
    const querySnapshot = await getDocs(collection(db, 'kos'));
    return querySnapshot.docs.map(doc => ({
        ...doc.data() as TSchemaKos
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
        mutate('kos')
        // @ts-ignore
        $('modal_kos').close()
    })

    const { data, isLoading } = useSWR("kos", fetcher)

    return {
        register, onSubmit, errors, isSubmitting,
        data, isLoading
    };
}

export default useKos;