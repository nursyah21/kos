import * as yup from 'yup'

export const schemaPenghuni = yup.object().shape({
    id: yup.string(),
    nama: yup.string().required('name is required').max(20),
    no_hp: yup.string().required('no hp is required').max(20),
    tgl_bayar: yup.string().required('tgl bayar is required'),
    total: yup.string(),
    petugas: yup.string()
})

export type TSchemaPenghuni = yup.InferType<typeof schemaPenghuni>