import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, Tag, ToggleLeft, ToggleRight, BookMarked, ExternalLink, AlertCircle, Loader2, User, Users } from 'lucide-react'
import { keywordsApi, bidsApi } from '@/api'
import type { WatchKeyword } from '@/types'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'

const KW_TYPE_CONFIG: Record<string, { label: string; chipCls: string; desc: string }> = {
  agency:  {
    label: '발주기관',
    chipCls: 'bg-violet-50 text-violet-700 border border-violet-200',
    desc: '발주기관명에서 검색',
  },
  title:   {
    label: '공고명',
    chipCls: 'bg-blue-50 text-blue-700 border border-blue-200',
    desc: '공고 제목에서 검색',
  },
  general: {
    label: '일반',
    chipCls: 'bg-slate-100 text-slate-600 border border-slate-200',
    desc: '공고명에서 검색(기본)',
  },
}

interface KeywordMatch {
  keyword_id: number; user_id: number | null; keyword: string; kw_type: string; note: string | null
  match_count: number; new_7d: number
  recent_bids: { id: number; title: string; agency_name: string; base_amount: number; notice_date: string | null; status: string }[]
}

interface FormState { keyword: string; kw_type: string; note: string }
const EMPTY_FORM: FormState = { keyword: '', kw_type: 'general', note: '' }

type TabType = 'my' | 'all'

