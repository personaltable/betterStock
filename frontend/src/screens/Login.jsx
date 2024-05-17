import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const Login = () => {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = async data => {
    try {

    } catch (error) {
      setError("root", { message: "Este email já está a ser usado" })
    }
    console.log('data', data)
  }

  return (
    <div className='flex flex-row h-screen bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500'>
      <div className='m-auto flex flex-row h-80'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-3 px-8 bg-white rounded-l-md justify-between items-center'>
          <div className='flex flex-col gap-3'>
            <div className='text-center pt-6'>LOGIN</div>

            <div>
              <input
                {...register("email", {
                  required: "Email é obrigatório",
                  validate: (value) => {
                    if (!value.includes('@')) {
                      return "Email inválido";
                    }
                    return true;
                  }
                })}
                type='text' placeholder='Email'
                className='border border-gray-300 rounded w-60 h-8 pl-1' />
              {errors.email && <div className='text-red-500'>{errors.email.message}</div>}
            </div>

            <div>
              <input
                {...register("password", {
                  required: "Password é obrigatória",
                })}
                type='password'
                placeholder='Password'
                className='border border-gray-300 rounded w-60 h-8 pl-1' />
              {errors.password && <div className='text-red-500'>{errors.password.message}</div>}
              <div>Esqueceu a senha?</div>
            </div>
          </div>

          <div className='w-full'>
            <button type='submit' className={`${isSubmitting ? 'bg-gray-600' : 'bg-black cursor-pointer'} text-white p-1 rounded-md mt-4 w-full`}>Login</button>
            {errors.root && <div className='text-red-500'>{errors.root.message}</div>}
            <div>Não tem conta? <Link className="text-blue-600" to="/register">Signup</Link></div>
          </div>
        </form>
        <div className='bg-black w-80 rounded-r-md'>Welcome</div>
      </div>
    </div>
  )
}

export default Login