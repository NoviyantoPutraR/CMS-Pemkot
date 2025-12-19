import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog'
import { Button } from '../ui/button'

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  title = 'Konfirmasi Hapus',
  description,
}) {
  const handleConfirm = () => {
    onConfirm()
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  // Generate description message
  const getDescription = () => {
    if (description) {
      return description
    }
    if (itemName) {
      return `Apakah Anda yakin ingin menghapus "${itemName}"? Tindakan ini tidak dapat dibatalkan.`
    }
    return 'Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{getDescription()}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={handleCancel}>
          Batal
        </Button>
        <Button variant="destructive" onClick={handleConfirm}>
          Hapus
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

