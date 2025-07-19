let data = [];
let loggedIn = false;

window.onload = function() {
  if (localStorage.getItem("rememberMe") === "true") {
    document.getElementById("login-id").value = "admin";
    document.getElementById("login-password").value = "1234";
    document.getElementById("remember-me").checked = true;
  }
  
  fetch("data.csv")
    .then(response => response.text())
    .then(text => {
      const rows = text.trim().split("\n"); // fixed backslash issue
      const headers = rows[0].split(",");
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(",");
        const obj = {};
        headers.forEach((h, j) => {
          obj[h.trim()] = values[j]?.trim();
        });
        data.push(obj);
      }
    });
};

function login() {
  const id = document.getElementById("login-id").value;
  const pass = document.getElementById("login-password").value;
  const remember = document.getElementById("remember-me").checked;
  
  if (id === "admin" && pass === "1234") {
    loggedIn = true;
    if (remember) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-content").style.display = "block";
  } else {
    document.getElementById("login-error").textContent = "Invalid credentials!";
  }
}

function refreshPage() {
  document.getElementById("search-input").value = "";
  document.getElementById("results").innerHTML = "";
}

function searchData() {
  const type = document.getElementById("search-type").value;
  const input = document.getElementById("search-input").value.trim().toLowerCase();
  
  const matches = data.filter(row => row[type]?.toLowerCase() === input);
  
  if (matches.length === 0) {
    document.getElementById("results").innerHTML = "<p>No record found.</p>";
    return;
  }
  
  const fields = ["DIV_CODE", "SDO_CODE", "SUBSTATION", "FEEDER", "CON_STATUS", "PROJECT_AREA", "SUPPLY_TYPE", "LOAD", "KNO", "SCNO", "MOBILE_NO", "ACCT_ID", "BOOK_NO", "SERIAL_NBR", "NAME", "FATHER_NAME", "ADDRESS"];
  const hindi = ["मंडल कोड", "SDO कोड", "सबस्टेशन", "फीडर", "स्थिति", "परियोजना क्षेत्र", "आपूर्ति प्रकार", "लोड", "केएनओ", "एससी नंबर", "मोबाइल नंबर", "खाता आईडी", "बुक नंबर", "सीरियल नंबर", "नाम", "पिता का नाम", "पता"];
  
  let table = `<table><tr>`;
  fields.forEach((field, i) => {
    table += `<th>${field}<br>(${hindi[i]})</th>`;
  });
  table += `</tr>`;
  
  matches.forEach(row => {
    table += `<tr>`;
    fields.forEach(f => {
      table += `<td>${row[f] || ""}</td>`;
    });
    table += `</tr>`;
  });
  
  table += `</table><br><button onclick="generatePDF()">Download PDF</button>`;
  document.getElementById("results").innerHTML = table;
}

function generatePDF() {
  const printWindow = window.open('', '', 'height=800,width=1000');
  printWindow.document.write('<html><head><title>UPPCL Details PDF</title>');
  printWindow.document.write('<style>');
  printWindow.document.write('body { font-family: Arial; padding: 20px; }');
  printWindow.document.write('table { width: 100%; border-collapse: collapse; }');
  printWindow.document.write('th, td { border: 1px solid #333; padding: 10px; text-align: left; }');
  printWindow.document.write('th { background-color: #003366; color: white; }');
  printWindow.document.write('</style></head><body>');
  printWindow.document.write('<h2>UPPCL - Details Report</h2>');
  printWindow.document.write(document.getElementById("results").innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}
