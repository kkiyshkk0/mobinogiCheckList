if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker 등록됨:', reg))
      .catch(err => console.error('Service Worker 등록 실패:', err));
  });
}