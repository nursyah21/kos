import { signInWithEmailAndPassword } from '@firebase/auth'
import { useNavigate } from 'react-router'
import { auth } from '../lib/firebase'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'

function useLogin() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm()
    const navigate = useNavigate()
    const onSubmit = async (data) => {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password)
            navigate('/')
        } catch (err) {
            toast.error('invalid email or password')
            console.log(err)
        }
    }
    return { onSubmit, register, handleSubmit, isSubmitting };
}

export default useLogin;