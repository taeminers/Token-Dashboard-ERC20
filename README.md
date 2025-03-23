# Token Dashboard

**두나무 프론트엔드 과제 - 이태민 (Taemin Lee)**  
MetaMask를 사용하여 ETH 및 ERC20 토큰을 관리하고 전송할 수 있는 최신 웹 애플리케이션입니다.  
Next.js, TypeScript, Ethers.js로 구축되었습니다.

---

## 주요 기능

### 💰 토큰 대시보드

- ETH 잔액 조회
- ERC20 토큰 잔액 조회
- 토큰 검색

### 💸 토큰 전송

- 임의의 이더리움 주소로 ETH 전송
- 직접 배포한 ERC20 토큰(devETH) 전송
- 전송 금액 유효성 검의(form validation)
- 주소 유효성 검사(form validation)

### 🦊 MetaMask 연동

- 지갑 연결
- 트랜잭션 서명 처리

---

## 개발 진행 순서

1. UI 개발. Logic을 제외한 responsive UI 및 UI 컴포넌트를 먼저 만들었다.
2. Feature 개발 1: connect metamask. 지갑 연결 및 연결 여부에 따른 화면 conditional render 작업, 토큰 불러오기 작업 등.
3. Feature 개발 2: search token. context 를 사용하여 토큰 검색 기능을 구현.
4. Feature 개발 3: send token. 토큰을 보내는 기능 및 user reject 케이스 등 구현.
5. 남은 test 및 refactoring 진행, README 수정

개발 순서 이유: 시간 부족으로 인해 TDD가 익숙하지 않은 저에게 가장 빠른 개발 방법을 선택함.

## 기술 스택

- **프론트엔드 프레임워크**: Next.js 15 (App Router 사용)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **Web3 통합**: Ethers.js
- **테스트 도구**: Jest + React Testing Library
- **상태 관리**: React Context API
- **폼 처리**: React Hook Form
- **Web3 개발 인프라**: Alchemy API

---

## 사전 준비 사항

- Node.js 18.x 이상
- MetaMask 브라우저 확장 프로그램
- Yarn 또는 npm

---

## 시작하기

1. 저장소 클론:

   ```bash
   git clone <repository-url>
   cd token-dashboard
   ```

2. 의존성 설치:

   ```bash
   npm install
   # 또는
   yarn install
   ```

3. `.env.local` 파일을 루트 디렉토리에 생성하고 환경 변수를 추가하세요:

   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
   ```

4. 개발 서버 실행:

   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

5. 브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

---

## 프로젝트 구조

```
token-dashboard/
├── app/                     # Next.js App Router 페이지
├── components/
│   ├── address-section/     # 지갑 주소 표시
│   ├── search-bar/          # 토큰 검색 기능
│   ├── send-form-section/   # 토큰 전송 폼
│   ├── text-field/          # 입력 필드 컴포넌트
│   ├── token-card-list/     # 토큰 잔액 카트
│   └── wallet-dashboard/    # 대시보드 메인 뷰
│   └── ui/                  # reusable 컴포넌트
│       ├── Button/              # 재사용 가능한 버튼 컴포넌트
│       ├── Header/              # 앱 헤더
│       ├── Spinner/             # 로딩 스피너

├── constants/              # 배포한 토큰의 contract 주소 및 ABI 정의
├── context/
│   ├── SearchContext/       # 검색 상태 관리
│   └── WalletContext/       # 지갑 연결 및 상태 관리
├── helpers/                # 유틸리티 함수
└── public/                 # 정적 자산
```

---

## 테스트
시간 부족으로 인해 E2E 테스트는 건너뛰었습니다.
컴포넌트 및 유틸리티에 대한 테스트가 포함되어 있습니다:

```bash
# 전체 테스트 실행
npm test

# 커버리지 포함 테스트 실행
npm test -- --coverage

# 특정 파일 테스트 실행
npm test -- <file-name>
```

**테스트 항목 예시:**

- 컴포넌트 렌더링
- 폼 유효성 검사
- 트랜잭션 처리 로직
- 에러 처리 시나리오
- MetaMask 연동 테스트
- 잔액 실시간 업데이트

---

## 에러 처리

아래와 같은 다양한 예외 상황을 처리합니다:

- MetaMask 미설치 시
- 네트워크 연결 실패
- 트랜잭션 거절
- 잔액 부족
- 잘못된 입력 값
- 트랜잭션 실패

---

## 애매했던 부분들

figma 가 정말 간단했었기에 가정하고 개발했던 사항들이 몇가지 있습니다:

- spinner 처리. Suspense fallback 및 loading 처리 시 spinner 로 대체.
- form validation 의 error 메세지들을 정의하고 넣었다
- figma 에 지갑 주소에 대해고 [‘Wallet Address’에는 연결된 지갑의 주소를 표현하며 지갑 주소의 앞 6자리, 뒤 6자리만 화면과 같은 형태로 출력합니다.] 라고 나와 있지만 figma 에는 7자리로 되어 있었다. 그래서 6으로 했다.
- Assignment Token(ASGN)로 figma 에는 되어 있었지만, 주어진 ERC20Token.sol 의 constructor 그대로 토큰 이름 정의