export default function KeywordsPage() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentUser = useAuthStore((s) => s.user)

  const [activeTab, setActiveTab] = useState<TabType>((searchParams.get('tab') as TabType) ?? 'my')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    setSearchParams((prev) => { prev.set('tab', activeTab); return prev }, { replace: true })
    setSearch('')
    setExpandedId(null)
  }, [activeTab])

  const { data: keywords = [], isLoading } = useQuery<WatchKeyword[]>({
    queryKey: ['keywords'], queryFn: keywordsApi.list,
  })
  const { data: matches = [] } = useQuery<KeywordMatch[]>({
    queryKey: ['keyword-matches'], queryFn: bidsApi.keywordMatches, staleTime: 60_000,
  })

  const createMutation = useMutation({
    mutationFn: keywordsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['keywords'] }); qc.invalidateQueries({ queryKey: ['keyword-matches'] }); resetForm() },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<Pick<WatchKeyword, 'keyword' | 'kw_type' | 'is_active' | 'note'>> }) =>
      keywordsApi.update(id, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['keywords'] }); qc.invalidateQueries({ queryKey: ['keyword-matches'] }); resetForm() },
  })
  const deleteMutation = useMutation({
    mutationFn: keywordsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['keywords'] }); qc.invalidateQueries({ queryKey: ['keyword-matches'] }); setDeleteConfirm(null) },
  })
  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) => keywordsApi.update(id, { is_active }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['keywords'] }); qc.invalidateQueries({ queryKey: ['keyword-matches'] }) },
  })

  function resetForm() { setShowForm(false); setEditId(null); setForm(EMPTY_FORM) }
  function handleEdit(kw: WatchKeyword) { setEditId(kw.id); setForm({ keyword: kw.keyword, kw_type: kw.kw_type, note: kw.note ?? '' }); setShowForm(true) }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.keyword.trim()) return
    const body = { keyword: form.keyword.trim(), kw_type: form.kw_type, note: form.note.trim() || undefined }
    if (editId !== null) updateMutation.mutate({ id: editId, body })
    else createMutation.mutate(body)
  }
  function goToBids(keyword: string) { navigate(`/bids?keyword=${encodeURIComponent(keyword)}`) }
  function isOwner(kw: WatchKeyword) { return currentUser != null && kw.user_id === currentUser.id }

  const myKeywords  = keywords.filter((kw) => currentUser != null && kw.user_id === currentUser.id)
  const allKeywords = keywords

  const displayKeywords = (activeTab === 'my' ? myKeywords : allKeywords).filter(
    (kw) => kw.keyword.toLowerCase().includes(search.toLowerCase()) || (kw.note ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const matchMap = Object.fromEntries(matches.map((m) => [m.keyword_id, m]))
  const myMatches  = matches.filter((m) => currentUser != null && m.user_id === currentUser.id)
  const totalNew7d = (activeTab === 'my' ? myMatches : matches).reduce((s, m) => s + m.new_7d, 0)

  const isMyTab = activeTab === 'my'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-blue-600" />키워드 모니터링
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isMyTab
                ? <>내 키워드 <span className="font-semibold text-slate-700">{myKeywords.length}</span>개 / 활성 <span className="font-semibold text-blue-600">{myKeywords.filter(k => k.is_active).length}</span>개</>
                : <>전체 키워드 <span className="font-semibold text-slate-700">{allKeywords.length}</span>개 / 활성 <span className="font-semibold text-blue-600">{allKeywords.filter(k => k.is_active).length}</span>개</>
              }
            </p>
          </div>
          {isMyTab && (
            <Button onClick={() => { resetForm(); setShowForm(true) }} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />키워드 추가
            </Button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* 탭 */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('my')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              isMyTab
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <User className="h-3.5 w-3.5" />
            내 키워드
            <span className={cn(
              'text-xs font-bold px-1.5 py-0.5 rounded-full',
              isMyTab ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'
            )}>
              {myKeywords.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              !isMyTab
                ? 'bg-white text-slate-700 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <Users className="h-3.5 w-3.5" />
            전체 키워드
            <span className={cn(
              'text-xs font-bold px-1.5 py-0.5 rounded-full',
              !isMyTab ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-500'
            )}>
              {allKeywords.length}
            </span>
          </button>
        </div>

        {/* 안내 카드 */}
        {isMyTab ? (
          <Card className="bg-blue-50 border-blue-100 shadow-none">
            <CardContent className="py-3.5 px-4">
              <p className="text-sm font-semibold text-blue-700 flex items-center gap-1.5 mb-2">
                <Tag className="h-3.5 w-3.5" />키워드 활용 방법
              </p>
              <ul className="text-xs space-y-1 text-blue-700/80 list-disc list-inside">
                <li><strong>공고명 키워드</strong> — 입찰 제목에 해당 단어가 포함된 공고를 즉시 검색</li>
                <li><strong>발주기관 키워드</strong> — 특정 기관에서 발주한 공고를 모니터링</li>
                <li>각 키워드별 매칭 공고 수와 최근 7일 신규 건수를 확인하고 빠르게 이동할 수 있습니다.</li>
              </ul>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-50 border-slate-200 shadow-none">
            <CardContent className="py-3 px-4">
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 shrink-0" />
                전체 사용자가 등록한 키워드를 <strong>조회 전용</strong>으로 볼 수 있습니다. 본인 키워드만 추가·수정·삭제 가능합니다.
              </p>
            </CardContent>
          </Card>
        )}

        {totalNew7d > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
            {isMyTab ? '내 키워드' : '전체 키워드'} 최근 7일 신규 매칭 공고
            <strong className="text-amber-800">{totalNew7d}건</strong>이 있습니다.
          </div>
        )}

        {/* 키워드 추가/수정 폼 — 내 키워드 탭에서만 */}
        {isMyTab && showForm && (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Tag className="h-4 w-4 text-blue-600" />{editId !== null ? '키워드 수정' : '새 키워드 추가'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-sm font-medium text-slate-600">키워드 *</Label>
                  <Input
                    type="text"
                    value={form.keyword}
                    onChange={(e) => setForm({ ...form, keyword: e.target.value })}
                    placeholder="예: 서울시, 도로공사, 교량..."
                    required
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-600">유형</Label>
                  <Select value={form.kw_type} onValueChange={(v) => setForm({ ...form, kw_type: v })}>
                    <SelectTrigger className="border-slate-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">일반 (공고명 검색)</SelectItem>
                      <SelectItem value="agency">발주기관명 검색</SelectItem>
                      <SelectItem value="title">공고명 검색</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">{KW_TYPE_CONFIG[form.kw_type]?.desc}</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-600">메모</Label>
                  <Input
                    type="text"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="선택사항"
                    className="border-slate-200"
                  />
                </div>
                <div className="md:col-span-4 flex justify-end gap-2 pt-1">
                  <Button type="button" variant="outline" onClick={resetForm} className="border-slate-200 text-slate-600">취소</Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-blue-600 hover:bg-blue-700 gap-2">
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {editId !== null ? '수정' : '추가'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* 검색 */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="키워드 검색..."
            className="pl-9 border-slate-200 bg-white"
          />
        </div>

        {/* 키워드 테이블 */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : displayKeywords.length === 0 ? (
            <div className="py-20 text-center">
              <Tag className="h-10 w-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                {search ? '검색 결과가 없습니다.' : isMyTab ? '등록된 키워드가 없습니다.' : '키워드가 없습니다.'}
              </p>
              {!search && isMyTab && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-slate-200 text-slate-600"
                  onClick={() => { resetForm(); setShowForm(true) }}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />첫 키워드 추가
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-200">
                  <TableHead className="text-slate-600 font-semibold">키워드</TableHead>
                  <TableHead className="text-slate-600 font-semibold">유형</TableHead>
                  <TableHead className="text-slate-600 font-semibold">매칭 공고</TableHead>
                  <TableHead className="text-slate-600 font-semibold">메모</TableHead>
                  <TableHead className="text-slate-600 font-semibold">활성</TableHead>
                  <TableHead className="text-slate-600 font-semibold">등록일</TableHead>
                  {isMyTab && <TableHead className="text-slate-600 font-semibold">관리</TableHead>}
                  {!isMyTab && <TableHead className="text-slate-600 font-semibold">등록자</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayKeywords.map((kw) => {
                  const m = matchMap[kw.id]
                  const isExpanded = expandedId === kw.id
                  const kwConf = KW_TYPE_CONFIG[kw.kw_type] ?? KW_TYPE_CONFIG.general
                  const mine = isOwner(kw)
                  return (
                    <>
                      <TableRow key={kw.id} className={cn('hover:bg-slate-50/50 border-b border-slate-100 transition-colors', !kw.is_active && 'opacity-50')}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              'h-7 w-7 rounded-lg flex items-center justify-center shrink-0',
                              mine ? 'bg-blue-50' : 'bg-slate-100'
                            )}>
                              <Tag className={cn('h-3.5 w-3.5', mine ? 'text-blue-600' : 'text-slate-400')} />
                            </div>
                            <span className="font-semibold text-slate-800">{kw.keyword}</span>
                            {mine && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">내 키워드</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={cn('text-sm font-medium px-2 py-0.5 rounded-full', kwConf.chipCls)}>
                            {kwConf.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          {kw.is_active && m ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => goToBids(kw.keyword)}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline"
                              >
                                <ExternalLink className="h-3 w-3" />{m.match_count.toLocaleString()}건
                              </button>
                              {m.new_7d > 0 && (
                                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                                  +{m.new_7d} 신규
                                </span>
                              )}
                              {m.recent_bids.length > 0 && (
                                <button
                                  onClick={() => setExpandedId(isExpanded ? null : kw.id)}
                                  className="text-xs text-slate-500 hover:text-slate-600 underline"
                                >
                                  {isExpanded ? '접기' : '최근 공고'}
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">{kw.is_active ? '집계 중...' : '비활성'}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-500 text-xs">{kw.note ?? '-'}</TableCell>
                        <TableCell>
                          {mine ? (
                            <button
                              onClick={() => toggleMutation.mutate({ id: kw.id, is_active: !kw.is_active })}
                              title={kw.is_active ? '비활성화' : '활성화'}
                              className="transition-opacity hover:opacity-70"
                            >
                              {kw.is_active
                                ? <ToggleRight className="h-6 w-6 text-blue-600" />
                                : <ToggleLeft className="h-6 w-6 text-slate-500" />}
                            </button>
                          ) : (
                            kw.is_active
                              ? <ToggleRight className="h-6 w-6 text-slate-300 cursor-not-allowed" />
                              : <ToggleLeft className="h-6 w-6 text-slate-200 cursor-not-allowed" />
                          )}
                        </TableCell>
                        <TableCell className="text-slate-500 text-xs">{new Date(kw.created_at).toLocaleDateString('ko-KR')}</TableCell>
                        {isMyTab && (
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost" size="icon"
                                className="h-7 w-7 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                onClick={() => handleEdit(kw)}
                                title="수정"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost" size="icon"
                                className="h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => setDeleteConfirm(kw.id)}
                                title="삭제"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                        {!isMyTab && (
                          <TableCell>
                            {mine ? (
                              <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">나</span>
                            ) : (
                              <span className="text-xs text-slate-400">다른 사용자</span>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                      {isExpanded && m && m.recent_bids.length > 0 && (
                        <TableRow key={`${kw.id}-expand`}>
                          <TableCell colSpan={isMyTab ? 7 : 7} className="bg-slate-50 px-6 py-4">
                            <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                              <Tag className="h-3 w-3" />최근 매칭 공고
                            </div>
                            <div className="space-y-1.5">
                              {m.recent_bids.map((b) => (
                                <div
                                  key={b.id}
                                  className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-colors"
                                  onClick={() => navigate(`/bids/${b.id}`)}
                                >
                                  <div className="truncate max-w-md">
                                    <span className="text-blue-700 font-medium text-xs">{b.title}</span>
                                    <span className="text-slate-500 ml-2 text-xs">{b.agency_name}</span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0 ml-3">
                                    <span className="text-xs text-slate-500">{b.notice_date ? new Date(b.notice_date).toLocaleDateString('ko-KR') : '-'}</span>
                                    <span className={cn('text-sm font-medium px-1.5 py-0.5 rounded-full', b.status === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200')}>
                                      {b.status === 'open' ? '공고중' : '개찰완료'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={() => goToBids(kw.keyword)}
                              className="mt-2.5 text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />전체 {m.match_count}건 보기
                            </button>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteConfirm !== null} onOpenChange={(o) => { if (!o) setDeleteConfirm(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-slate-900 font-semibold">키워드 삭제</DialogTitle>
            <DialogDescription className="text-slate-500">이 키워드를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="border-slate-200">취소</Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm !== null && deleteMutation.mutate(deleteConfirm)}
              disabled={deleteMutation.isPending}
              className="gap-2"
            >
              {deleteMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
