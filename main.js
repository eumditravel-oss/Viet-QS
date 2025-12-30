document.querySelectorAll(".menu button").forEach(btn => {
  btn.addEventListener("click", () => {
    const part = btn.dataset.part;
    location.href = `guide.html?part=${part}`;
  });
});
