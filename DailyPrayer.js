window.onload = function () {
  const prayerText = document.getElementById('prayerText');

  if (!prayerText) {
    console.error("Element with id 'prayerText' not found in the DOM.");
    return;
  }

  const API_TOKEN = 'pataDf9zPshzofFEP.79ddd938edef97e2b67fc6c91588edc2272317d3da7b3a6f94a51a6b41142719';
  const BASE_ID = 'appxqJ7b1pZI3tLEw';
  const TABLE_NAME = 'CommonPrayer';
  const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

  async function fetchPrayerOfTheDay() {
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

    try {
      const response = await fetch(`${API_URL}?filterByFormula={ISODate}='${today}'`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log("Today's date:", today);
      console.log("API response:", data);

      if (!data.records || !Array.isArray(data.records)) {
        prayerText.textContent = "Error: Unexpected API response.";
        return;
      }

   if (data.records.length > 0) {
  const raw = data.records[0].fields.Prayer;

  const formatted = raw
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
    .replace(/_(.*?)_/g, '<em>$1</em>')               // _italic_
    .replace(/ *[>›] */g, '<br>');                    // > or › becomes line break

  prayerText.innerHTML = formatted;
} else {
  prayerText.textContent = "No prayer found for today.";
}
    } catch (err) {
      console.error("Fetch error:", err);
      prayerText.textContent = "Error loading prayer.";
    }
  }

  function scheduleNextUpdate() {
    const now = new Date();
    const millisTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

    setTimeout(() => {
      fetchPrayerOfTheDay();
      scheduleNextUpdate();
    }, millisTillMidnight);
  }

  fetchPrayerOfTheDay();
  scheduleNextUpdate();
};