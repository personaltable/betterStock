import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const Register = () => {
  const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  const onSubmit = async data => {
    try {

    } catch (error) {
      setError("email", { message: "Este email já está a ser usado" })
    }
    console.log('data', data)
  }

  {/* ------------------EMAIL----------------- */ }
  const validateEmail = (value) => {
    const allowedDomains = ['@gmail.com', '@hotmail.com', '@live.com.pt'];
    if (!allowedDomains.some(domain => value.endsWith(domain))) {
      return "Email inválido";
    }
    return true;
  };

  {/* ------------------PASSWORD----------------- */ }
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

  {/* ------------------CONFIRMAÇÃO DE PASSWORD----------------- */ }
  const validateConfirmPassword = (value) => {
    if (value !== watch('password')) {
      return 'As senhas não coincidem';
    }
    return true;
  };
  // // watch é uma função do useForm que permite observar os valores dos campos do formulário em tempo
  //  real. É usada para comparar o valor atual do campo de senha com o campo de confirmação de senha
  //   para validar se ambos são iguais.

  return (
    <div className='flex flex-row h-screen bg-gradient-to-br to-purple-500 from-purple-900'>
      <div className='m-auto flex flex-row h-96 shadow-lg'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-3 px-10 bg-white rounded-l-md justify-between items-center'>
          <div className='flex flex-col gap-3'>
            <div className='text-center pt-6'>REGISTO</div>

            {/* ------------------EMAIL----------------- */}
            <input
              {...register("email", {
                required: "Email é obrigatório",
                validate: validateEmail,
              })}
              type='text' placeholder='Email'
              className='border border-gray-300 rounded w-60 h-8 pl-1' />
            {errors.email && <div className='text-red-500'>{errors.email.message}</div>}

            {/* ------------------PASSWORD----------------- */}
            <input
              {...register("password", {
                required: "Password é obrigatória",
                validate: validatePassword,
              })}
              type='password'
              placeholder='Password'
              className='border border-gray-300 rounded w-60 h-8 pl-1' />
            {errors.password && <div className='text-red-500'>{errors.password.message}</div>}

            {/* ------------------CONFIRMAÇÃO DE PASSWORD----------------- */}
            <input
              {...register('confirmPassword', {
                required: 'Confirmação de senha é obrigatória',
                validate: validateConfirmPassword,
              })}
              type="password"
              placeholder="Confirm Password"
              className="border border-gray-300 rounded w-60 h-8 pl-1" />
            {errors.confirmPassword && <div className="text-red-500">{errors.confirmPassword.message}</div>}

          </div>
          <div className='w-full'>
            <button type='submit' className={`${isSubmitting ? 'bg-gray-600' : 'bg-black cursor-pointer'} text-white p-1 rounded-md mt-4 w-full`}>Registar</button>
            <div>Já possui uma conta? <Link className="text-blue-600" to="/">  Login</Link></div>
          </div>
        </form>
        <div className='bg-black w-96 rounded-r-md bg-[url("/images/geometric.jpg")] bg-cover'>
          {/* <div className='text-white p-3 mt-28 text-center text-5xl'> Bem Vindo </div> */}
        </div>
      </div>
    </div>
  )
}

export default Register
