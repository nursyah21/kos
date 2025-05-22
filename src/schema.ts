import * as yup from 'yup'

export const schemaPenghuni = yup.object().shape({
    id: yup.string(),
    nama: yup.string().required(),
    no_hp: yup.string().required(),
    tgl_bayar: yup.string().required(),
    total: yup.string().required(),
    petugas: yup.string().required()
})

export type TSchemaPenghuni = yup.InferType<typeof schemaPenghuni>

export const schemaKos = yup.object().shape({
    id: yup.string(),
    kos: yup.string().required(),
    penghuni: yup.string().required(),
    tgl_masuk: yup.string().required(),
    biaya: yup.string().required()
})

export type TSchemaKos = yup.InferType<typeof schemaKos>

