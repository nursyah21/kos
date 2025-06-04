import { faker } from '@faker-js/faker';
import admin from 'firebase-admin';
import { db } from './firebase';
import type { TSchemaKamarKos } from '../schema';

console.log('generate fake data...')
const dataPenghuni = Array.from({ length: 10 }, () => ({
    nama: faker.person.firstName(),
    no_hp: faker.phone.number({ style: 'international' }).slice(1),
    created_at: admin.firestore.FieldValue.serverTimestamp()
}))

const dataPetugas = Array.from({ length: 10 }, () => ({
    nama: faker.person.firstName(),
    no_hp: faker.phone.number({ style: 'international' }).slice(1),
    created_at: admin.firestore.FieldValue.serverTimestamp()
}))

const dataKos = Array.from({ length: 10 }, () => ({
    kos: 'kos ' + faker.location.buildingNumber(),
    address: faker.location.streetAddress(),
    created_at: admin.firestore.FieldValue.serverTimestamp()
}))

console.log('seeding penghuni...')
for (const data of dataPenghuni) {
    db.collection('penghuni').add(data)
}

console.log('seeding petugas...')
for (const data of dataPetugas) {
    db.collection('petugas').add(data)
}

console.log('seeding kos...')
for (const data of dataKos) {
    db.collection('kos').add(data)
}

console.log('wait 5second to see new data')
await new Promise(res=>setTimeout(res, 5000))

const randomNumber = (n: number) => Math.floor(Math.random() * n)

const tempPenghuni = await db.collection('penghuni').listDocuments()
const tempKos = await db.collection('kos').listDocuments()

const dataKamar = Array.from({ length: 10 }, (_, idx) => ({
    kamar: 'kamar ' + faker.location.buildingNumber(),
    tgl_masuk: `2020-12-${10 + idx}`,
    kos: tempKos[randomNumber(8)].id,
    penghuni: tempPenghuni[randomNumber(8)].id,
    biaya: faker.finance.amount({ min: 350, max: 1000, dec: 0 }),
    created_at: admin.firestore.FieldValue.serverTimestamp()
}))

console.log('seeding kamar...')
for (const data of dataKamar) {
    db.collection('kamar').add(data)
}

console.log('wait 5second to see new data')
await new Promise(res=>setTimeout(res, 5000))

const tempKamar = await Promise.all(
    (await db.collection('kamar').listDocuments()).map(async (e) => ({
        id: e.id,
        data: (await e.get()).data() as TSchemaKamarKos
    }))
)
const tempPetugas = await db.collection('petugas').listDocuments()

const dataTransaksi = Array.from({ length: 10 }, () => {
    const kamar = tempKamar[randomNumber(8)]
    return {
        kamar : kamar.id,
        petugas: tempPetugas[randomNumber(8)].id,
        tgl_bayar: `${new Date().toISOString().slice(0, 7)}-${randomNumber(8).toString().padStart(2, '0')}`,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        biaya: kamar.data.biaya
    }
})

console.log('seeding transaksi...')
for (const data of dataTransaksi) {
    db.collection('transaksi').add(data)
}

console.log('you must wait to take effect because it didnt use await when delete data')
