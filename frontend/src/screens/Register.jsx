import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useRegisterMutation } from '../slices/userApiSlice'
import { setCredentials } from '../slices/authSlice'

// -------------------------Show Password Icon--------------------
import { AiTwotoneEye } from "react-icons/ai";
import { AiTwotoneEyeInvisible } from "react-icons/ai";
// ------------------------------------------------------------------

const Register = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerApi, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard')
    }
  }, [navigate, userInfo]);

  const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  const onSubmit = async data => {
    try {
      const res = await registerApi({ name: data.name, email: data.email, password: data.password }).unwrap();
      dispatch(setCredentials({ ...res }))
      navigate('/resgister')
    } catch (error) {
      console.log(error?.data?.message)
      console.log(error)
      setError("email", { message: "MEH" })
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
      return "Password tem de conter 8 caracteres";
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

  // ---------------------------------Variavel ShowPassword--------------
  const [showPassword, setShowPassword] = useState(false);
  // ---------------------------------Variavel ShowConfirmPassword--------------
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className='flex flex-row h-screen bg-gradient-to-br to-purple-500 from-purple-900'>
      <div className='m-auto flex flex-row h-[470px] shadow-lg'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-3 px-10 w-[380px] bg-white rounded-l-md justify-between items-center'>
          <div className='flex flex-col gap-3 w-full'>
            <div className='text-center pt-6'>REGISTO</div>

            {/* ------------------NAME----------------- */}
            <div>
              <input
                {...register("name", {
                  required: "Nome é obrigatório",
                })}
                type='text' placeholder='Name'
                className='border border-gray-300 rounded w-full h-8 pl-1' />
              {errors.name && <div className='text-red-500'>{errors.name.message}</div>}
            </div>

            {/* ------------------EMAIL----------------- */}
            <div>
              <input
                {...register("email", {
                  required: "Email é obrigatório",
                  validate: validateEmail,
                })}
                type='text' placeholder='Email'
                className='border border-gray-300 rounded w-full h-8 pl-1' />
              {errors.email && <div className='text-red-500'>{errors.email.message}</div>}
            </div>

            {/* ------------------PASSWORD----------------- */}
            <div className='flex flex-row relative items-center'>
              <input
                {...register("password", {
                  required: "Password é obrigatória",
                  validate: validatePassword,
                })}
                type={showPassword ? "text" : "password"}
                placeholder='Password'
                className='border border-gray-300 rounded w-full h-8 pl-1' />
              {errors.password && <div className='text-red-500'>{errors.password.message}</div>}
              <button className="absolute left-[270px]  text-2xl" type="button" onClick={() => { setShowPassword(!showPassword) }}>
                {showPassword ? <AiTwotoneEyeInvisible /> : <AiTwotoneEye />}
              </button>
            </div>

            {/* ------------------CONFIRMAÇÃO DE PASSWORD----------------- */}
            <div className='flex flex-row relative items-center'>
              <input
                {...register('confirmPassword', {
                  required: 'Confirmação de senha é obrigatória',
                  validate: validateConfirmPassword,
                })}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="border border-gray-300 rounded w-full h-8 pl-1" />
              {errors.confirmPassword && <div className="text-red-500">{errors.confirmPassword.message}</div>}
              <button className="absolute left-[270px]  text-2xl" type="button" onClick={() => { setShowConfirmPassword(!showConfirmPassword) }}>
                {showConfirmPassword ? <AiTwotoneEyeInvisible /> : <AiTwotoneEye />}
              </button>
            </div>
          </div>
          {isLoading && <div>Loading...</div>}

          <div className='w-full'>
            <button type='submit' className={`${isSubmitting ? 'bg-gray-600' : 'bg-black cursor-pointer'} text-white p-1 rounded-md mt-4 w-full`}>Registar</button>
            <div className='mb-4'>Já possui uma conta? <Link className="text-blue-600" to="/">  Login</Link></div>
          </div>
        </form>
        <div className='bg-black w-96 rounded-r-md bg-[url("/images/geometric1.jpg")] bg-cover'>
          {/* <div className='text-white p-3 mt-28 text-center text-5xl'> Bem Vindo </div> */}
        </div>
      </div>
    </div>
  )
}

export default Register
