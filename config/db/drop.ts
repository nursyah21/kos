import { db } from "./firebase"

// firestore doesnt support to delete all, like drop table
// so you must delete one by one. 
// or you just cant delete in firebase

console.log('delete all penghuni...')
for (const data of (await db.collection('penghuni').listDocuments())) {
    db.doc('penghuni/' + data.id).delete()
}

console.log('delete all petugas...')
for (const data of (await db.collection('petugas').listDocuments())) {
    db.doc('petugas/' + data.id).delete()
}

console.log('delete all kos...')
for (const data of (await db.collection('kos').listDocuments())) {
    db.doc('kos/' + data.id).delete()
}

console.log('delete all kamar...')
for (const data of (await db.collection('kamar').listDocuments())) {
    db.doc('kamar/' + data.id).delete()
}

console.log('delete all transaksi...')
for (const data of (await db.collection('transaksi').listDocuments())) {
    db.doc('transaksi/' + data.id).delete()
}

console.log('you must wait to take effect because it didnt use await when delete data')