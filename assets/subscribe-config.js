// 구독 설정 — coway.com 계정 OAuth 인증 방식 (2026-07 개편)
//
// 구독은 "coway.com 계정으로 구독하기" 버튼 → 아래 Google Form(viewform)을 새 탭으로 연다.
// Google이 로그인·도메인·이메일을 인증하므로, 남 이메일/외부 계정으로는 구독 불가.
//
// ★ Form 필수 설정(1회, RUNBOOK 참조):
//   1) 설정 → 응답 → "응답을 coway.com 및 신뢰할 수 있는 조직으로 제한"  (외부인 차단)
//   2) 설정 → 응답 → "이메일 주소 수집" = "확인됨(응답자 입력 없이 자동)"   (본인 이메일 자동·위조 불가)
//   3) 자유입력 이메일 질문 제거(불필요) — 검증된 응답자 이메일만 사용
//   → onFormSubmit(subscribe.gs)이 검증된 coway.com 이메일만 시트에 적재 + 환영메일.
window.CW_SUBSCRIBE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScJ3RvnxIbYu6P75RVINGgKWTb4Qg6BFXeSbU2lNf7eAcaiLA/viewform";

// (레거시) 백그라운드 POST 방식 — 조직 SSO 벽 + 검증불가로 폐기. 사용 안 함.
window.CW_SUBSCRIBE_URL = "";
window.CW_FORM_RESPONSE_URL = "";

// 구독 해지 접수 메일(폴백)
window.CW_UNSUBSCRIBE_MAILTO = "mailto:asderio@coway.com?subject=%5B%EC%8A%A4%EB%A7%88%ED%8A%B8%ED%99%88%20%ED%8A%B8%EB%A0%8C%EB%93%9C%5D%20%EA%B5%AC%EB%8F%85%20%ED%95%B4%EC%A7%80%20%EC%9A%94%EC%B2%AD&body=%ED%95%B4%EC%A7%80%ED%95%A0%20%EC%9D%B4%EB%A9%94%EC%9D%BC%20%EC%A3%BC%EC%86%8C%3A%20";
