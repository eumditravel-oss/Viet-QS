document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cat]");
  if (!btn) return;

  const cat = btn.getAttribute("data-cat");
  // quiz.html?cat=foundation 형태로 이동
  location.href = `quiz.html?cat=${encodeURIComponent(cat)}`;
});
