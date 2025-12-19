import { useState, useEffect, Fragment } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Select } from '../../../components/ui/select'
import { Badge } from '../../../components/ui/badge'
import { Switch } from '../../../components/ui/switch'
import { Textarea } from '../../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import { pengaturanSitusService } from '../../../services/pengaturanSitusService'
import { useDebounce } from '../../../hooks/useDebounce'
import Loading from '../../../components/shared/Loading'
import { Search, Edit, Save, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { formatDate } from '../../../utils/formatters'

export default function PengaturanList() {
  const [pengaturan, setPengaturan] = useState({})
  const [allPengaturan, setAllPengaturan] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedGrup, setSelectedGrup] = useState('')
  const [expandedGroups, setExpandedGroups] = useState(new Set())
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [advancedMode, setAdvancedMode] = useState(false)
  
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    loadPengaturan()
  }, [])

  useEffect(() => {
    filterAndGroupData()
  }, [debouncedSearch, selectedGrup, allPengaturan])

  const loadPengaturan = async () => {
    try {
      setLoading(true)
      const data = await pengaturanSitusService.getAll()
      setAllPengaturan(data)
      
      // Initialize expanded groups
      const groups = [...new Set(data.map(item => item.grup || 'umum'))]
      setExpandedGroups(new Set(groups))
    } catch (error) {
      console.error('Error loading pengaturan:', error)
      alert('Gagal memuat pengaturan')
    } finally {
      setLoading(false)
    }
  }

  const filterAndGroupData = () => {
    let filtered = allPengaturan

    // Filter by grup
    if (selectedGrup) {
      filtered = filtered.filter(item => (item.grup || 'umum') === selectedGrup)
    }

    // Filter by search (kunci atau deskripsi)
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase()
      filtered = filtered.filter(item =>
        item.kunci.toLowerCase().includes(searchLower) ||
        (item.deskripsi && item.deskripsi.toLowerCase().includes(searchLower))
      )
    }

    // Group by grup
    const grouped = filtered.reduce((acc, item) => {
      const grup = item.grup || 'umum'
      if (!acc[grup]) {
        acc[grup] = []
      }
      acc[grup].push(item)
      return acc
    }, {})

    setPengaturan(grouped)
  }

  const toggleGroup = (grup) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(grup)) {
      newExpanded.delete(grup)
    } else {
      newExpanded.add(grup)
    }
    setExpandedGroups(newExpanded)
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditValue(item.nilai || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const saveEdit = async (item) => {
    try {
      setSavingId(item.id)
      await pengaturanSitusService.update(item.id, { nilai: editValue })
      await loadPengaturan()
      setEditingId(null)
      setEditValue('')
    } catch (error) {
      console.error('Error updating pengaturan:', error)
      alert('Gagal mengupdate pengaturan: ' + error.message)
    } finally {
      setSavingId(null)
    }
  }

  const handleBooleanChange = async (item) => {
    const newValue = item.nilai === 'true' || item.nilai === true ? 'false' : 'true'
    try {
      setSavingId(item.id)
      await pengaturanSitusService.update(item.id, { nilai: newValue })
      await loadPengaturan()
    } catch (error) {
      console.error('Error updating pengaturan:', error)
      alert('Gagal mengupdate pengaturan: ' + error.message)
    } finally {
      setSavingId(null)
    }
  }

  const getTypeBadgeVariant = (tipe) => {
    const variants = {
      text: 'default',
      url: 'default',
      email: 'default',
      phone: 'default',
      number: 'secondary',
      boolean: 'secondary',
    }
    return variants[tipe] || 'default'
  }

  const renderInlineInput = (item) => {
    // Boolean tidak perlu inline edit, langsung toggle dari switch di kolom aksi
    if (item.tipe === 'boolean') {
      return (
        <span className="text-sm">
          {item.nilai === 'true' || item.nilai === true ? 'Aktif' : 'Tidak Aktif'}
        </span>
      )
    }

    if (editingId !== item.id) {
      return (
        <div 
          className="cursor-pointer hover:bg-muted/50 p-1 rounded"
          onClick={() => startEdit(item)}
          title="Klik untuk mengedit"
        >
          <span className="text-sm font-mono">{item.nilai || '-'}</span>
        </div>
      )
    }

    const isSaving = savingId === item.id

    switch (item.tipe) {
      case 'url':
        return (
          <div className="flex items-center gap-2">
            <Input
              type="url"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 text-sm"
              disabled={isSaving}
              autoFocus
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => saveEdit(item)}
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={cancelEdit}
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )
      case 'email':
        return (
          <div className="flex items-center gap-2">
            <Input
              type="email"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 text-sm"
              disabled={isSaving}
              autoFocus
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => saveEdit(item)}
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={cancelEdit}
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )
      case 'phone':
        return (
          <div className="flex items-center gap-2">
            <Input
              type="tel"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 text-sm"
              disabled={isSaving}
              autoFocus
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => saveEdit(item)}
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={cancelEdit}
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )
      case 'number':
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 text-sm"
              disabled={isSaving}
              autoFocus
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => saveEdit(item)}
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={cancelEdit}
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )
      default:
        // Text or long text
        const useTextarea = item.deskripsi && item.deskripsi.length > 100 || (editValue && editValue.length > 50)
        return (
          <div className="flex items-center gap-2">
            {useTextarea ? (
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-20 text-sm min-w-[300px]"
                disabled={isSaving}
                autoFocus
              />
            ) : (
              <Input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-8 text-sm"
                disabled={isSaving}
                autoFocus
              />
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => saveEdit(item)}
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={cancelEdit}
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )
    }
  }

  const getHumanReadableLabel = (kunci) => {
    // Convert snake_case or camelCase to Title Case
    return kunci
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const allGroups = [...new Set(allPengaturan.map(item => item.grup || 'umum'))]

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">Manajemen Pengaturan Situs</CardTitle>
              <CardDescription className="mt-2">
                Kelola pengaturan umum situs
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={advancedMode}
                  onChange={(e) => setAdvancedMode(e.target.checked)}
                  className="w-4 h-4"
                />
                Advanced Settings
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari label atau kunci..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <Select
              value={selectedGrup}
              onChange={(e) => setSelectedGrup(e.target.value)}
              className="bg-background"
            >
              <option value="">Semua Grup</option>
              {allGroups.map(grup => (
                <option key={grup} value={grup}>{grup.charAt(0).toUpperCase() + grup.slice(1)}</option>
              ))}
            </Select>
          </div>

          {Object.keys(pengaturan).length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Tidak ada pengaturan ditemukan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {debouncedSearch 
                      ? `Hasil pencarian untuk "${debouncedSearch}" tidak ditemukan.`
                      : 'Belum ada data pengaturan.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Label / Kunci</TableHead>
                    <TableHead className="w-[100px]">Tipe</TableHead>
                    <TableHead>Nilai</TableHead>
                    {advancedMode && (
                      <>
                        <TableHead className="w-[150px]">Kunci Asli</TableHead>
                        <TableHead className="w-[80px]">Urutan</TableHead>
                        <TableHead className="w-[150px]">Diperbarui</TableHead>
                      </>
                    )}
                    <TableHead className="w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(pengaturan).map((grup) => (
                    <Fragment key={grup}>
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={advancedMode ? 7 : 4} className="font-semibold">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => toggleGroup(grup)}
                            >
                              {expandedGroups.has(grup) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            <span className="capitalize">{grup}</span>
                            <span className="text-xs text-muted-foreground font-normal">
                              ({pengaturan[grup].length} item)
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedGroups.has(grup) && pengaturan[grup].map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="font-bold">
                              {getHumanReadableLabel(item.kunci)}
                            </div>
                            {item.deskripsi && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {item.deskripsi}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1" title={item.kunci}>
                              Key: <span className="font-mono">{item.kunci}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getTypeBadgeVariant(item.tipe)}>
                              {item.tipe}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {renderInlineInput(item)}
                          </TableCell>
                          {advancedMode && (
                            <>
                              <TableCell className="font-mono text-sm">
                                {item.kunci}
                              </TableCell>
                              <TableCell>
                                {item.urutan || '-'}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {formatDate(item.diperbarui_pada)}
                              </TableCell>
                            </>
                          )}
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {item.tipe === 'boolean' ? (
                                <Switch
                                  checked={item.nilai === 'true' || item.nilai === true}
                                  onCheckedChange={() => handleBooleanChange(item)}
                                  disabled={savingId === item.id}
                                />
                              ) : editingId !== item.id ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => startEdit(item)}
                                  title="Edit nilai"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              ) : null}
                              {item.tipe === 'url' && item.nilai && editingId !== item.id && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => window.open(item.nilai, '_blank')}
                                  title="Buka URL"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

