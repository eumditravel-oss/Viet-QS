const META = {
  foundation: { name: "기초", file: "data/foundation.json" },
  column: { name: "기둥", file: "data/column.json" },
  beam: { name: "보", file: "data/beam.json" },
  slab: { name: "슬라브", file: "data/slab.json" },
  wall: { name: "벽", file: "data/wall.json" },
  steel: { name: "철골", file: "data/steel.json" },
};

const qs = new URLSearchParams(location.search);
const cat = qs.get("cat") || "foundation";
const meta = META[cat];

if (!meta) {
  alert("파트 정보가 올바르지 않습니다.");
  location.href = "index.html";
}

const $partName = document.getElementById("partName");
const $progress = document.getElementById("progress");
const $title = document.getElementById("title");
const $text = document.getElementById("text");

const $imageArea = document.getElementById("imageArea");
const $qImage = document.getElementById("qImage");

const $btnHome = document.getElementById("btnHome");
const $btnNext = document.getElementById("btnNext");

$partName.textContent = meta.name;

let items = [];
let idx = 0;

fetch(meta.file, { cache: "no-store" })
  .then(r => {
    if (!r.ok) throw new Error("데이터 로드 실패");
    return r.json();
  })
  .then(data => {
    items = Array.isArray(data) ? data : [];
    if (!items.length) throw new Error("데이터 비어있음");
    render();
  })
  .catch(err => {
    console.error(err);
    alert("파트 데이터를 불러오지 못했습니다. data/*.json 확인해주세요.");
    location.href = "index.html";
  });

function render() {
  const it = items[idx];

  $progress.textContent = `${idx + 1} / ${items.length}`;
  $title.textContent = it.title ? it.title : `안내 ${idx + 1}`;
  $text.textContent = it.text || "";

  // ✅ 이미지 처리: 없으면 영역 숨김
  if (it.image && String(it.image).trim() !== "") {
    $qImage.src = it.image;
    $imageArea.classList.remove("hidden");
  } else {
    $qImage.removeAttribute("src");
    $imageArea.classList.add("hidden");
  }

  // ✅ 다음 버튼: 마지막이면 비활성(원하면 “완료”로 바꿀 수도 있음)
  $btnNext.disabled = idx >= items.length - 1;
}

$btnHome.addEventListener("click", () => {
  idx = 0;
  render();
});

$btnNext.addEventListener("click", () => {
  if (idx < items.length - 1) {
    idx += 1;
    render();
  }
});
