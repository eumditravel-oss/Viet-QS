const CAT_META = {
  foundation: { name: "기초", file: "data/foundation.json" },
  column: { name: "기둥", file: "data/column.json" },
  beam: { name: "보", file: "data/beam.json" },
  slab: { name: "슬라브", file: "data/slab.json" },
  wall: { name: "벽", file: "data/wall.json" },
  steel: { name: "철골", file: "data/steel.json" },
};

const qs = new URLSearchParams(location.search);
const cat = qs.get("cat") || "foundation";
const meta = CAT_META[cat];

const $catName = document.getElementById("catName");
const $progress = document.getElementById("progress");
const $qTitle = document.getElementById("qTitle");
const $qText = document.getElementById("qText");
const $imgWrap = document.getElementById("imgWrap");
const $choices = document.getElementById("choices");
const $result = document.getElementById("result");

const $btnPrev = document.getElementById("btnPrev");
const $btnNext = document.getElementById("btnNext");
const $btnCheck = document.getElementById("btnCheck");

let problems = [];
let idx = 0;
let selected = null; // 선택한 보기 index(0-based)

if (!meta) {
  alert("카테고리가 올바르지 않습니다. 첫 화면으로 이동합니다.");
  location.href = "index.html";
}

$catName.textContent = meta.name;

fetch(meta.file, { cache: "no-store" })
  .then((r) => {
    if (!r.ok) throw new Error("데이터 로드 실패");
    return r.json();
  })
  .then((data) => {
    problems = Array.isArray(data) ? data : [];
    if (!problems.length) throw new Error("문제 데이터가 비어있음");
    render();
  })
  .catch((err) => {
    console.error(err);
    alert("문제 데이터를 불러오지 못했습니다. data 폴더/JSON 형식을 확인해주세요.");
    location.href = "index.html";
  });

function render() {
  const p = problems[idx];
  selected = null;
  $result.classList.add("hidden");
  $result.innerHTML = "";

  $progress.textContent = `${idx + 1} / ${problems.length}`;
  $qTitle.textContent = `문제 ${idx + 1}`;
  $qText.textContent = p.question || "";

  // 이미지 렌더링 (p.images: [] 또는 없음)
  $imgWrap.innerHTML = "";
  const imgs = Array.isArray(p.images) ? p.images : [];
  if (imgs.length) {
    imgs.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "문제 이미지";
      img.loading = "lazy";
      img.className = "q-img";
      $imgWrap.appendChild(img);
    });
  }

  // 보기 렌더링
  $choices.innerHTML = "";
  (p.choices || []).forEach((text, i) => {
    const label = document.createElement("label");
    label.className = "choice";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "choice";
    input.value = String(i);

    input.addEventListener("change", () => {
      selected = i;
      // 선택 강조
      document.querySelectorAll(".choice").forEach((el) => el.classList.remove("active"));
      label.classList.add("active");
    });

    const span = document.createElement("span");
    span.textContent = `${i + 1}) ${text}`;

    label.appendChild(input);
    label.appendChild(span);
    $choices.appendChild(label);
  });

  // 버튼 활성/비활성
  $btnPrev.disabled = idx === 0;
  $btnNext.disabled = idx === problems.length - 1;
}

$btnPrev.addEventListener("click", () => {
  if (idx > 0) {
    idx--;
    render();
  }
});

$btnNext.addEventListener("click", () => {
  if (idx < problems.length - 1) {
    idx++;
    render();
  }
});

$btnCheck.addEventListener("click", () => {
  const p = problems[idx];
  if (selected === null) {
    alert("보기를 선택해주세요.");
    return;
  }

  const correct = Number(p.answer); // 1~n 형태로 저장할 거라서
  const picked = selected + 1;

  const isOk = picked === correct;

  $result.classList.remove("hidden");
  $result.innerHTML = `
    <div class="result-title">${isOk ? "✅ 정답입니다!" : "❌ 오답입니다."}</div>
    <div class="result-line">선택: ${picked}번 / 정답: ${correct}번</div>
    ${p.explain ? `<div class="result-explain">${escapeHtml(p.explain)}</div>` : ""}
  `;

  // 정답/오답 표시(시각적)
  document.querySelectorAll(".choice").forEach((el, i) => {
    el.classList.remove("correct", "wrong");
    const num = i + 1;
    if (num === correct) el.classList.add("correct");
    if (num === picked && !isOk) el.classList.add("wrong");
  });
});

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
