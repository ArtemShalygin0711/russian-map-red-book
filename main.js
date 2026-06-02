document.addEventListener("DOMContentLoaded", () => {
    const svg = mapObject.contentDocument;
    console.log(getElementById("modal"));
    const states = svg.querySelectorAll(".russia-region");
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
});