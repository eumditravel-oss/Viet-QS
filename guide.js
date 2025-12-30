const CAT = {
  foundation: { name: "기초", file: "./data/foundation.json" },
  column: { name: "기둥", file: "./data/column.json" },
  beam: { name: "보", file: "./data/beam.json" },
  slab: { name: "슬라브", file: "./data/slab.json" },
  wall: { name: "벽", file: "./data/wall.json" },
  steel: { name: "철골", file: "./data/steel.json" },
};

const qs = new URLSearchParams(location.search);
const catKey = qs.get("cat") || "foundation";
const meta = CAT[catKey];

const $catName = document.getElementById("catName");
const $progress = document.getElementById("progress");
const $imgWrap = document.getElementById("imgWrap");
const $text = document.getElementById("text");

const $prevBtn = document.getElementById("prevBtn");
const $nextBtn = document.getElementById("nextBtn");

let items = [];
let idx = 0;

if (!meta) {
  alert("파트 정보가 올바르지 않습니다.");
  location.href = "./index.html";
}

$catName.textContent = meta.name;

fetch(meta.file, { cache: "no-store" })
  .then(r => {
    if (!r.ok) throw new Error("JSON 로드 실패");
    return r.json();
  })
  .then(data => {
    items = Array.isArray(data) ? data : [];
    if (!items.length) throw new Error("데이터가 비어있음");
    render();
  })
  .catch(err => {
    console.error(err);
    alert("가이드 데이터를 불러오지 못했습니다. data/*.json 확인 필요");
    location.href = "./index.html";
  });

function render(){
  const it = items[idx];
  $progress.textContent = `${idx + 1} / ${items.length}`;

  // 텍스트
  $text.textContent = it.text || "";

  // ✅ 이미지: 있으면 상단 표시, 없으면 공간 자체 숨김
  const imgs = Array.isArray(it.images) ? it.images : [];
  if (imgs.length){
    $imgWrap.style.display = "";
    $imgWrap.innerHTML = imgs.map(src => `<img class="img" src="${src}" alt="가이드 이미지" loading="lazy">`).join("");
  } else {
    $imgWrap.style.display = "none";
    $imgWrap.innerHTML = "";
  }

  $prevBtn.disabled = idx === 0;
  $nextBtn.disabled = idx === items.length - 1;
}

$prevBtn.addEventListener("click", () => {
  if (idx > 0){
    idx--;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

$nextBtn.addEventListener("click", () => {
  if (idx < items.length - 1){
    idx++;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});
