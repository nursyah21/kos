import { collection, doc, getDoc, getDocs, orderBy, query, where } from "@firebase/firestore";
import useSWR from "swr";
import type { TSchemaKamarKos, TSchemaKos, TSchemaPenghuni, TSchemaPetugas, TSchemaTransaksi } from "../schema";
import { db } from "./firebase";

export const fetcherKamar = async () => {
    const kamarSnapshot = await getDocs(query(collection(db, 'kamar'), orderBy('kamar')));

    return kamarSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as TSchemaKamarKos
    }))
};

export const fetcherPenghuni = async () => {
    const penghuniSnapshot = await getDocs(query(collection(db, 'penghuni'), orderBy('nama')));

    return penghuniSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as TSchemaPenghuni
    }))
};

export const fetcherPetugas = async () => {
    const penghuniSnapshot = await getDocs(query(collection(db, 'petugas'), orderBy('nama')));

    return penghuniSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as TSchemaPetugas
    }))
};

export const fetcherTransaksi = async () => {
    try {
        const querySnapshot = await getDocs(query(collection(db, 'transaksi'), where('is_deleted', '==', false), orderBy('tgl_bayar', 'desc')));

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as TSchemaTransaksi
        }));
    } catch (error) {
        console.log(error)
    }
};

export const fetcherInvoice = async (id: string) => {
    const data = (await getDoc(doc(db, 'transaksi', id))).data() as TSchemaTransaksi

    console.log(data)

    return {
        petugas: data.petugas.nama,
        petugas_nohp: data.petugas.no_hp,
        penghuni: data.kamar.penghuni.nama,
        penghuni_nohp: data.kamar.penghuni.no_hp,
        kamar: data.kamar.kamar,
        kos: data.kamar.kos.kos,
        kos_address: data.kamar.kos.address,
        tgl_bayar: data.tgl_bayar,
        biaya: (Number(data.kamar.biaya) * 1000).toLocaleString()
    }
};

const fetcherKos = async () => {
    const querySnapshot = await getDocs(query(collection(db, 'kos'), orderBy('kos')));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as TSchemaKos
    }));
};

export const useFetcherKos = () => useSWR('kos', fetcherKos)
export const useFetcherKamar = () => useSWR('kamar', fetcherKamar)
export const useFetcherPenghuni = () => useSWR('penghuni', fetcherPenghuni)
export const useFetcherPetugas = () => useSWR('petugas', fetcherPetugas)
export const useFetcherTransaksi = () => useSWR('transaksi', fetcherTransaksi)
export const useFetcherInvoice = (id: string) => useSWR(['invoice', id], ([_, id]) => fetcherInvoice(id))