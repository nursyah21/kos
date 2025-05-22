import { signInWithEmailAndPassword } from "@firebase/auth"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { auth } from "../lib/firebase"
import { schemaLogin } from "../schema"


function useHooks() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        resolver: yupResolver(schemaLogin)
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
    const location = window.location.hostname
    const isDemo = (location == 'localhost' || location == 'demo-kos.surge.sh')
    return { onSubmit, register, isSubmitting, isDemo };
}

function Login() {
    const { onSubmit, register, isSubmitting, isDemo } = useHooks()

    return (<>
        <div className="center">
            <div className='p-8 max-w-sm w-full card'>
                <h2 className="text-2xl text-center font-bold ">Continue To Pondok</h2>
                <form className="flex flex-col gap-4 mt-4" onSubmit={onSubmit}>
                    <label>Email:
                        <input {...register('email')} autoComplete="username" className="input" type="email" placeholder="email" />
                    </label>
                    <label>Password:
                        <input {...register('password')} autoComplete="current-password" className="input" type="password" placeholder="password" />
                    </label>

                    <button className={'btn'} disabled={isSubmitting} type="submit">Login</button>
                </form>
            </div>
            {isDemo && <>
                for demo: <br />
                email: admin@gmail.com <br />
                password: password
            </>
            }
        </div>
    </>);
}

export default Login;