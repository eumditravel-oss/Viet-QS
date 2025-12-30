document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cat]");
  if (!btn) return;

  const cat = btn.getAttribute("data-cat");
  location.href = `guide.html?cat=${encodeURIComponent(cat)}`;
});
