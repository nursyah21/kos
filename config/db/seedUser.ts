import { auth } from "./firebase";

console.log('generate user...')
let user
try {
    user = await auth.getUserByEmail('admin@gmail.com')
} catch { }

if (user) {
    await auth.deleteUser(user.uid)
}

console.log('create user: admin@gmail.com password: password')
await auth.createUser({ email: 'admin@gmail.com', password: 'password' })