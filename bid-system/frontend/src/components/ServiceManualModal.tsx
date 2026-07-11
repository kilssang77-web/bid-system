import { X, Server, Database, Globe, Zap, Github, AlertTriangle, CheckCircle, RefreshCw, Key, HardDrive, Clock } from 'lucide-react'

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
              <p className="text-center text-slate-500 text-xs mb-3 font-sans">[ 데이터 흐름 ]</p>
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
                  ⚙️ <strong>Render.com</strong><br/>
                  <span className="text-xs text-slate-500">bid-system-backend-ssu1.onrender.com (서버 담당)</span>
                </div>
                <div className="flex gap-4 mt-1">
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-slate-400">↕ 저장/조회</div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-center">
                      🗄️ <strong>CockroachDB</strong><br/>
                      <span className="text-xs text-slate-500">데이터베이스</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-slate-400">↕ 빠른 조회</div>
                    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
                      ⚡ <strong>Upstash Redis</strong><br/>
                      <span className="text-xs text-slate-500">캐시(임시저장소)</span>
                    </div>
                  </div>
                </div>
                <div className="text-slate-400">↑</div>
                <div className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-center">
                  🐙 <strong>GitHub</strong><br/>
                  <span className="text-xs text-slate-500">소스코드 보관 → 자동 배포 트리거</span>
                </div>
              </div>
            </div>
            <InfoBox type="info">
              <strong>쉽게 이해하기:</strong> Cloudflare는 "간판(화면)", Render는 "주방(요리)", CockroachDB는 "냉장고(재료 보관)", Redis는 "앞에 놓은 그릇(빨리 꺼내기)", GitHub은 "레시피 노트" 역할입니다.
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
                  <Server className="h-3.5 w-3.5" /> Render.com — 서버(백엔드) 실행
                </div>
                <div className="px-3 py-2 text-sm space-y-1">
                  <p>• AI 분석, 데이터 조회, 로그인 처리 등 모든 계산을 담당하는 서버입니다</p>
                  <p>• Python(FastAPI) 서버를 클라우드에서 실행해 줍니다</p>
                  <p className="text-slate-500">• 주소: https://bid-system-backend-ssu1.onrender.com</p>
                  <p className="text-amber-700 font-medium">• 무료 (월 750시간, <strong>15분 미사용 시 절전모드</strong> → 첫 접속 30~60초 대기)</p>
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
                  <p className="text-emerald-700 font-medium">• 무료 (저장 5GB, 월 500만 RU — 현재 사용량 여유 충분)</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="bg-red-700 text-white px-3 py-2 text-xs font-semibold flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" /> Upstash Redis — 캐시 (임시 고속 저장소)
                </div>
                <div className="px-3 py-2 text-sm space-y-1">
                  <p>• 자주 요청되는 데이터를 빠르게 제공하기 위한 "앞 창구" 역할을 합니다</p>
                  <p>• DB까지 가지 않고 Redis에서 바로 응답 → 응답속도 50~80% 단축</p>
                  <p className="text-slate-500">• 인스턴스명: bid-redis / 포트: 6379 / TLS 활성화</p>
                  <p className="text-emerald-700 font-medium">• 무료 (일 10,000 명령, 256MB)</p>
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

            <Step num={3} title="Upstash Redis 설정">
              <p>① upstash.com 접속 → 무료 계정 생성</p>
              <p>② 새 Redis 인스턴스 생성: 이름 <code className="bg-slate-100 px-1 rounded">bid-redis</code></p>
              <p>③ 연결 주소 복사: <code className="bg-slate-100 px-1 rounded">rediss://default:비밀번호@도메인:6379</code></p>
              <p>④ Render 환경변수 REDIS_URL에 등록</p>
              <InfoBox type="warn"><strong>포트 주의:</strong> Upstash 무료 플랜은 포트 <strong>6379</strong>를 사용합니다 (6380 아님). REDIS_URL에 :6379가 맞는지 반드시 확인하세요.</InfoBox>
            </Step>

            <Step num={4} title="Render.com 백엔드 서버 배포">
              <p>① render.com 접속 → 무료 계정 생성</p>
              <p>② New → Web Service → GitHub 저장소 연결</p>
              <p>③ 배포 설정:</p>
              <div className="bg-slate-50 rounded p-2 mt-1 mb-1 font-mono text-xs space-y-0.5">
                <p>Root Directory: bid-system/backend</p>
                <p>Build Command: pip install -r requirements.txt</p>
                <p>Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT</p>
              </div>
              <p>④ 환경변수(Environment Variables) 설정 (아래 환경변수 목록 참조)</p>
              <p>⑤ 배포 완료 확인: <code className="bg-slate-100 px-1 rounded">https://bid-system-backend-ssu1.onrender.com/health</code></p>
              <InfoBox type="ok">배포가 완료되면 Render 대시보드에서 "Live" 녹색 표시가 나타납니다.</InfoBox>
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
              <p>④ 환경변수 추가: <code className="bg-slate-100 px-1 rounded">VITE_API_BASE_URL = https://bid-system-backend-ssu1.onrender.com/api</code></p>
              <p>⑤ 배포 완료: <code className="bg-slate-100 px-1 rounded">https://bid-system.pages.dev</code> 접속 확인</p>
              <InfoBox type="info">코드 변경 후 GitHub에 올리면 Cloudflare Pages가 자동으로 2~3분 내 새 버전을 배포합니다.</InfoBox>
            </Step>

            <Step num={6} title="최초 관리자 계정 생성 및 로그인 확인">
              <p>① Render 환경변수에 설정:</p>
              <div className="bg-slate-50 rounded p-2 mt-1 mb-1 font-mono text-xs space-y-0.5">
                <p>FIRST_ADMIN_EMAIL=관리자이메일</p>
                <p>FIRST_ADMIN_PASSWORD=비밀번호</p>
              </div>
              <p>② 서버 재시작 시 자동으로 관리자 계정 생성</p>
              <p>③ bid-system.pages.dev/login 접속 → 이메일/비밀번호 로그인</p>
              <InfoBox type="warn">비밀번호를 잊었다면 Render 대시보드 → Environment → FIRST_ADMIN_PASSWORD 값 수정 후 Manual Deploy(재배포)하면 계정이 갱신됩니다.</InfoBox>
            </Step>

            <Step num={7} title="ML 모델 학습">
              <p>① 로그인 후 관리자 페이지(/admin) 접속</p>
              <p>② "ML 모델 재학습" 버튼 클릭 → 학습 완료 대기(수 분)</p>
              <p>③ AI 투찰결정 기능에서 "모델 버전" 표시 확인</p>
              <InfoBox type="warn"><strong>중요:</strong> Render 재배포(코드 업데이트) 시마다 학습된 모델 파일이 초기화됩니다. 재배포 후 반드시 재학습 필요합니다.</InfoBox>
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
            </div>
            <InfoBox type="warn">환경변수는 절대 외부에 공유하지 마세요. 특히 SECRET_KEY와 DATABASE_URL은 시스템 보안의 핵심입니다.</InfoBox>
          </Section>

          {/* ─── 향후 운영 가이드 ─── */}
          <Section title="향후 운영 가이드 — 알아두어야 할 것들" icon={HardDrive} color="border-rose-300 text-rose-700">

            <div className="space-y-3">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="font-semibold text-amber-800 text-sm mb-1 flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> 콜드 스타트 (가장 자주 겪는 현상)
                </p>
                <p className="text-sm text-amber-700">
                  Render 무료 플랜은 <strong>15분 동안 아무도 접속하지 않으면 서버가 절전 모드</strong>로 전환됩니다.<br />
                  이 상태에서 첫 접속 시 "서버에 연결할 수 없습니다" 오류가 뜨다가 30~60초 후 자동 복구됩니다.<br />
                  <strong>해결책:</strong> 잠시 기다렸다가 새로고침(F5)하면 됩니다. 유료 플랜($7/월)으로 전환하면 해결됩니다.
                </p>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="font-semibold text-blue-800 text-sm mb-1 flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4" /> 코드 업데이트 후 반드시 해야 할 일
                </p>
                <ul className="text-sm text-blue-700 space-y-0.5 list-disc list-inside">
                  <li>GitHub에 코드 올리기 (push) → Render/Cloudflare 자동 재배포</li>
                  <li>Render 재배포 후 <strong>관리자 페이지에서 ML 모델 재학습</strong> 필수</li>
                  <li>재배포 완료까지 약 5~10분 소요 (Render 대시보드에서 진행 확인 가능)</li>
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
                </div>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="font-semibold text-emerald-800 text-sm mb-1 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" /> 정기 유지보수 체크리스트
                </p>
                <ul className="text-sm text-emerald-700 space-y-0.5 list-disc list-inside">
                  <li><strong>매주:</strong> 관리자 페이지에서 ML 모델 재학습 (낙찰 데이터 누적 반영)</li>
                  <li><strong>매월:</strong> CockroachDB 콘솔에서 데이터 사용량 확인</li>
                  <li><strong>매월:</strong> 나라장터 데이터 수집 스크립트 실행 (최신 낙찰 데이터 보강)</li>
                  <li><strong>필요 시:</strong> 투찰 결과 기록 (투찰 기록 버튼 활용) → AI 정확도 향상</li>
                </ul>
              </div>

              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
                <p className="font-semibold text-rose-800 text-sm mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> 문제 발생 시 대처 순서
                </p>
                <div className="text-sm text-rose-700 space-y-1">
                  <p><strong>① "서버에 연결할 수 없습니다"</strong> → 30~60초 대기 후 새로고침 (콜드 스타트)</p>
                  <p><strong>② 로그인 401 오류</strong> → Render 환경변수 FIRST_ADMIN_PASSWORD 확인 후 재배포</p>
                  <p><strong>③ AI 추천이 작동 안 함</strong> → 관리자 페이지에서 ML 모델 재학습</p>
                  <p><strong>④ 데이터가 저장 안 됨</strong> → Render 로그 확인: 대시보드 → bid-system-backend → Logs</p>
                  <p><strong>⑤ 그 외 오류</strong> → render.com 로그 확인 → 에러 메시지를 AI(Claude)에 전달하여 해결</p>
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
                  <p>• <strong>Render:</strong> render.com → kil0410@a2m.co.kr 계정</p>
                  <p>• <strong>CockroachDB:</strong> cockroachlabs.com → 동일 이메일</p>
                  <p>• <strong>Upstash:</strong> upstash.com → 동일 이메일</p>
                  <p>• <strong>Cloudflare:</strong> cloudflare.com → 동일 이메일</p>
                </div>
              </div>
            </div>
          </Section>

          {/* ─── 빠른 접속 링크 ─── */}
          <Section title="관리 콘솔 빠른 접속" icon={Globe} color="border-slate-300 text-slate-600">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { name: 'Render (서버 관리)', url: 'https://dashboard.render.com', desc: '배포·로그·환경변수' },
                { name: 'CockroachDB (DB 관리)', url: 'https://cockroachlabs.cloud', desc: '데이터·쿼리·사용량' },
                { name: 'Upstash (Redis 관리)', url: 'https://console.upstash.com', desc: '캐시 모니터링' },
                { name: 'Cloudflare (웹사이트)', url: 'https://dash.cloudflare.com', desc: '배포·도메인·트래픽' },
                { name: 'GitHub (소스코드)', url: 'https://github.com/kilssang77-web/atom-harness-g2b', desc: '코드·커밋 이력' },
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
