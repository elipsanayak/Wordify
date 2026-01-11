const searchInput = document.getElementById("searchInput");
const resultDiv = document.getElementById("result");

/* -------------------------
   Utility: Format Labels
-------------------------- */
function formatLabel(key) {
  return key
    .replace(/_/g, " ")                 // remove underscores
    .replace(/\b\w/g, c => c.toUpperCase()); // capitalize words
}

// Allow searching by pressing "Enter" key inside the input box
searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    searchWord();
  }
});

async function searchWord() {
  const word = searchInput.value.trim().toLowerCase();

  // Clear previous result
  resultDiv.innerHTML = "";

  if (!word) {
    resultDiv.innerHTML = `<p>Please enter a word to search.</p>`;
    return;
  }

  // Show loading state
  resultDiv.innerHTML = `<p style="color: var(--text-muted);">Searching...</p>`;

  try {
    // Construct the path to the JSON file based on the folder structure
    // Structure: data/{first_letter}/{word}.json
    const firstLetter = word.charAt(0);
    const url = `data/${firstLetter}/${word}.json`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Word not found");
    }

    const entry = await response.json();

    // Render Result
    resultDiv.innerHTML = `
      <h2>${entry.word}</h2>
      <p><em>${entry.phonetic || ""}</em></p>

      <div class="section">
        <h3>Meanings</h3>
        ${Object.entries(entry.meanings).map(([pos, meanings]) =>
          `<b>${formatLabel(pos)}</b>
           <ul>
             ${meanings.map(m =>
               `<li>
                  ${m.definition}
                  ${m.example ? `<br><small>Example: ${m.example}</small>` : ""}
                </li>`
             ).join("")}
           </ul>`
        ).join("")}
      </div>

      ${entry.tense_forms ? `
        <div class="section">
          <h3>Tense Forms</h3>
          <ul>
            ${Object.entries(entry.tense_forms).map(
              ([k, v]) => `
                <li>
                  <strong>${formatLabel(k)}</strong>: ${v}
                </li>`
            ).join("")}
          </ul>
        </div>
      ` : ""}

      ${entry.synonyms && entry.synonyms.length > 0 ? `
        <div class="section">
          <h3>Synonyms</h3>
          <div class="list">
            ${entry.synonyms.map(s => `<span>${s}</span>`).join("")}
          </div>
        </div>
      ` : ""}

      ${entry.antonyms && entry.antonyms.length > 0 ? `
        <div class="section">
          <h3>Antonyms</h3>
          <div class="list">
            ${entry.antonyms.map(a => `<span>${a}</span>`).join("")}
          </div>
        </div>
      ` : ""}

      ${entry.usage_examples && entry.usage_examples.length > 0 ? `
        <div class="section">
          <h3>Usage Examples</h3>
          <ul>
            ${entry.usage_examples.map(e => `<li>${e}</li>`).join("")}
          </ul>
        </div>
      ` : ""}
    `;

  } catch (error) {
    resultDiv.innerHTML = `<p>❌ Word not found</p>`;
  }
}