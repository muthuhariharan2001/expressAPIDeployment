document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const datasetIndex = urlParams.get("dataset");
  
    if (datasetIndex !== null) {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) throw new Error("Failed to fetch data");
  
        const data = await response.json();
  
        // Check if index is within bounds
        const index = parseInt(datasetIndex, 10);
        if (index >= data.length) throw new Error("Data set index is out of range");
  
        const selectedData = data[index];
  
        // Fill the form fields with the fetched data
        document.getElementById("name").value = selectedData.title || '';
        document.getElementById("email").value = selectedData.category || '';
        document.getElementById("phone").value = selectedData.price || '';
        document.getElementById("address").value = selectedData.description || '';
        document.getElementById("image").src = selectedData.image || '';
  
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      }
    } else {
      alert("No dataset specified.");
    }
  });
  