import { faker } from '@faker-js/faker';
import admin from 'firebase-admin';
import type { TSchemaKamarKos, TSchemaKos, TSchemaPenghuni, TSchemaPetugas } from '../../src/schema';
import { db } from './firebase';


const length = 15

console.log('generate fake data...')
const dataPenghuni = Array.from({ length }, () => ({
    nama: faker.person.firstName(),
    no_hp: faker.phone.number({ style: 'international' }).slice(1),
    created_at: admin.firestore.FieldValue.serverTimestamp()
}))

const dataPetugas = Array.from({ length }, () => ({
    nama: faker.person.firstName(),
    no_hp: faker.phone.number({ style: 'international' }).slice(1),
    created_at: admin.firestore.FieldValue.serverTimestamp()
}))

const dataKos = Array.from({ length }, () => ({
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
await new Promise(res => setTimeout(res, 5000))


const tempPenghuni = await db.collection('penghuni').listDocuments()
const tempKos = await db.collection('kos').listDocuments()

const dataKamar = Array.from({ length: tempKos.length }, (_, idx) => ({
    kamar: 'kamar ' + faker.location.buildingNumber(),
    tgl_masuk: `2020-12-${10 + idx}`,
    kos: tempKos[idx].id,
    penghuni: tempPenghuni[idx].id,
    biaya: faker.finance.amount({ min: 350, max: 1000, dec: 0 }),
    created_at: admin.firestore.FieldValue.serverTimestamp()
}))

console.log('seeding kamar...')
for (const data of dataKamar) {
    db.collection('kamar').add(data)
}

console.log('wait 5second to see new data')
await new Promise(res => setTimeout(res, 5000))

const allPenghuni = (await db.collection('penghuni').get()).docs.map(e => ({ id: e.id, ...e.data() as TSchemaPenghuni }))
const allPetugas = (await db.collection('petugas').get()).docs.map(e => ({ id: e.id, ...e.data() as TSchemaPetugas }))
const allKos = (await db.collection('kos').get()).docs.map(e => ({ id: e.id, ...e.data() as TSchemaKos }))
const allKamar = ((await db.collection('kamar').get()).docs.map(e => ({ id: e.id, ...e.data() as TSchemaKamarKos }))
    .map(e => ({
        ...e,
        kos: allKos.filter(i => i.id, e.kos)[0],
        penghuni: allPenghuni.filter(i => i.id == e.penghuni)[0]
    }))
)


const dataTransaksi = Array.from({ length: allKamar.length }, (_, idx) => ({
    kamar: allKamar[idx],
    petugas: allPetugas[idx],
    // we set low so we can see graphic for total transaksi
    tgl_bayar: `${new Date().toISOString().slice(0, 7)}-${(Math.floor(Math.random() * 10) + 1).toString().padStart(2, '0')}`,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    is_deleted: false
}
))

console.log('seeding transaksi...')
for (const data of dataTransaksi) {
    db.collection('transaksi').add(data)
}

console.log('you must wait to take effect because it didnt use await when delete data')
