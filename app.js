function loadWord(word) {
  const firstLetter = word[0];

  return fetch(`data/${firstLetter}/${word}.json`)
    .then(res => {
      if (!res.ok) throw new Error("Word not found");
      return res.json();
    });
}
