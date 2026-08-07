import { X, Server, Database, Globe, Zap, Github, AlertTriangle, CheckCircle, RefreshCw, Key, HardDrive, Clock, Activity, Bell, Bot, Radio } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

function Section({ title, icon: Icon, color, children }: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-6">
      <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${color}`}>
        <Icon className="h-4 w-4" />
        <h3 className="font-bold text-base">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Step({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 pl-4 border-l-2 border-slate-200">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0">
          {num}
        </span>
        <p className="font-semibold text-slate-800 text-sm">{title}</p>
      </div>
      <div className="ml-7 text-sm text-slate-600 space-y-1">{children}</div>
    </div>
  )
}

function InfoBox({ type, children }: { type: 'info' | 'warn' | 'ok'; children: React.ReactNode }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warn: 'bg-amber-50 border-amber-200 text-amber-800',
    ok:   'bg-emerald-50 border-emerald-200 text-emerald-800',
  }
  const icons = { info: '💡', warn: '⚠️', ok: '✅' }
  return (
    <div className={`rounded-lg border px-3 py-2 text-sm mb-2 ${styles[type]}`}>
      {icons[type]} {children}
    </div>
  )
}

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-sm py-1 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 min-w-[160px] shrink-0">{label}</span>
      <span className="font-mono text-slate-800 break-all">{value}</span>
    </div>
  )
}

export default function ServiceManualModal({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* 헤더 */}
        <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white shrink-0">
          <Server className="h-5 w-5 text-blue-400" />
          <div className="flex-1">
            <h2 className="text-base font-bold">서비스 매뉴얼</h2>
            <p className="text-xs text-slate-300 mt-0.5">웹 호스팅 구성 · 구축 절차 · 운영 가이드 (IT 비전공자용)</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 본문 (스크롤) */}
        <div className="flex-1 overflow-y-auto px-6 py-5 text-slate-700">

          {/* ─── 전체 구조 요약 ─── */}
          <Section title="서비스 전체 구조 — 한눈에 보기" icon={Globe} color="border-blue-300 text-blue-700">
            <div className="bg-slate-50 rounded-xl p-4 text-sm font-mono text-slate-700 leading-relaxed mb-3">
              <p className="text-center text-slate-500 text-xs mb-3 font-sans">[ 데이터 흐름 + 자동화 구조 ]</p>
              <div className="flex flex-col items-center gap-1">
                <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-center">
                  🧑 사용자 (웹 브라우저)
                </div>
                <div className="text-slate-400">↓ 접속</div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 text-center">
                  🌐 <strong>Cloudflare Pages</strong><br/>
                  <span className="text-xs text-slate-500">bid-system.pages.dev (화면 담당)</span>
                </div>
                <div className="text-slate-400">↕ API 통신</div>
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-center">
                  ⚙️ <strong>Fly.io</strong><br/>
                  <span className="text-xs text-slate-500">bid-system-backend.fly.dev (서버 담당)</span>
                </div>
                <div className="flex gap-3 mt-1 flex-wrap justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-slate-400 text-xs">↕ 저장/조회</div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-center">
                      🗄️ <strong>CockroachDB</strong><br/>
                      <span className="text-xs text-slate-500">데이터베이스</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-slate-400 text-xs">↕ 빠른 조회</div>
                    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
                      ⚡ <strong>Upstash Redis</strong><br/>
                      <span className="text-xs text-slate-500">캐시(임시저장소)</span>
                    </div>
                  </div>
                </div>
                <div className="text-slate-400">↑ 코드 배포</div>
                <div className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-center">
                  🐙 <strong>GitHub</strong><br/>
                  <span className="text-xs text-slate-500">소스코드 보관 → 자동 배포 + 자동화 워크플로</span>
                </div>
                <div className="flex gap-3 mt-1 flex-wrap justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-slate-400 text-xs">5분 핑</div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-center">
                      📡 <strong>UptimeRobot</strong><br/>
                      <span className="text-xs text-slate-500">절전 방지</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-slate-400 text-xs">알림</div>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-center">
                      🔔 <strong>Discord</strong><br/>
                      <span className="text-xs text-slate-500">운영 알림</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <InfoBox type="info">
              <strong>쉽게 이해하기:</strong> Cloudflare는 "간판(화면)", Render는 "주방(요리)", CockroachDB는 "냉장고", Redis는 "앞 창구", GitHub은 "레시피 노트", UptimeRobot은 "야간 경비원(서버 깨우기)", Discord는 "알림 메신저" 역할입니다.
            </InfoBox>
          </Section>

          {/* ─── 각 서비스 설명 ─── */}
          <Section title="사용 중인 무료 서비스 상세" icon={Database} color="border-emerald-300 text-emerald-700">
            <div className="space-y-3">
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="bg-slate-700 text-white px-3 py-2 text-xs font-semibold flex items-center gap-2">
                  <Github className="h-3.5 w-3.5" /> GitHub — 소스코드 보관소
                </div>
                <div className="px-3 py-2 text-sm space-y-1">
                  <p>• 개발된 프로그램 코드를 저장하는 곳입니다 (Google Docs의 코드 버전)</p>
                  <p>• 코드 변경 시 자동으로 Render·Cloudflare에 새 버전을 배포합니다</p>
                  <p className="text-slate-500">• 계정: kilssang77-web / 저장소: atom-harness-g2b</p>
                  <p className="text-emerald-700 font-medium">• 무료 (공개/비공개 저장소 무제한)</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="bg-orange-600 text-white px-3 py-2 text-xs font-semibold flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" /> Cloudflare Pages — 웹사이트 화면 호스팅
                </div>
                <div className="px-3 py-2 text-sm space-y-1">
                  <p>• 사용자가 보는 웹사이트 화면(HTML/CSS/JS)을 전 세계에 빠르게 제공합니다</p>
                  <p>• GitHub에 코드 올리면 자동으로 새 버전 배포 (약 2~3분 소요)</p>
                  <p className="text-slate-500">• 주소: https://bid-system.pages.dev</p>
                  <p className="text-emerald-700 font-medium">• 무료 (월 500회 빌드, 무제한 트래픽)</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="bg-green-700 text-white px-3 py-2 text-xs font-semibold flex items-center gap-2">
                  <Server className="h-3.5 w-3.5" /> Fly.io — 서버(백엔드) 실행
                </div>
                <div className="px-3 py-2 text-sm space-y-1">
                  <p>• AI 분석, 데이터 조회, 로그인 처리 등 모든 계산을 담당하는 서버입니다</p>
                  <p>• Python(FastAPI) 서버를 클라우드에서 실행해 줍니다</p>
                  <p className="text-slate-500">• 주소: https://bid-system-backend.fly.dev</p>
                  <p className="text-emerald-700 font-medium">• 무료 (shared-cpu-1x, 256MB RAM, <strong>절전모드 없음</strong> — 항상 실행 상태)</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="bg-blue-700 text-white px-3 py-2 text-xs font-semibold flex items-center gap-2">
                  <Database className="h-3.5 w-3.5" /> CockroachDB — 데이터베이스
                </div>
                <div className="px-3 py-2 text-sm space-y-1">
                  <p>• 공고 정보, 낙찰 이력, 투찰 기록 등 모든 데이터를 저장하는 "디지털 창고"입니다</p>
                  <p>• PostgreSQL과 호환되는 분산형 SQL 데이터베이스입니다</p>
                  <p className="text-slate-500">• 클러스터: ap-southeast-1(싱가포르) / 데이터베이스: bid_system</p>
                  <p className="text-emerald-700 font-medium">• 무료 (저장 10GB, 월 500만 RU — 현재 사용량 여유 충분)</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="bg-red-700 text-white px-3 py-2 text-xs font-semibold flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" /> 인메모리 캐시 — 고속 응답 (local_cache)
                </div>
                <div className="px-3 py-2 text-sm space-y-1">
                  <p>• 자주 요청되는 데이터를 빠르게 제공하기 위한 "앞 창구" 역할을 합니다</p>
                  <p>• 서버 프로세스 내 메모리에 캐시 → 외부 의존성 없이 응답속도 단축</p>
                  <p className="text-slate-500">• 방식: Python 딕셔너리 기반 TTL 캐시 (외부 Redis 미사용)</p>
                  <p className="text-emerald-700 font-medium">• 무료 (추가 비용 없음, 서버 재시작 시 캐시 초기화)</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="bg-purple-700 text-white px-3 py-2 text-xs font-semibold flex items-center gap-2">
                  <Radio className="h-3.5 w-3.5" /> UptimeRobot — 서버 절전 방지 모니터
                </div>
                <div className="px-3 py-2 text-sm space-y-1">
                  <p>• 5분마다 서버에 핑(ping)을 보내 서버 상태를 모니터링합니다</p>
                  <p>• Fly.io는 절전모드 없이 항상 실행되므로 주로 장애 감지 용도로 활용합니다</p>
                  <p className="text-slate-500">• 모니터 URL: https://bid-system-backend.fly.dev/api/health</p>
                  <p className="text-emerald-700 font-medium">• 무료 (모니터 50개, 5분 간격)</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-white px-3 py-2 text-xs font-semibold flex items-center gap-2">
                  <Github className="h-3.5 w-3.5" /> GitHub Actions — 자동화 워크플로
                </div>
                <div className="px-3 py-2 text-sm space-y-1">
                  <p>• 코드 배포 후 ML 재학습, 주간 재학습, 월간 점검을 자동으로 실행합니다</p>
                  <p>• 30분 간격 keep-alive 핑으로 서버 상태 확인 및 Fly.io 머신 유지</p>
                  <p className="text-slate-500">• 워크플로 4개: keep-alive, post-deploy-retrain, weekly-maintenance, monthly-health-check</p>
                  <p className="text-emerald-700 font-medium">• 무료 (월 2,000분 — 현재 사용량 약 1,600분 이내)</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="bg-indigo-700 text-white px-3 py-2 text-xs font-semibold flex items-center gap-2">
                  <Bell className="h-3.5 w-3.5" /> Discord — 운영 알림
                </div>
                <div className="px-3 py-2 text-sm space-y-1">
                  <p>• GitHub Actions가 자동화 결과(성공/실패)를 Discord 채널로 실시간 알림합니다</p>
                  <p>• 주간 ML 재학습 결과, 월간 점검 보고서, 배포 후 재학습 결과를 수신합니다</p>
                  <p className="text-emerald-700 font-medium">• 무료 (웹훅 방식, 서버 비용 없음)</p>
                </div>
              </div>
            </div>
          </Section>

          {/* ─── 구축 절차 ─── */}
          <Section title="구축 절차 — 처음부터 끝까지" icon={CheckCircle} color="border-purple-300 text-purple-700">
            <Step num={1} title="GitHub 저장소 준비">
              <p>① github.com 접속 → 회원가입(무료)</p>
              <p>② 새 저장소(Repository) 생성: <code className="bg-slate-100 px-1 rounded">atom-harness-g2b</code></p>
              <p>③ 개발된 소스코드를 저장소에 업로드 (<code className="bg-slate-100 px-1 rounded">git push</code>)</p>
              <InfoBox type="info">GitHub은 구글 드라이브처럼 코드를 저장하는 곳입니다. 코드를 올리면 나머지 서비스들이 자동으로 최신 버전을 받아 갑니다.</InfoBox>
            </Step>

            <Step num={2} title="CockroachDB 데이터베이스 설정">
              <p>① cockroachlabs.com 접속 → 무료 계정 생성</p>
              <p>② Serverless 클러스터 생성: 지역 ap-southeast-1(싱가포르) 선택</p>
              <p>③ 데이터베이스 생성: <code className="bg-slate-100 px-1 rounded">bid_system</code></p>
              <p>④ SQL 스키마(테이블 구조) 파일 실행 → 빈 테이블 생성</p>
              <p>⑤ 나라장터 수집 데이터 Import (공고 약 31,800건, 낙찰 이력 등)</p>
              <p>⑥ 연결 문자열(DATABASE_URL) 복사 → Render 환경변수에 등록</p>
              <InfoBox type="warn">CockroachDB는 일반 PostgreSQL과 SQL 문법이 조금 다릅니다. 특히 <strong>PERCENTILE_CONT</strong> 함수, 날짜 계산(INTERVAL), 나누기 연산(float) 등에서 차이가 있어 별도 처리가 필요했습니다.</InfoBox>
            </Step>

            <Step num={3} title="캐시 설정 (인메모리, 외부 Redis 불필요)">
              <p>• 현재 시스템은 외부 Redis 없이 서버 내 메모리 캐시(local_cache)를 사용합니다</p>
              <p>• 별도 설정 불필요 — 서버 시작 시 자동으로 활성화됩니다</p>
              <InfoBox type="info"><strong>참고:</strong> 과거에는 Upstash Redis를 사용했으나 현재는 서버 내 인메모리 캐시로 전환하여 외부 의존성을 제거했습니다. 서버 재시작 시 캐시가 초기화되지만 성능에 큰 영향은 없습니다.</InfoBox>
            </Step>

            <Step num={4} title="Fly.io 백엔드 서버 배포">
              <p>① fly.io 접속 → 무료 계정 생성 (신용카드 불필요)</p>
              <p>② flyctl CLI 설치: <code className="bg-slate-100 px-1 rounded">iwr https://fly.io/install.ps1 -useb | iex</code> (Windows)</p>
              <p>③ 로그인: <code className="bg-slate-100 px-1 rounded">flyctl auth login</code></p>
              <p>④ bid-system/backend 폴더에서 배포:</p>
              <div className="bg-slate-50 rounded p-2 mt-1 mb-1 font-mono text-xs space-y-0.5">
                <p>cd bid-system/backend</p>
                <p>flyctl deploy</p>
              </div>
              <p>⑤ 환경변수(Secrets) 등록: <code className="bg-slate-100 px-1 rounded">flyctl secrets set DATABASE_URL="..." SECRET_KEY="..."</code></p>
              <p>⑥ 배포 완료 확인: <code className="bg-slate-100 px-1 rounded">https://bid-system-backend.fly.dev/api/health</code></p>
              <InfoBox type="ok">배포가 완료되면 <code>{"status":"ok"}</code> 응답이 반환됩니다. Fly.io는 절전모드 없이 항상 실행됩니다.</InfoBox>
            </Step>

            <Step num={5} title="Cloudflare Pages 프론트엔드 배포">
              <p>① dash.cloudflare.com 접속 → 무료 계정 생성</p>
              <p>② Workers & Pages → Pages → GitHub 연결</p>
              <p>③ 빌드 설정:</p>
              <div className="bg-slate-50 rounded p-2 mt-1 mb-1 font-mono text-xs space-y-0.5">
                <p>Root Directory: bid-system/frontend</p>
                <p>Build Command: npm run build</p>
                <p>Output Directory: dist</p>
              </div>
              <p>④ 환경변수 추가: <code className="bg-slate-100 px-1 rounded">VITE_API_BASE_URL = https://bid-system-backend.fly.dev/api</code></p>
              <p>⑤ 배포 완료: <code className="bg-slate-100 px-1 rounded">https://bid-system.pages.dev</code> 접속 확인</p>
              <InfoBox type="info">코드 변경 후 GitHub에 올리면 Cloudflare Pages가 자동으로 2~3분 내 새 버전을 배포합니다.</InfoBox>
            </Step>

            <Step num={6} title="최초 관리자 계정 생성 및 로그인 확인">
              <p>① Fly.io Secrets에 설정:</p>
              <div className="bg-slate-50 rounded p-2 mt-1 mb-1 font-mono text-xs space-y-0.5">
                <p>flyctl secrets set FIRST_ADMIN_EMAIL=관리자이메일</p>
                <p>flyctl secrets set FIRST_ADMIN_PASSWORD=비밀번호</p>
              </div>
              <p>② 서버 재시작 시 자동으로 관리자 계정 생성</p>
              <p>③ bid-system.pages.dev/login 접속 → 이메일/비밀번호 로그인</p>
              <InfoBox type="warn">비밀번호를 잊었다면 <code>flyctl secrets set FIRST_ADMIN_PASSWORD=새비밀번호</code> 후 <code>flyctl deploy</code>로 재배포하면 계정이 갱신됩니다.</InfoBox>
            </Step>

            <Step num={7} title="ML 모델 학습">
              <p>① 최초 구축 시: 로그인 후 관리자 페이지(/admin) 접속 → "ML 모델 재학습" 버튼 클릭</p>
              <p>② 이후 재배포 시: <strong>자동으로 재학습</strong> (GitHub Actions post-deploy-retrain 워크플로가 8분 후 자동 실행)</p>
              <p>③ Discord에 "✅ 배포 후 ML 재학습 완료" 알림이 오면 정상 완료</p>
              <InfoBox type="ok"><strong>자동화 완료:</strong> 코드 push → Render 재배포 → GitHub Actions가 8분 후 자동 ML 재학습 → Discord 알림. 수동 재학습 불필요.</InfoBox>
            </Step>
          </Section>

          {/* ─── 환경변수 목록 ─── */}
          <Section title="Render 환경변수 전체 목록" icon={Key} color="border-amber-300 text-amber-700">
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 space-y-1">
              <Tag label="DATABASE_URL" value="postgresql://유저:비밀번호@호스트:26257/bid_system?sslmode=verify-full" />
              <Tag label="SECRET_KEY" value="랜덤 64자 문자열 (JWT 암호화 키)" />
              <Tag label="REDIS_URL" value="rediss://default:비밀번호@apt-python-xxxxx.upstash.io:6379" />
              <Tag label="FIRST_ADMIN_EMAIL" value="관리자 이메일 주소" />
              <Tag label="FIRST_ADMIN_PASSWORD" value="최초 관리자 비밀번호" />
              <Tag label="ML_MODELS_PATH" value="/app/ml_models" />
              <Tag label="PYTHONDONTWRITEBYTECODE" value="1" />
              <Tag label="AUTOMATION_SECRET" value="GitHub Actions 자동 ML재학습 인증 키 (임의 랜덤 문자열)" />
            </div>
            <InfoBox type="warn">환경변수는 절대 외부에 공유하지 마세요. 특히 SECRET_KEY와 DATABASE_URL은 시스템 보안의 핵심입니다.</InfoBox>
            <InfoBox type="info"><strong>AUTOMATION_SECRET</strong> 주의: GitHub Secrets의 값과 Render 환경변수 값이 <strong>반드시 동일</strong>해야 합니다. 값이 다르거나 어느 한쪽에만 설정되면 주간 자동 재학습이 403 오류로 실패합니다.</InfoBox>
          </Section>

          {/* ─── 운영 자동화 시스템 ─── */}
          <Section title="운영 자동화 시스템 (현행)" icon={Bot} color="border-violet-300 text-violet-700">
            <InfoBox type="ok">아래 5가지 작업이 모두 자동으로 실행됩니다. 수동 개입 없이 시스템이 유지됩니다.</InfoBox>
            <div className="rounded-lg border border-slate-200 overflow-hidden text-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-xs">
                    <th className="text-left px-3 py-2 font-semibold">역할</th>
                    <th className="text-left px-3 py-2 font-semibold">담당 도구</th>
                    <th className="text-left px-3 py-2 font-semibold">주기</th>
                    <th className="text-left px-3 py-2 font-semibold">알림</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-3 py-2">서버 절전 방지 (주)</td>
                    <td className="px-3 py-2 text-purple-700 font-medium">UptimeRobot</td>
                    <td className="px-3 py-2 text-slate-500">5분마다</td>
                    <td className="px-3 py-2 text-slate-500">없음</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-3 py-2">서버 절전 방지 (백업)</td>
                    <td className="px-3 py-2 font-medium">GitHub Actions</td>
                    <td className="px-3 py-2 text-slate-500">14분마다</td>
                    <td className="px-3 py-2 text-slate-500">없음</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">배포 후 ML 재학습</td>
                    <td className="px-3 py-2 font-medium">GitHub Actions</td>
                    <td className="px-3 py-2 text-slate-500">코드 push 시</td>
                    <td className="px-3 py-2 text-emerald-700">Discord ✓</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-3 py-2">주간 ML 재학습</td>
                    <td className="px-3 py-2 font-medium">GitHub Actions</td>
                    <td className="px-3 py-2 text-slate-500">매주 월요일 오전 10시</td>
                    <td className="px-3 py-2 text-emerald-700">Discord ✓</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">월간 시스템 점검 보고</td>
                    <td className="px-3 py-2 font-medium">GitHub Actions</td>
                    <td className="px-3 py-2 text-slate-500">매월 1일 오전 9시</td>
                    <td className="px-3 py-2 text-emerald-700">Discord ✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="font-semibold text-amber-800 text-sm mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Discord "주간 ML 재학습 실패" 알림을 받았다면
              </p>
              <div className="text-sm text-amber-700 space-y-1">
                <p><strong>원인 1 (가장 흔함):</strong> Render 환경변수에 <code className="bg-white/60 px-1 rounded">AUTOMATION_SECRET</code>이 없거나 GitHub Secrets 값과 다름</p>
                <p className="ml-4">→ Render 대시보드 → Environment → AUTOMATION_SECRET 값 확인 후 일치시키고 Manual Deploy</p>
                <p><strong>원인 2:</strong> 백엔드가 30초 안에 응답 못 함 (콜드 스타트 + 타임아웃)</p>
                <p className="ml-4">→ UptimeRobot이 정상 작동 중이면 드문 케이스. 관리자 페이지에서 수동 재학습 실행</p>
              </div>
            </div>
          </Section>

          {/* ─── 운영 가이드 ─── */}
          <Section title="운영 가이드 — 알아두어야 할 것들" icon={HardDrive} color="border-rose-300 text-rose-700">

            <div className="space-y-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="font-semibold text-emerald-800 text-sm mb-1 flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> 콜드 스타트 — ✅ 자동 해결됨
                </p>
                <p className="text-sm text-emerald-700">
                  Render 무료 플랜의 "15분 미사용 절전" 문제는 <strong>UptimeRobot이 5분마다 서버에 핑</strong>을 보내 완전히 방지됩니다.<br />
                  UptimeRobot이 일시 장애일 때만 GitHub Actions(14분 간격)가 백업으로 핑합니다.<br />
                  <span className="text-slate-500 text-xs">※ UptimeRobot 모니터가 활성 상태인지 가끔 확인하세요.</span>
                </p>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="font-semibold text-blue-800 text-sm mb-1 flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4" /> 코드 업데이트 후 해야 할 일
                </p>
                <ul className="text-sm text-blue-700 space-y-0.5 list-disc list-inside">
                  <li>GitHub에 코드 올리기 (push) → Render/Cloudflare 자동 재배포</li>
                  <li><strong>ML 모델 재학습은 자동</strong> — 배포 8분 후 GitHub Actions가 자동으로 실행하고 Discord로 결과 알림</li>
                  <li>재배포 완료까지 약 5~10분 소요 (Render 대시보드에서 진행 확인 가능)</li>
                  <li>배포 후 Discord에 "✅ 배포 후 ML 재학습 완료" 알림이 오면 모든 작업 완료</li>
                </ul>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-700 text-sm mb-1 flex items-center gap-1.5">
                  <Database className="h-4 w-4" /> 무료 플랜 한도 모니터링
                </p>
                <div className="text-sm text-slate-600 space-y-0.5">
                  <p>• <strong>Render:</strong> 월 750시간 → 하루 24시간 31일 = 744시간 (1대 서버 기준 충분)</p>
                  <p>• <strong>CockroachDB:</strong> 저장 5GB, 월 500만 RU → 현재 여유 충분</p>
                  <p>• <strong>Upstash Redis:</strong> 일 10,000 명령 → 사용자 많아지면 초과 가능</p>
                  <p>• <strong>Cloudflare Pages:</strong> 월 500회 빌드 → 하루 16번 배포해도 충분</p>
                  <p>• <strong>GitHub Actions:</strong> 월 2,000분 → 현재 사용량 매우 여유</p>
                </div>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="font-semibold text-emerald-800 text-sm mb-1 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" /> 정기 유지보수 체크리스트
                </p>
                <ul className="text-sm text-emerald-700 space-y-0.5 list-disc list-inside">
                  <li><strong>매주 (자동):</strong> ML 재학습 — 매주 월요일 GitHub Actions 자동 실행, Discord 결과 알림</li>
                  <li><strong>매월 (자동):</strong> 월간 점검 보고서 — 매월 1일 Discord로 체크리스트 수신</li>
                  <li><strong>매월 (수동):</strong> Discord 월간 점검 보고서의 체크리스트 항목 실행</li>
                  <li><strong>매월 (수동):</strong> 나라장터 데이터 수집 스크립트 실행 (최신 낙찰 데이터 보강)</li>
                  <li><strong>필요 시:</strong> 투찰 결과 기록 (투찰 기록 버튼 활용) → AI 정확도 향상</li>
                </ul>
              </div>

              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
                <p className="font-semibold text-rose-800 text-sm mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> 문제 발생 시 대처 순서
                </p>
                <div className="text-sm text-rose-700 space-y-1">
                  <p><strong>① "서버에 연결할 수 없습니다"</strong> → UptimeRobot 모니터 상태 확인. 비활성이면 재활성화</p>
                  <p><strong>② Discord "ML 재학습 실패" 알림</strong> → Render의 AUTOMATION_SECRET 환경변수 값 확인</p>
                  <p><strong>③ 로그인 401 오류</strong> → Render 환경변수 FIRST_ADMIN_PASSWORD 확인 후 재배포</p>
                  <p><strong>④ AI 추천이 작동 안 함</strong> → 관리자 페이지에서 ML 모델 수동 재학습</p>
                  <p><strong>⑤ 데이터가 저장 안 됨</strong> → Render 로그 확인: 대시보드 → bid-system-backend → Logs</p>
                  <p><strong>⑥ 그 외 오류</strong> → 로그 에러 메시지를 AI(Claude)에 전달하여 해결</p>
                </div>
              </div>

              <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
                <p className="font-semibold text-purple-800 text-sm mb-1 flex items-center gap-1.5">
                  <Globe className="h-4 w-4" /> 커스텀 도메인 연결 방법 (선택사항)
                </p>
                <ul className="text-sm text-purple-700 space-y-0.5 list-disc list-inside">
                  <li>도메인 구매 후 Cloudflare에 네임서버 등록</li>
                  <li>Cloudflare Pages → Custom domains → 도메인 입력 → 자동 SSL 적용</li>
                  <li>bid-system.pages.dev → 회사명.com 으로 접속 가능해짐</li>
                  <li>도메인 비용: 1년 약 1~3만원 (.com 기준)</li>
                </ul>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-700 text-sm mb-1 flex items-center gap-1.5">
                  <Key className="h-4 w-4" /> 서비스 로그인 계정 정보 (안전한 곳에 보관)
                </p>
                <div className="text-sm text-slate-600 space-y-0.5">
                  <p>• <strong>GitHub:</strong> github.com → kilssang77-web 계정</p>
                  <p>• <strong>Fly.io:</strong> fly.io → kil0410@a2m.co.kr 계정</p>
                  <p>• <strong>CockroachDB:</strong> cockroachlabs.com → 동일 이메일</p>
                  <p>• <strong>Upstash:</strong> upstash.com → 동일 이메일 (현재 미사용)</p>
                  <p>• <strong>Cloudflare:</strong> cloudflare.com → 동일 이메일</p>
                  <p>• <strong>UptimeRobot:</strong> uptimerobot.com → 동일 이메일</p>
                </div>
              </div>
            </div>
          </Section>

          {/* ─── 빠른 접속 링크 ─── */}
          <Section title="관리 콘솔 빠른 접속" icon={Globe} color="border-slate-300 text-slate-600">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { name: 'Fly.io (서버 관리)', url: 'https://fly.io/dashboard', desc: '배포·로그·Secrets 관리' },
                { name: 'CockroachDB (DB 관리)', url: 'https://cockroachlabs.cloud', desc: '데이터·쿼리·사용량' },
                { name: 'Upstash (Redis — 미사용)', url: 'https://console.upstash.com', desc: '캐시 모니터링 (현재 미사용)' },
                { name: 'Cloudflare (웹사이트)', url: 'https://dash.cloudflare.com', desc: '배포·도메인·트래픽' },
                { name: 'GitHub (소스코드)', url: 'https://github.com/kilssang77-web/atom-harness-g2b', desc: '코드·커밋 이력' },
                { name: 'GitHub Actions (자동화)', url: 'https://github.com/kilssang77-web/atom-harness-g2b/actions', desc: '워크플로 실행 현황·로그' },
                { name: 'UptimeRobot (서버 감시)', url: 'https://uptimerobot.com/dashboard', desc: '절전방지 모니터 상태' },
                { name: 'BidAI Pro (서비스)', url: 'https://bid-system.pages.dev', desc: '실제 서비스 접속' },
              ].map(({ name, url, desc }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-0.5 p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <span className="font-medium text-slate-700 group-hover:text-blue-700 text-xs">{name}</span>
                  <span className="text-slate-400 text-xs">{desc}</span>
                </a>
              ))}
            </div>
          </Section>

        </div>

        {/* 푸터 */}
        <div className="shrink-0 border-t border-slate-100 px-6 py-3 flex items-center justify-between bg-slate-50">
          <p className="text-xs text-slate-400">BidAI Pro 서비스 매뉴얼 · 2026년 기준</p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
