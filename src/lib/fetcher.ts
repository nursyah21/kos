import { collection, getDocs } from "@firebase/firestore";
import { TSchemaKamarKos, TSchemaKos, TSchemaPenghuni, TSchemaPetugas, TSchemaTransaksi } from "../schema";
import { db } from "./firebase";
import useSWR from "swr";

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
    const querySnapshot = await getDocs(collection(db, 'transaksi'));
    return querySnapshot.docs.map(doc => ({
        ...doc.data() as TSchemaTransaksi
    }));
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
export const useFetcherTransaksi = () => useSWR('petugas', fetcherTransaksi)