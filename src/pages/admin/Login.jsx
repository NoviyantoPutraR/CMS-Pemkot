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
    <div className="w-screen min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="relative py-3 sm:max-w-sm sm:mx-auto">
        <div className="min-h-96 px-8 py-6 mt-4 text-left bg-white dark:bg-gray-900 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col justify-center items-center h-full select-none">
              <div className="flex flex-col items-center justify-center gap-2 mb-8">
                <a href="/" className="flex items-center justify-center">
                  <img 
                    src="https://unsplash.com/id/ilustrasi/desain-seni-garis-mono-gurun-liar-untuk-t-shirt-lencana-tambalan-stiker-dll-eQ3_S5dU2Rc" 
                    className="w-8" 
                    alt="Logo"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </a>
                <p className="m-0 text-[16px] font-semibold dark:text-white">LOGIN</p>
                <span className="m-0 text-xs max-w-[90%] text-center text-[#8B8E98]">
                  Masuk ke Admin Panel Portal Resmi JatimProv
                </span>
              </div>

              {error && (
                <div className="w-full mb-4 text-red-600 text-sm text-center">{error}</div>
              )}

              <div className="w-full flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-400 dark:text-gray-500">
                  Email
                </label>
                <input
                  {...register('email')}
                  name="email"
                  type="text"
                  required
                  className={`border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900 dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-600 text-xs -mt-4 mb-2">{errors.email.message}</p>
                )}
              </div>

              <div className="w-full flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-400 dark:text-gray-500">
                  Password
                </label>
                <input
                  {...register('password')}
                  name="password"
                  type="password"
                  required
                  className={`border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900 dark:text-white ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-600 text-xs -mt-4 mb-2">{errors.password.message}</p>
                )}
              </div>

              <div className="mt-5 w-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="py-1 px-8 bg-blue-500 hover:bg-blue-800 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Memproses...' : 'Login'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

