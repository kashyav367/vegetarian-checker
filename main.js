function getFetch() {
  const inputVal = document.getElementById("barcode").value.trim();

  // Validation
  if (!/^\d{12}$/.test(inputVal)) {
    alert("Please enter a valid 12-digit UPC barcode.");
    return;
  }

  const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.status === 1) {
        const item = new ProductInfo(data.product);
        item.showInfo();
        item.listIngredients();
      } else {
        alert(`Product not found. Try another UPC.`);
      }
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    });
}

class ProductInfo {
  constructor(productData) {
    this.name = productData.product_name || "Unknown Product";
    this.image = productData.image_url || "";
    this.ingredients = productData.ingredients || [];
  }

  showInfo() {
    document.getElementById("product-img").src = this.image;
    document.getElementById("product-name").innerText = this.name;
  }

  listIngredients() {
    const tableRef = document.getElementById("ingredient-table");

    // Clear old rows
    while (tableRef.rows.length > 1) {
      tableRef.deleteRow(1);
    }

    if (this.ingredients.length === 0) {
      const row = tableRef.insertRow();
      row.insertCell(0).innerText = "No ingredient data";
      row.insertCell(1).innerText = "Unknown";
      return;
    }

    this.ingredients.forEach(item => {
      const row = tableRef.insertRow();
      const ingredientCell = row.insertCell(0);
      const vegCell = row.insertCell(1);

      ingredientCell.innerText = item.text || "Unknown";

      const vegStatus = item.vegetarian ?? "unknown";
      vegCell.innerText = vegStatus;

      if (vegStatus === "no") {
        vegCell.style.color = "red";
        vegCell.style.fontWeight = "bold";
      } else if (vegStatus === "yes") {
        vegCell.style.color = "green";
        vegCell.style.fontWeight = "bold";
      } else {
        vegCell.style.color = "orange";
      }
    });
  }
}
