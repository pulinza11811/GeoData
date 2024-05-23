//------ Wiki ------//
document.addEventListener("DOMContentLoaded", function () {
  let originalData = []; // เก็บข้อมูลต้นฉบับไว้เพื่อใช้ในการกรอง

  fetch("https://node-mongodb-api-x91v.onrender.com/api/province")
    .then((response) => response.json())
    .then((data) => {
      originalData = data; // เก็บข้อมูลต้นฉบับไว้ในตัวแปร originalData
      displayData(data);
    })
    .catch((error) => console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error));

  function displayData(data) {
    const tbody = document.getElementById("dataDisplay");
    tbody.innerHTML = ""; // เคลียร์ข้อมูลที่อยู่ในตารางทุกครั้งที่แสดงข้อมูลใหม่

    data.forEach((item) => {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = item.id;
      row.appendChild(idCell);

      const codeCell = document.createElement("td");
      codeCell.textContent = item.code;
      row.appendChild(codeCell);

      const nameCell = document.createElement("td");
      nameCell.textContent = item.provincename;
      row.appendChild(nameCell);

      const linkCell = document.createElement("td");
      const linkButton = document.createElement("a");
      linkButton.textContent = "ดูข้อมูล";
      linkButton.href = item.url;
      linkButton.classList.add("btn", "btn-outline-primary");
      linkButton.target = "_blank"; // เปิดหน้าเว็บในหน้าต่างใหม่
      linkCell.appendChild(linkButton);
      row.appendChild(linkCell);

      tbody.appendChild(row);
    });
  }

  document
    .getElementById("searchButton")
    .addEventListener("click", function () {
      const searchTerm = document
        .getElementById("searchInput")
        .value.toLowerCase();
      const filteredData = originalData.filter((item) => {
        return item.provincename.toLowerCase().includes(searchTerm);
      });
      if (filteredData.length > 0) {
        displayData(filteredData);
      } else {
        const tbody = document.getElementById("dataDisplay");
        tbody.innerHTML = "<tr><td colspan='4'>ไม่พบข้อมูลที่ค้นหา</td></tr>";
      }
      document.getElementById("searchInput").value = "";
    });
});
