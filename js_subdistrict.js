document.addEventListener("DOMContentLoaded", function () {
  const itemsPerPage = 50; // จำนวนรายการต่อหน้า
  let currentPage = 1; // หน้าปัจจุบัน
  let totalPages = 0; // จำนวนหน้าทั้งหมด
  let originalData = []; // เก็บข้อมูลต้นฉบับไว้เพื่อใช้ในการกรอง

  // เรียกใช้ฟังก์ชันเพื่อโหลดข้อมูลในหน้าแรก
  fetchDistrictData(currentPage);

  //ฟังก์ชันนี้ใช้ดึงข้อมูลรายการเขตจาก API โดยใช้หมายเลขหน้าที่ส่งมา (page)
  function fetchDistrictData(page) {
    const url = `https://node-mongodb-api-x91v.onrender.com/api/subdistricts/page/${page}`;
    //https://node-mongodb-api-x91v.onrender.com/api/subdistricts/page/1
    //https://node-mongodb-api-x91v.onrender.com/api/districts/page/${page}
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        originalData = data.subdistricts; // เก็บข้อมูลต้นฉบับไว้ในตัวแปร originalData
        totalPages = data.pages; // กำหนดจำนวนหน้าทั้งหมด
        displayData(originalData);
        createPagination(); // สร้าง pagination
        updatePageInfo(); // แสดงหมายเลขหน้าปัจจุบันและจำนวนหน้าทั้งหมด
      })
      .catch((error) => {
        console.error("Error fetching district data:", error);
        // จัดการกับข้อผิดพลาดอย่างสวยงาม เช่น การแสดงข้อความแสดงข้อผิดพลาดแก่ผู้ใช้
      });
  }

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
      nameCell.textContent = item.subdistrict;
      row.appendChild(nameCell);

      tbody.appendChild(row);
    });

    // แสดงจำนวนข้อมูลทั้งหมดตามข้อมูลที่กรอง
    const totalData = document.getElementById("totalData");
    totalData.textContent = `พบข้อมูลทั้งหมด: ${data.length} รายการ`;

    // ล้างการแบ่งหน้าและสร้างใหม่ตามข้อมูลที่กรอง
    createPagination();
  }

  function createPagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    // First page button
    const firstPageButton = document.createElement("li");
    firstPageButton.classList.add("page-item");
    firstPageButton.innerHTML = `<a class="page-link" href="#">&laquo;</a>`;
    firstPageButton.addEventListener("click", function () {
      currentPage = 1;
      fetchDistrictData(currentPage);
    });
    paginationContainer.appendChild(firstPageButton);

    // Previous button
    const previousButton = document.createElement("li");
    previousButton.classList.add("page-item");
    previousButton.innerHTML = `<a class="page-link" href="#">&lt;</a>`;
    previousButton.addEventListener("click", function () {
      if (currentPage > 1) {
        currentPage--;
        fetchDistrictData(currentPage);
      }
    });
    paginationContainer.appendChild(previousButton);

    // Page number buttons
    const maxVisiblePages = 6; // จำนวนปุ่มหน้าที่แสดงสูงสุด
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      // แสดงปุ่มสำหรับทุกหน้า
      startPage = 1;
      endPage = totalPages;
    } else {
      // แสดงปุ่มสำหรับบางหน้าเท่านั้น
      const offset = Math.floor(maxVisiblePages / 2);
      if (currentPage <= offset) {
        // หน้าปัจจุบันอยู่ช่วงต้น
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + offset >= totalPages) {
        // หน้าปัจจุบันอยู่ช่วงท้าย
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        // หน้าปัจจุบันอยู่ช่วงกลาง
        startPage = currentPage - offset;
        endPage = currentPage + offset;
      }
    }

    // Display page numbers
    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement("li");
      pageButton.classList.add("page-item");
      pageButton.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      pageButton.addEventListener("click", function () {
        currentPage = parseInt(this.textContent);
        fetchDistrictData(currentPage);
      });
      if (currentPage === i) {
        pageButton.classList.add("active");
      } else {
        pageButton.classList.remove("active");
      }
      paginationContainer.appendChild(pageButton);
    }

    // Display first page (no duplicates)
    if (startPage > 1) {
      if (currentPage === 1) {
        firstPageButton.classList.add("active");
      } else {
        firstPageButton.classList.remove("active");
      }
    } else {
      firstPageButton.classList.add("active");
    }

    // // Display last page (no duplicates) แสดงเลขท้ายสุดของข้อมูลนั้น
    // if (totalPages > 1 && endPage < totalPages) {
    //   const lastPageButton = document.createElement("li");
    //   lastPageButton.classList.add("page-item");
    //   lastPageButton.innerHTML = `<a class="page-link" href="#">${totalPages}</a>`;
    //   lastPageButton.addEventListener("click", function () {
    //     currentPage = totalPages;
    //     fetchDistrictData(currentPage);
    //   });
    //   if (currentPage === totalPages) {
    //     lastPageButton.classList.add("active");
    //   } else {
    //     lastPageButton.classList.remove("active");
    //   }
    //   paginationContainer.appendChild(lastPageButton);
    // }

    // Next button
    const nextButton = document.createElement("li");
    nextButton.classList.add("page-item");
    nextButton.innerHTML = `<a class="page-link" href="#">&gt;</a>`;
    nextButton.addEventListener("click", function () {
      if (currentPage < totalPages) {
        currentPage++;
        fetchDistrictData(currentPage);
      }
    });
    paginationContainer.appendChild(nextButton);

    // Last page button
    const lastPageButton2 = document.createElement("li");
    lastPageButton2.classList.add("page-item");
    lastPageButton2.innerHTML = `<a class="page-link" href="#">&raquo;</a>`;
    lastPageButton2.addEventListener("click", function () {
      currentPage = totalPages;
      fetchDistrictData(currentPage);
    });
    paginationContainer.appendChild(lastPageButton2);
  }

  // Function to update page info แสดงหมายเลขหน้าปัจจุบันและจำนวนหน้าทั้งหมด
  function updatePageInfo() {
    const pageInfo = document.getElementById("pageInfo");
    pageInfo.textContent = `หน้า ${currentPage} จาก ${totalPages}`;
  }

  console.log(updatePageInfo);
  //Function ค้นหา
  document
    .getElementById("searchButton")
    .addEventListener("click", function () {
      const searchTerm = document
        .getElementById("searchInput")
        .value.toLowerCase();
      //เก็บข้อมูลรายการเขตที่กรองแล้ว
      const filteredData = originalData.filter((item) => {
        return item.subdistrict.toLowerCase().includes(searchTerm);
      });
      if (filteredData.length > 0) {
        displayData(filteredData);
        totalPages = Math.ceil(filteredData.length / itemsPerPage); // คำนวณจำนวนหน้าใหม่
        createPagination(); // สร้าง pagination ใหม่
      } else {
        const tbody = document.getElementById("dataDisplay");
        tbody.innerHTML = "<tr><td colspan='3'>ไม่พบข้อมูลที่ค้นหา</td></tr>"; // เมื่อไม่พบข้อมูล ก็จะไม่ต้องสร้าง pagination ใหม่
        document.getElementById("pagination").innerHTML = "";
      }
      document.getElementById("searchInput").value = "";
    });
});
