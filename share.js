/**
 * CW Calendar — SNS 공유 기능
 *
 * 제공 기능:
 *  - FAB (우하단 고정 공유 버튼): X·Facebook·Web Share·링크 복사
 *  - 히어로 섹션 공유 버튼
 *  - 달력에서 주 선택 시 "이 주 공유" 버튼 자동 표시
 *  - 선택된 주차 기반 동적 공유 텍스트 (KO/EN)
 */
(function () {
  'use strict';

  var BASE_URL = 'https://bs-pb.pages.dev/';
  var _currentWeekId = null;  // "2026-8" 형식, main.js week-selected 이벤트로 갱신

  /* ── 언어 ── */
  function lang() {
    return document.documentElement.dataset.lang || 'ko';
  }

  /* ── 공유 데이터 생성 ── */
  function getShareData() {
    var l = lang();
    var weekEl = document.getElementById('selected-week-display');
    var weekText = weekEl ? weekEl.textContent.trim() : '';

    // 기본 텍스트 여부 판별
    var defaults = ['선택된 주 없음', 'No week selected', '주를 선택하세요', 'Please select a week'];
    var hasWeek = _currentWeekId && weekText && !defaults.some(function (d) { return weekText.indexOf(d) !== -1; });

    var title, text, hashtags;

    if (hasWeek) {
      // "선택: 2026년 CW8 · ..." → "2026년 CW8 ·..." 앞부분 제거
      var cleanText = weekText.replace(/^선택:\s*|^Selected:\s*/i, '');
      if (l === 'ko') {
        title = 'CW Calendar — ' + cleanText;
        text  = '📅 ' + cleanText + '\n이번 주 업무 일정, 주차(CW) 달력으로 한눈에!\n한국·미국 공휴일 포함 · 무료';
        hashtags = '주차달력,CW달력,업무일정,공휴일,ISO8601';
      } else {
        title = 'CW Calendar — ' + cleanText;
        text  = '📅 ' + cleanText + '\nCheck your work schedule at a glance with a CW calendar!\nKorean & US holidays included · Free';
        hashtags = 'CWCalendar,CalendarWeek,ISO8601,WorkSchedule,Productivity';
      }
    } else {
      if (l === 'ko') {
        title = 'CW Calendar — ISO 8601 주차 달력';
        text  = '📅 주차(CW)로 연간 업무 일정을 스마트하게 관리하세요!\n한국·미국 공휴일 표시 · 한/영 지원 · 무료';
        hashtags = '주차달력,CW달력,공휴일,업무달력,ISO8601';
      } else {
        title = 'CW Calendar — ISO 8601 Week Planner';
        text  = '📅 Manage annual work schedules smartly by Calendar Week!\nKorean & US holidays · Bilingual · Free';
        hashtags = 'CWCalendar,CalendarWeek,ISO8601,WorkSchedule,PublicHolidays';
      }
    }

    return { title: title, text: text, url: BASE_URL, hashtags: hashtags };
  }

  /* ── 플랫폼별 공유 함수 ── */
  function shareNative() {
    var d = getShareData();
    if (navigator.share) {
      navigator.share({ title: d.title, text: d.text, url: d.url })
        .catch(function (e) { if (e.name !== 'AbortError') copyLink(); });
    }
  }

  function shareX() {
    var d = getShareData();
    var tweet = d.text + '\n\n#' + d.hashtags.split(',').join(' #');
    var params = new URLSearchParams({ text: tweet, url: d.url });
    window.open('https://twitter.com/intent/tweet?' + params.toString(), '_blank', 'noopener,width=600,height=450');
  }

  function shareFacebook() {
    var d = getShareData();
    var params = new URLSearchParams({ u: d.url });
    window.open('https://www.facebook.com/sharer/sharer.php?' + params.toString(), '_blank', 'noopener,width=600,height=450');
  }

  var _copyTimer;
  function copyLink() {
    var url = getShareData().url;
    var copyBtn = document.querySelector('.share-btn-copy');

    function flash() {
      if (!copyBtn) return;
      var span = copyBtn.querySelector('span');
      copyBtn.classList.add('copied');
      if (span) span.setAttribute('data-orig', span.textContent);
      if (span) span.textContent = lang() === 'ko' ? '✓ 복사됨' : '✓ Copied';
      clearTimeout(_copyTimer);
      _copyTimer = setTimeout(function () {
        copyBtn.classList.remove('copied');
        if (span) span.textContent = span.getAttribute('data-orig') || (lang() === 'ko' ? '링크 복사' : 'Copy Link');
      }, 2200);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(flash);
    } else {
      var el = document.createElement('textarea');
      el.value = url;
      el.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
      document.body.appendChild(el);
      el.focus(); el.select();
      try { document.execCommand('copy'); flash(); } catch (e) {}
      document.body.removeChild(el);
    }
  }

  /* ── SVG 아이콘 ── */
  var ICONS = {
    share: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    shareSmall: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    upload: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>',
    x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    facebook: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    copy: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
  };

  /* ── FAB 빌드 ── */
  function buildFAB() {
    var l = lang();
    var hasNative = !!navigator.share;

    var fab = document.createElement('div');
    fab.className = 'share-fab';
    fab.setAttribute('role', 'region');
    fab.setAttribute('aria-label', '공유');

    var nativeRow = hasNative
      ? '<button class="share-item-btn share-btn-native" type="button">' + ICONS.upload + '<span>' + (l === 'ko' ? '공유하기' : 'Share') + '</span></button>'
      : '';

    fab.innerHTML =
      '<button class="share-fab-btn" type="button" aria-label="공유" aria-expanded="false" aria-haspopup="true">' + ICONS.share + '</button>' +
      '<div class="share-panel" role="menu" aria-label="공유 방법 선택">' +
        nativeRow +
        '<button class="share-item-btn share-btn-x" type="button">' + ICONS.x + '<span>X (Twitter)</span></button>' +
        '<button class="share-item-btn share-btn-facebook" type="button">' + ICONS.facebook + '<span>Facebook</span></button>' +
        '<button class="share-item-btn share-btn-copy" type="button">' + ICONS.copy + '<span>' + (l === 'ko' ? '링크 복사' : 'Copy Link') + '</span></button>' +
      '</div>';

    document.body.appendChild(fab);

    var fabBtn   = fab.querySelector('.share-fab-btn');
    var nativeBtn = fab.querySelector('.share-btn-native');
    if (nativeBtn) nativeBtn.addEventListener('click', shareNative);
    fab.querySelector('.share-btn-x').addEventListener('click', shareX);
    fab.querySelector('.share-btn-facebook').addEventListener('click', shareFacebook);
    fab.querySelector('.share-btn-copy').addEventListener('click', copyLink);

    // 토글
    fabBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = fab.classList.toggle('open');
      fabBtn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function (e) {
      if (!fab.contains(e.target)) {
        fab.classList.remove('open');
        fabBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        fab.classList.remove('open');
        fabBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // 언어 변경 대응
    new MutationObserver(function () {
      var ll = lang();
      var ns = fab.querySelector('.share-btn-native span');
      var cs = fab.querySelector('.share-btn-copy span');
      if (ns) ns.textContent = ll === 'ko' ? '공유하기' : 'Share';
      if (cs && !cs.getAttribute('data-orig')) cs.textContent = ll === 'ko' ? '링크 복사' : 'Copy Link';
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
  }

  /* ── 히어로 공유 버튼 ── */
  function buildHeroBtn() {
    var hero = document.querySelector('.hero-section .container');
    if (!hero) return;

    var btn = document.createElement('button');
    btn.className = 'hero-share-btn';
    btn.type = 'button';
    btn.innerHTML = ICONS.shareSmall + '<span>' + (lang() === 'ko' ? '공유하기' : 'Share') + '</span>';

    btn.addEventListener('click', function () {
      if (navigator.share) {
        shareNative();
      } else {
        var fab = document.querySelector('.share-fab');
        if (fab) {
          fab.classList.add('open');
          fab.querySelector('.share-fab-btn').setAttribute('aria-expanded', 'true');
        }
      }
    });

    hero.appendChild(btn);

    new MutationObserver(function () {
      var span = btn.querySelector('span');
      if (span) span.textContent = lang() === 'ko' ? '공유하기' : 'Share';
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
  }

  /* ── 달력 주 선택 시 "이 주 공유" 버튼 ── */
  function buildWeekShareBtn() {
    var headerContent = document.querySelector('.app-header .header-content');
    if (!headerContent) return;

    var btn = document.createElement('button');
    btn.className = 'week-share-btn';
    btn.type = 'button';
    btn.style.display = 'none';
    btn.innerHTML = ICONS.shareSmall + '<span>' + (lang() === 'ko' ? '이 주 공유' : 'Share Week') + '</span>';

    btn.addEventListener('click', function () {
      if (navigator.share) {
        shareNative();
      } else {
        var fab = document.querySelector('.share-fab');
        if (fab) {
          fab.classList.add('open');
          fab.querySelector('.share-fab-btn').setAttribute('aria-expanded', 'true');
        }
      }
    });

    headerContent.appendChild(btn);

    // main.js의 week-selected 이벤트 청취 (bubbles + composed: true)
    document.addEventListener('week-selected', function (e) {
      _currentWeekId = e.detail && e.detail.weekId ? e.detail.weekId : null;
      btn.style.display = _currentWeekId ? 'inline-flex' : 'none';
    });

    new MutationObserver(function () {
      var span = btn.querySelector('span');
      if (span) span.textContent = lang() === 'ko' ? '이 주 공유' : 'Share Week';
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
  }

  /* ── 초기화 ── */
  document.addEventListener('DOMContentLoaded', function () {
    buildFAB();
    buildHeroBtn();
    buildWeekShareBtn();
  });
})();
