import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'



const Register = () => {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = async data => {
    try {

    } catch (error) {
      setError("email", { message: "Este email já está a ser usado" })
    }
    console.log('data', data)
  }

  const validateEmail = (value) => {
    const allowedDomains = ['@gmail.com', '@hotmail.com', '@live.com.pt'];
    if (!allowedDomains.some(domain => value.endsWith(domain))) {
      return "Email inválido";
    }
    return true;
  };

  const validatePassword = (value) => {
    if (value.length < 8) {
      return "Password tem de conter 8 letras";
    }
    if (!/[A-Z]/.test(value)) {
      return "A senha deve conter pelo menos 1 letra maiúscula";
    }
    if (!/[a-z]/.test(value)) {
      return "A senha deve conter pelo menos 1 letra minúscula";
    }
    if (!/\d/.test(value)) {
      return "A senha deve conter pelo menos 1 número";
    }
    if (!/[@$!%*?&.,\-_<>=]/.test(value)) {
      return "A senha deve conter pelo menos 1 símbolo";
    }
    return true;
  };

  return (
    <div className='flex h-screen'>
      <div className='m-auto'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center gap-3'>

          <input
            {...register("email", {
              required: "Email é obrigatório",
              validate: validateEmail,
            })}
            type='text' placeholder='Email'
            className='border border-black pl-1' />
          {errors.email && <div className='text-red-500'>{errors.email.message}</div>}

          <input
            {...register("password", {
              required: "Password é obrigatória",
              validate: validatePassword,
            })}
            type='password'
            placeholder='Password'
            className='border border-black pl-1' />
          {errors.password && <div className='text-red-500'>{errors.password.message}</div>}


          <button type='submit' className={`${isSubmitting ? 'bg-gray-600' : 'bg-blue-600 cursor-pointer'} text-white p-1 rounded-md`}>Submit</button>
          <div>Já possui uma conta? <Link className="text-blue-600" to="/">  Login</Link></div>
        </form>
      </div>
    </div>
  )
}

export default Register