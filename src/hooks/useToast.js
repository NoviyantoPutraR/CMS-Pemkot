import { toast } from 'sonner'
import { TOAST_MESSAGES } from '../utils/toastMessages'

/**
 * Custom hook untuk menggunakan toast notification
 * Menyediakan fungsi helper untuk setiap tipe toast dengan pesan yang sudah terdefinisi
 */
export const useToast = () => {
  /**
   * Menampilkan toast success
   * @param {string} messageKey - Key dari TOAST_MESSAGES.SUCCESS
   * @param {string} [customMessage] - Pesan custom (opsional)
   */
  const toastSuccess = (messageKey, customMessage = null) => {
    const message = customMessage || TOAST_MESSAGES.SUCCESS[messageKey] || messageKey
    toast.success(message, {
      duration: 4000,
    })
  }

  /**
   * Menampilkan toast error
   * @param {string} messageKey - Key dari TOAST_MESSAGES.ERROR
   * @param {string} [customMessage] - Pesan custom (opsional)
   */
  const toastError = (messageKey, customMessage = null) => {
    const message = customMessage || TOAST_MESSAGES.ERROR[messageKey] || messageKey
    toast.error(message, {
      duration: 6000,
    })
  }

  /**
   * Menampilkan toast warning
   * @param {string} messageKey - Key dari TOAST_MESSAGES.WARNING
   * @param {string} [customMessage] - Pesan custom (opsional)
   */
  const toastWarning = (messageKey, customMessage = null) => {
    const message = customMessage || TOAST_MESSAGES.WARNING[messageKey] || messageKey
    toast.warning(message, {
      duration: 6000,
    })
  }

  /**
   * Menampilkan toast info
   * @param {string} messageKey - Key dari TOAST_MESSAGES.INFO
   * @param {string} [customMessage] - Pesan custom (opsional)
   */
  const toastInfo = (messageKey, customMessage = null) => {
    const message = customMessage || TOAST_MESSAGES.INFO[messageKey] || messageKey
    toast.info(message, {
      duration: 4000,
    })
  }

  /**
   * Menampilkan toast untuk empty/edge case
   * @param {string} messageKey - Key dari TOAST_MESSAGES.EMPTY
   * @param {string} [customMessage] - Pesan custom (opsional)
   */
  const toastEmpty = (messageKey, customMessage = null) => {
    const message = customMessage || TOAST_MESSAGES.EMPTY[messageKey] || messageKey
    toast.info(message, {
      duration: 4000,
    })
  }

  return {
    toastSuccess,
    toastError,
    toastWarning,
    toastInfo,
    toastEmpty,
  }
}

