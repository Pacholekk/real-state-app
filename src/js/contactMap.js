function initMap() {
  const coordiantes = [51.1204625, 17.031363];
  const map = L.map("map").setView(coordiantes, 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 20,
  }).addTo(map);

  const marker = L.marker(coordiantes).addTo(map);

  marker
    .bindPopup(
      `
    <strong>Real Estate Office</strong><br>
    ul. Pomorska 49<br>
    50-217 Wrocław<br>
    <a href="tel:+48123456789">+48 123 456 789</a>
  `
    )
    .openPopup();

  window.addEventListener("resize", function () {
    map.invalidateSize();
  });
  return map;
}
function setupContactForm() {
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      alert("Thank you for your message! We will contact you soon.");

      form.reset();
    });
  }
}
function initContactPage() {
  const map = initMap();

  setupContactForm();
}

document.addEventListener("DOMContentLoaded", initContactPage);
