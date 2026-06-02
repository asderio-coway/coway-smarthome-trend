/* onboarding.js — 첫 방문 코치마크 온보딩 (순수 바닐라, 의존성 0)
 * [data-onboard] 요소를 정해진 순서로 가리키는 말풍선을 띄운다.
 * 페이지에 존재하는 대상만 단계로 포함하며, 대상이 하나도 없으면 조용히 패스한다.
 * localStorage 키 'cw_onboarded_v1'로 최초 1회만 자동 표시. 우하단 물음표 버튼으로 다시 보기.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "cw_onboarded_v1";

  // 단계 정의(순서 고정). 페이지에 해당 data-onboard 요소가 있을 때만 단계로 채택.
  var STEPS = [
    { key: "subscribe", text: "격주 뉴스레터를 메일로 받아보세요" },
    { key: "latest", text: "최신호를 여기서 바로 읽어요" },
    { key: "filter", text: "카테고리로 골라보기" },
    { key: "guide", text: "처음이세요? 이용 가이드" },
  ];

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  // 현재 페이지에 실제로 존재하는 대상만 추려 단계 목록 구성.
  function collectSteps() {
    var out = [];
    for (var i = 0; i < STEPS.length; i++) {
      var el = document.querySelector('[data-onboard="' + STEPS[i].key + '"]');
      if (el) out.push({ key: STEPS[i].key, text: STEPS[i].text, el: el });
    }
    return out;
  }

  function isStored() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function setStored() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {
      /* localStorage 미지원/차단 시 무시 */
    }
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function Onboarding(steps) {
    this.steps = steps;
    this.idx = 0;
    this.overlay = null;
    this.spot = null;
    this.pop = null;
    this._onResize = this.reposition.bind(this);
    this._onKey = this.onKey.bind(this);
  }

  Onboarding.prototype.start = function () {
    if (!this.steps.length || this.overlay) return;
    var ov = document.createElement("div");
    ov.className = "cw-onb cw-onb-overlay";

    var spot = document.createElement("div");
    spot.className = "cw-onb-spot";

    var pop = document.createElement("div");
    pop.className = "cw-onb-pop";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-live", "polite");

    ov.appendChild(spot);
    ov.appendChild(pop);
    document.body.appendChild(ov);

    this.overlay = ov;
    this.spot = spot;
    this.pop = pop;

    // 딤 영역 클릭 시 건너뛰기(말풍선 클릭은 제외)
    var self = this;
    ov.addEventListener("click", function (e) {
      if (e.target === ov) self.finish();
    });
    window.addEventListener("resize", this._onResize);
    window.addEventListener("scroll", this._onResize, true);
    document.addEventListener("keydown", this._onKey);

    this.idx = 0;
    this.render();
    requestAnimationFrame(function () {
      ov.classList.add("cw-show");
    });
  };

  Onboarding.prototype.onKey = function (e) {
    if (!this.overlay) return;
    if (e.key === "Escape") this.finish();
    else if (e.key === "ArrowRight" || e.key === "Enter") this.next();
    else if (e.key === "ArrowLeft") this.prev();
  };

  Onboarding.prototype.render = function () {
    var step = this.steps[this.idx];
    if (!step) return;
    var total = this.steps.length;
    var n = this.idx + 1;

    // 대상으로 스크롤(필요 시) 후 위치 계산.
    if (step.el.scrollIntoView) {
      step.el.scrollIntoView({ block: "center", behavior: "smooth" });
    }

    var dots = "";
    for (var i = 0; i < total; i++) {
      dots += '<span class="' + (i === this.idx ? "on" : "") + '"></span>';
    }

    var prevBtn =
      this.idx > 0
        ? '<button class="cw-onb-btn" data-act="prev">이전</button>'
        : "";
    var nextLabel = this.idx === total - 1 ? "완료" : "다음";

    this.pop.innerHTML =
      '<div class="cw-onb-step">' + n + " / " + total + "</div>" +
      '<p class="cw-onb-text">' + step.text + "</p>" +
      '<div class="cw-onb-dots">' + dots + "</div>" +
      '<div class="cw-onb-actions">' +
      '<button class="cw-onb-skip" data-act="skip">건너뛰기</button>' +
      prevBtn +
      '<button class="cw-onb-btn cw-primary" data-act="next">' + nextLabel + "</button>" +
      "</div>";

    var self = this;
    var btns = this.pop.querySelectorAll("[data-act]");
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener("click", function (e) {
        var act = e.currentTarget.getAttribute("data-act");
        if (act === "skip") self.finish();
        else if (act === "prev") self.prev();
        else self.next();
      });
    }

    // 위치는 스크롤 애니메이션을 감안해 다음 프레임에 반영.
    requestAnimationFrame(function () {
      self.reposition();
    });
  };

  Onboarding.prototype.reposition = function () {
    if (!this.overlay) return;
    var step = this.steps[this.idx];
    if (!step || !step.el) return;
    var r = step.el.getBoundingClientRect();
    var pad = 6;

    // 강조 링
    this.spot.style.top = r.top - pad + "px";
    this.spot.style.left = r.left - pad + "px";
    this.spot.style.width = r.width + pad * 2 + "px";
    this.spot.style.height = r.height + pad * 2 + "px";

    // 말풍선 위치: 대상 아래 우선, 공간 부족하면 위.
    var pop = this.pop;
    var pw = pop.offsetWidth || 290;
    var ph = pop.offsetHeight || 160;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var gap = 14;

    var below = r.bottom + gap;
    var placeBelow = below + ph <= vh - 12;
    var top = placeBelow ? below : r.top - gap - ph;
    pop.setAttribute("data-arrow", placeBelow ? "top" : "bottom");

    var left = clamp(r.left, 12, vw - pw - 12);
    pop.style.top = clamp(top, 12, vh - ph - 12) + "px";
    pop.style.left = left + "px";

    // 화살표 x: 대상 중심을 가리키되 말풍선 안에 머무르도록.
    var arrowX = clamp(r.left + r.width / 2 - left - 7, 14, pw - 28);
    pop.style.setProperty("--arrow-x", arrowX + "px");
  };

  Onboarding.prototype.next = function () {
    if (this.idx >= this.steps.length - 1) {
      this.finish();
      return;
    }
    this.idx++;
    this.render();
  };

  Onboarding.prototype.prev = function () {
    if (this.idx <= 0) return;
    this.idx--;
    this.render();
  };

  Onboarding.prototype.finish = function () {
    setStored();
    if (!this.overlay) return;
    window.removeEventListener("resize", this._onResize);
    window.removeEventListener("scroll", this._onResize, true);
    document.removeEventListener("keydown", this._onKey);
    var ov = this.overlay;
    this.overlay = this.spot = this.pop = null;
    ov.classList.remove("cw-show");
    setTimeout(function () {
      if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
    }, 240);
  };

  function injectHelp(steps) {
    if (document.querySelector(".cw-onb-help")) return;
    var btn = document.createElement("button");
    btn.className = "cw-onb cw-onb-help";
    btn.type = "button";
    btn.setAttribute("aria-label", "온보딩 다시 보기");
    btn.title = "온보딩 다시 보기";
    btn.textContent = "?";
    btn.addEventListener("click", function () {
      new Onboarding(collectSteps()).start();
    });
    document.body.appendChild(btn);
  }

  function init() {
    var steps = collectSteps();
    if (!steps.length) return; // 대상 없으면 조용히 패스(도움말 버튼도 미표시)

    injectHelp(steps);

    if (!isStored()) {
      // 레이아웃 안정 후 시작
      setTimeout(function () {
        new Onboarding(collectSteps()).start();
      }, 350);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
