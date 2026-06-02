document.addEventListener("DOMContentLoaded", () => {
  const mapObject = document.getElementById('map');
  mapObject.addEventListener('load', async () => {
    const svg = mapObject.contentDocument;
    const states = svg.querySelectorAll(".russia-region");
    const overlay = document.getElementById("overlay");
    const nameBox = document.getElementById("region-name");
    const textBox = document.getElementById("text");
    const closeBtn = document.getElementById("close-btn");
    const mapContainer = document.getElementById("map-container");
    const imgBox = document.getElementById("region-images");
    


    states.forEach(r => {
      r.style.fill = "#ccc";
      r.style.stroke = "#333";
      r.style.strokeWidth = "0.5px";
    });
    let stateIndex = {};
    const res = await fetch("data/regions.json");
    stateIndex = await res.json();

    let selected = null;
    states.forEach((state, i) => {
      state.addEventListener("click", (e) => {
        e.stopPropagation();
        
        clearSelection();

        selected = state;
        const id = state.id.trim();
        state.style.fill = stateIndex[id].color;

        showRegionInfo(state.id.trim());
        showRegionInPanel(state);
      });
    });
    closeBtn.addEventListener("click", () => {
      clearSelection();
    });



    function clearSelection() {
      hideInfo();
      mapContainer.style.transform = "translate(0, 0) scale(1)";
  }
    async function showRegionInfo(id) {
      const meta = stateIndex[id];
      
      overlay.classList.remove("hidden");

      nameBox.textContent = meta.name;
      const textRes = await fetch(`${meta.folder}/${meta.text}`);
      const textData = await textRes.json();

      textBox.innerHTML = textData.text.replace(/\n/g, "<br>");

      imgBox.innerHTML = "";
      meta.images.forEach(img => {
        const el = document.createElement("img");
        el.src = `${meta.folder}/${img}`;
        imgBox.appendChild(el);
      });
    }
    function hideInfo() {
      overlay.classList.add("hidden");
    }
    function getRegionCenter(state) {
      const bbox = state.getBBox();

      return {
        x: bbox.x + bbox.width / 2,
        y: bbox.y + bbox.height / 2
      };
    }
    function getLeftPanelCenter() {
      const panel = document.querySelector(".left-panel");
      const rect = panel.getBoundingClientRect();

      return {
        x: rect.width / 2,
        y: rect.height / 2
      };
    }
     
   function showRegionInPanel(state) {
      const panel = document.getElementById("region-preview");
      panel.innerHTML = "";

      const clone = state.cloneNode(true);

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

      const bbox = state.getBBox();
      const padding = 20;

      svg.setAttribute(
        "viewBox",
        `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`
      );

      svg.setAttribute("width", "60vw");
      svg.setAttribute("height", "50vh");

      svg.appendChild(clone);
      panel.appendChild(svg);
    }
  });
});
