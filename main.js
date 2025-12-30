document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-cat]");
  if (!btn) return;

  const cat = btn.dataset.cat;
  location.href = `guide.html?cat=${cat}`;
});
