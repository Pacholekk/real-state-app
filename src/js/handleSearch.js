function handleSearch() {
  const searchInput = document.querySelector(".search-input");
  const searchButton = document.querySelector(".search-button");
  if (!searchInput || !searchButton) {
    console.error("Nie znaleziono elementów wyszukiwania");
    return;
  }

  const highlightClass = "highlighted-text";

  const style = document.createElement("style");
  style.textContent = `
    .${highlightClass} {
      background-color: yellow;
      color: black;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);

  function removeHighlights() {
    document.querySelectorAll(`.${highlightClass}`).forEach((highlight) => {
      const parent = highlight.parentNode;
      parent.replaceChild(
        document.createTextNode(highlight.textContent),
        highlight
      );
      parent.normalize();
    });
  }

  function highlightText(searchTerm) {
    if (!searchTerm.trim()) return 0;
    removeHighlights();
    let count = 0;
    const searchTermLower = searchTerm.toLowerCase();

    function searchInNode(node) {
      if (
        !node ||
        (node.nodeType === Node.ELEMENT_NODE &&
          [
            "SCRIPT",
            "STYLE",
            "INPUT",
            "TEXTAREA",
            "SELECT",
            "OPTION",
            "BUTTON",
          ].includes(node.nodeName))
      ) {
        return;
      }

      if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
        const text = node.nodeValue;
        const textLower = text.toLowerCase();
        if (textLower.includes(searchTermLower)) {
          const regex = new RegExp(`(${searchTerm})`, "gi");
          const parts = text.split(regex);
          const fragment = document.createDocumentFragment();
          parts.forEach((part) => {
            if (part.toLowerCase() === searchTermLower) {
              const highlight = document.createElement("span");
              highlight.className = highlightClass;
              highlight.textContent = part;
              fragment.appendChild(highlight);
              count++;
            } else {
              fragment.appendChild(document.createTextNode(part));
            }
          });
          const parent = node.parentNode;
          parent.replaceChild(fragment, node);
        }
      } else {
        Array.from(node.childNodes).forEach(searchInNode);
      }
    }

    searchInNode(document.body);
    return count;
  }

  const performSearch = () => {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) return;
    const count = highlightText(searchTerm);
    console.log(`Znaleziono ${count} wystąpień frazy "${searchTerm}"`);
  };

  searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    performSearch();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  });

  const parentForm = searchInput.closest("form");
  if (parentForm) {
    parentForm.addEventListener("submit", (e) => e.preventDefault());
  }
}

document.addEventListener("DOMContentLoaded", handleSearch);

export { handleSearch };
