import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../utils/validators'
import useAuthStore from '../../store/useAuthStore'

export default function Login() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const signIn = useAuthStore((state) => state.signIn)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setError('')
    setLoading(true)
    
    try {
      const result = await signIn(data.email, data.password)
      
      if (result.success) {
        // Navigate langsung setelah login berhasil
        navigate('/admin', { replace: true })
      } else {
        setError(result.error || 'Email atau password salah')
        setLoading(false)
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat login')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white flex items-center justify-center md:h-screen p-4">
      <div className="[box-shadow:rgba(149,157,165,0.3)_0px_4px_18px] max-w-6xl max-md:max-w-lg rounded-md p-6">
        <div className="grid md:grid-cols-2 items-center gap-8">
          <div className="max-md:order-1">
            <div className="aspect-[12/11]">
              <img
                src="https://readymadeui.com/signin-image.webp"
                className="w-full h-full object-contain"
                alt="login-image"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="md:max-w-md w-full mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-blue-600">Login</h1>
              {error && (
                <div className="mt-4 text-red-600 text-sm">{error}</div>
              )}
            </div>
            
            <div>
              <div className="relative flex items-center">
                <input
                  {...register('email')}
                  name="email"
                  type="text"
                  required
                  className={`w-full text-sm text-gray-900 border-b ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-600 pr-8 px-2 py-3 outline-none placeholder:text-gray-400`}
                  placeholder="Masukkan email"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#bbb"
                  stroke="#bbb"
                  className="w-[18px] h-[18px] absolute right-2"
                  viewBox="0 0 682.667 682.667"
                >
                  <defs>
                    <clipPath id="a" clipPathUnits="userSpaceOnUse">
                      <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                    </clipPath>
                  </defs>
                  <g clipPath="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                    <path
                      fill="none"
                      strokeMiterlimit="10"
                      strokeWidth="40"
                      d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                      data-original="#000000"
                    ></path>
                    <path
                      d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                      data-original="#000000"
                    ></path>
                  </g>
                </svg>
              </div>
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div className="mt-8">
              <div className="relative flex items-center">
                <input
                  {...register('password')}
                  name="password"
                  type="password"
                  required
                  className={`w-full text-sm text-gray-900 border-b ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-600 pr-8 px-2 py-3 outline-none placeholder:text-gray-400`}
                  placeholder="Masukkan password"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#bbb"
                  stroke="#bbb"
                  className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                  viewBox="0 0 128 128"
                >
                  <path
                    d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                    data-original="#000000"
                  ></path>
                </svg>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="mt-12">
              <button
                type="submit"
                disabled={loading}
                className="w-full shadow-xl py-2 px-4 text-[15px] font-medium tracking-wide rounded-md cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

