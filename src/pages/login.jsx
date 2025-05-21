import useLogin from '../hooks/useLogin';

function Login() {
    const { onSubmit, register, handleSubmit, isSubmitting } = useLogin()

    return (<>
        <div className="center">
            <div className='p-8 max-w-sm w-full card'>
                <h2 className="text-2xl text-center font-bold ">Continue To Pondok</h2>
                <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <label>Email:
                        <input {...register('email')} autoComplete="username" className="input" type="email" placeholder="email" />
                    </label>
                    <label>Password:
                        <input {...register('password')} autoComplete="current-password" className="input" type="password" placeholder="password" />
                    </label>

                    <button className={'btn'} disabled={isSubmitting} type="submit">Login</button>
                </form>
            </div>
        </div>
    </>);
}

export default Login;