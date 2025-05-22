import { signInWithEmailAndPassword } from '@firebase/auth'
import { useNavigate } from 'react-router'
import { auth } from '../lib/firebase'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'sonner'

const schema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required()
})

function useLogin() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        resolver: yupResolver(schema)
    })
    const navigate = useNavigate()
    const onSubmit = handleSubmit(async (data) => {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password)
            navigate('/')
        } catch (err) {
            toast.error('invalid email or password')
            console.log(err)
        }
    })
    return { onSubmit, register, handleSubmit, isSubmitting };
}

export default useLogin;