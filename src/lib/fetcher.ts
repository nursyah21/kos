import { collection, doc, getDoc, getDocs, orderBy, query } from "@firebase/firestore";
import useSWR from "swr";
import type { TSchemaKamarKos, TSchemaKos, TSchemaPenghuni, TSchemaPetugas, TSchemaTransaksi } from "../schema";
import { db } from "./firebase";

export const fetcherKamar = async () => {
    const kamarSnapshot = await getDocs(collection(db, 'kamar'));

    return kamarSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as TSchemaKamarKos
    }))
};

export const fetcherPenghuni = async () => {
    const penghuniSnapshot = await getDocs(collection(db, 'penghuni'));

    return penghuniSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as TSchemaPenghuni
    }))
};

export const fetcherPetugas = async () => {
    const penghuniSnapshot = await getDocs(collection(db, 'petugas'));

    return penghuniSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as TSchemaPetugas
    }))
};

export const fetcherTransaksi = async () => {
    const querySnapshot = await getDocs(query(collection(db, 'transaksi'), orderBy('tgl_bayar', 'desc')));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as TSchemaTransaksi
    }));
};

export const fetcherInvoice = async (id: string) => {
    const snap = await getDoc(doc(db, 'transaksi', id));
    const data = snap.exists() ? { id: snap.id, ...snap.data() as TSchemaTransaksi } : null;
    if (!data) return data

    const petugasSnap = await getDoc(doc(db, 'petugas', data.petugas))
    const petugasData = petugasSnap.data() as TSchemaPetugas

    const kamarSnap = await getDoc(doc(db, 'kamar', data.kamar))
    const kamarData = kamarSnap.data() as TSchemaKamarKos

    const penghuniSnap = await getDoc(doc(db, 'penghuni', kamarData.penghuni))
    const penghuniData = penghuniSnap.data() as TSchemaPenghuni

    const kosSnap = await getDoc(doc(db, 'kos', kamarData.kos))
    const kosData = kosSnap.data() as TSchemaKos



    return {
        petugas: `${petugasData.nama} - ${petugasData.no_hp}`,
        penghuni: `${penghuniData.nama} - ${penghuniData.no_hp}`,
        kamar: kamarData.kamar,
        kos: `${kosData.kos} - ${kosData.address}`,
        tgl_bayar: data.tgl_bayar,
        biaya: data.biaya
    }
};

const fetcherKos = async () => {
    const querySnapshot = await getDocs(collection(db, 'kos'));
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