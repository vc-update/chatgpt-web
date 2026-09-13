<template>
  <div class="home-disclaimer-banner">
    <div class="hdb-inner">
      <span class="hdb-icon">⚠️</span>
      <span class="hdb-text">
        <strong>免责声明：</strong>本站为独立的 ChatGPT 中文教程与信息分享网站，与 OpenAI、Anthropic、Google、xAI 等官方机构无任何隶属或代理关系。
        <a href="/disclaimer">查看完整声明 →</a>
      </span>
    </div>
  </div>
</template>

<style scoped>
.home-disclaimer-banner {
  width: 100%;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}
.hdb-inner {
  max-width: 1152px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
.hdb-icon {
  flex-shrink: 0;
  font-size: 16px;
}
.hdb-text strong {
  color: var(--vp-c-text-1);
}
.hdb-text a {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  white-space: nowrap;
}
@media (max-width: 640px) {
  .hdb-inner {
    align-items: flex-start;
    font-size: 13px;
  }
}
</style>
