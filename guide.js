const params = new URLSearchParams(location.search);
const cat = params.get("cat");

const META = {
  foundation: { name: "기초", file: "data/foundation.json" },
  column: { name: "기둥", file: "data/column.json" },
  beam: { name: "보", file: "data/beam.json" },
  slab: { name: "슬라브", file: "data/slab.json" },
  wall: { name: "벽", file: "data/wall.json" },
  steel: { name: "철골", file: "data/steel.json" }
};

const title = document.getElementById("title");
const content = document.getElementById("content");

title.textContent = META[cat].name + " 작업 안내";

fetch(META[cat].file)
  .then(r => r.json())
  .then(list => {
    list.forEach((item, i) => {
      const section = document.createElement("div");
      section.className = "guide-item";

      section.innerHTML = `
        <h3>${i + 1}. ${item.title}</h3>
        <p>${item.text}</p>
        ${(item.images || []).map(src => `<img src="${src}">`).join("")}
      `;
      content.appendChild(section);
    });
  });
