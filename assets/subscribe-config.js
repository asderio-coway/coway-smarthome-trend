// [방식 1] Apps Script POST — 코웨이 조직 도메인 배포라 SSO에 막힘. 비활성화.
// window.CW_SUBSCRIBE_URL = "https://script.google.com/a/macros/coway.com/s/AKfycbx8sULf-DmLdzfle4E7Eq2-_YIpBWpZiAp7Xu8YavbIMgkW-K5PWF2Sq4ewjJ1WEa7wUA/exec";
// 비워두면 index.html이 자동으로 방식 2(Google Form POST)를 사용 — SSO 불필요
window.CW_SUBSCRIBE_URL = "";
// [방식 2] Google Form 백그라운드 POST (코웨이 계정 로그인 시 동작)
window.CW_FORM_RESPONSE_URL = "https://docs.google.com/forms/d/e/1FAIpQLScJ3RvnxIbYu6P75RVINGgKWTb4Qg6BFXeSbU2lNf7eAcaiLA/formResponse";
// [방식 3] viewform URL (폴백용, 직접 사용 안 함)
window.CW_SUBSCRIBE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScJ3RvnxIbYu6P75RVINGgKWTb4Qg6BFXeSbU2lNf7eAcaiLA/viewform";
// 구독 해지 접수 메일
window.CW_UNSUBSCRIBE_MAILTO = "mailto:asderio@coway.com?subject=%5B%EC%8A%A4%EB%A7%88%ED%8A%B8%ED%99%88%20%ED%8A%B8%EB%A0%8C%EB%93%9C%5D%20%EA%B5%AC%EB%8F%85%20%ED%95%B4%EC%A7%80%20%EC%9A%94%EC%B2%AD&body=%ED%95%B4%EC%A7%80%ED%95%A0%20%EC%9D%B4%EB%A9%94%EC%9D%BC%20%EC%A3%BC%EC%86%8C%3A%20";
