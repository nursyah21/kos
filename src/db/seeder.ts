import { faker } from '@faker-js/faker';
import admin from 'firebase-admin';
import { db } from './db';



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
    await db.collection('penghuni').add(data)
}

console.log('seeding petugas...')
for (const data of dataPetugas) {
    await db.collection('petugas').add(data)
}

console.log('seeding kos...')
for (const data of dataKos) {
    await db.collection('kos').add(data)
}

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
    await db.collection('kamar').add(data)
}

const tempKamar = await db.collection('kamar').listDocuments()
const tempPetugas = await db.collection('petugas').listDocuments()

const dataTransaksi = Array.from({ length: 10 }, () => ({
    kamar: tempKamar[randomNumber(8)].id,
    petugas: tempPetugas[randomNumber(8)].id,
    tgl_bayar: `${new Date().toISOString().slice(0, 7)}-${randomNumber(8).toString().padStart(2, '0')}`,
    created_at: admin.firestore.FieldValue.serverTimestamp()
}))

console.log('seeding transaksi...')
for (const data of dataTransaksi) {
    await db.collection('transaksi').add(data)
}