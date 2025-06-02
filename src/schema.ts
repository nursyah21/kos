import * as yup from 'yup'

export const schemaLogin = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required()
})


export const schemaPenghuni = yup.object().shape({
    id: yup.string(),
    nama: yup.string().required(),
    no_hp: yup.string().required(),
    image: yup.string(),
    imageChange: yup.string(),
    search: yup.string()
})

export type TSchemaPenghuni = yup.InferType<typeof schemaPenghuni>

export const schemaKos = yup.object().shape({
    id: yup.string(),
    kos: yup.string().required(),
    address: yup.string().required(),
    image: yup.string(),
    imageChange: yup.string(),
    search: yup.string()
})

export type TSchemaKos = yup.InferType<typeof schemaKos>


export const schemaKamarKos = yup.object().shape({
    id: yup.string(),
    kamar: yup.string().required(),
    kos: yup.string().required(),
    penghuni: yup.string().required(),
    tgl_masuk: yup.string().required(),
    biaya: yup.string(),
    image: yup.string(),
    imageChange: yup.string(),
    search: yup.string()
})

export type TSchemaKamarKos = yup.InferType<typeof schemaKamarKos>

