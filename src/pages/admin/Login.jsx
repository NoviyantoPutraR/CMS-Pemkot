import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
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
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8 font-inter relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shine"></div>

          <div className="relative px-8 py-10">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col items-center mb-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-6"
                >
                  <a href="/" className="flex items-center justify-center">
                    <img 
                      src="/logo.png" 
                      className="w-20 h-20 object-contain" 
                      alt="Logo Portal Resmi Provinsi Kerja Baik"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </a>
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-2xl font-black mb-2"
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    color: '#0052FF'
                  }}
                >
                  LOGIN
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-[85%] leading-relaxed"
                >
                  Masuk ke Admin Panel Portal Resmi Provinsi Kerja Baik
                </motion.p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="w-full"
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      {...register('email')}
                      name="email"
                      type="email"
                      required
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-sm outline-none transition-all duration-300 ${
                        errors.email
                          ? 'border-red-400 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500'
                          : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10'
                      }`}
                      placeholder="nama@email.com"
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="w-full"
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      {...register('password')}
                      name="password"
                      type="password"
                      required
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-sm outline-none transition-all duration-300 ${
                        errors.password
                          ? 'border-red-400 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500'
                          : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.password.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="pt-2"
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        'Login'
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </motion.div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
      `}</style>
    </div>
  )
}

