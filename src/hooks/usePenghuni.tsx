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
    const querySnapshot = await getDocs(collection(db, 'penghuni'));
    return querySnapshot.docs.map(doc => ({
        ...doc.data() as TSchemaPenghuni
    }));
};


function usePenghuni() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schemaPenghuni)
    })
    const onSubmit = handleSubmit(async data => {
        try {
            await addDoc(collection(db, 'penghuni'), {
                ...data,
                created_at: serverTimestamp()
            });
            toast.success('penghuni added!')
        } catch {
            toast.error('Error added penghuni')
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

export default usePenghuni;