# Solana Program 백엔드 연동 계획

## 1. 의존성 추가

```python
# requirements.txt에 추가
solana>=0.30.0
solders>=0.18.0
anchorpy>=0.19.0
base58>=2.1.1
construct>=2.10.68
```

## 2. Solana 서비스 레이어 구조

```
app/
├── solana/
│   ├── __init__.py
│   ├── client.py          # Solana RPC 클라이언트
│   ├── programs/          # 프로그램별 인터페이스
│   │   ├── __init__.py
│   │   ├── profile_manager.py
│   │   ├── job_application.py
│   │   ├── hiring_rewards.py
│   │   └── contact_gate.py
│   ├── types/             # IDL 타입 정의
│   │   ├── __init__.py
│   │   └── program_types.py
│   └── utils/
│       ├── __init__.py
│       ├── pda.py         # PDA 계산 유틸리티
│       ├── transaction.py # 트랜잭션 빌더
│       └── keypair.py     # 키페어 관리
```

## 3. 핵심 연동 포인트

### A. Profile Manager 연동
- **프로필 생성**: 온체인 프로필 생성 후 DB에 메타데이터 저장
- **컨택 요청**: 에스크로 생성 및 상태 추적

### B. Job Application 연동
- **채용공고 생성**: 온체인 잡 생성 + 바운티 에스크로
- **지원서 제출**: 온체인 application 생성
- **채용 결정**: 온체인 hire 트랜잭션 + 리워드 분배

### C. Hiring Rewards 연동
- **리워드 풀 생성**: 채용자가 리워드 풀 생성 및 USDC 예치
- **추천 링크**: 추천자가 추천 링크 생성
- **리워드 분배**: 채용 시 자동 분배 (50/50 split)

## 4. 환경별 설정

```yaml
# config/environments.yaml
development:
  solana:
    network: "devnet"
    endpoint: "https://api.devnet.solana.com"

staging:
  solana:
    network: "testnet"
    endpoint: "https://api.testnet.solana.com"

production:
  solana:
    network: "mainnet-beta"
    endpoint: "https://api.mainnet-beta.solana.com"
```

## 5. Jenkins CI/CD 확장

```groovy
// Jenkinsfile에 추가할 단계들
stage('Deploy Solana Programs') {
  when { branch 'main' }
  steps {
    sh '''
      cd solana-programs
      anchor build
      anchor deploy --provider.cluster ${SOLANA_CLUSTER}
    '''
  }
}

stage('Update Program IDs') {
  steps {
    sh '''
      # 배포된 프로그램 ID를 백엔드 환경변수로 업데이트
      python scripts/update_program_ids.py
    '''
  }
}
```

## 6. 데이터베이스 확장

```sql
-- 기존 테이블 확장
ALTER TABLE bounties ADD COLUMN program_id VARCHAR(44);
ALTER TABLE bounties ADD COLUMN job_pda VARCHAR(44);
ALTER TABLE applications ADD COLUMN application_pda VARCHAR(44);
ALTER TABLE accounts ADD COLUMN profile_pda VARCHAR(44);

-- 새 테이블 추가
CREATE TABLE solana_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signature VARCHAR(88) UNIQUE NOT NULL,
    program_id VARCHAR(44) NOT NULL,
    instruction_type VARCHAR(64) NOT NULL,
    entity_type VARCHAR(32) NOT NULL,
    entity_id UUID NOT NULL,
    status VARCHAR(16) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 7. API 엔드포인트 확장

```python
# 새로운 엔드포인트들
POST /api/v1/profiles                    # 온체인 프로필 생성
POST /api/v1/profiles/{id}/contact       # 컨택 요청
POST /api/v1/bounties/{id}/jobs          # 온체인 잡 생성
POST /api/v1/jobs/{id}/applications      # 온체인 지원
POST /api/v1/applications/{id}/hire      # 채용 결정
POST /api/v1/rewards/pools               # 리워드 풀 생성
POST /api/v1/rewards/referrals           # 추천 링크 생성
```

## 8. 웹훅 및 이벤트 처리

```python
# 온체인 이벤트 모니터링
@app.on_event("startup")
async def start_solana_monitor():
    await solana_event_monitor.start()

# 트랜잭션 상태 업데이트
@webhook.route("/solana/transaction-status")
async def handle_transaction_status(request):
    # 트랜잭션 확인 상태 업데이트
    pass
```

## 9. 보안 고려사항

- **키페어 관리**: AWS Secrets Manager 또는 환경변수로 관리
- **트랜잭션 검증**: 서명 검증 및 중복 방지
- **속도 제한**: API 호출 빈도 제한
- **에러 핸들링**: 네트워크 오류 및 재시도 로직