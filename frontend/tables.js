const submitButton = document.getElementById("submit");
const nextPageButton = document.getElementById("next");
const previousPageButton = document.getElementById("previous");
const tableArea = document.createElement("div");
document.body.appendChild(tableArea);
fetch_and_generate_table(0);

submitButton.addEventListener("click", () => {
    var current_page = document.getElementById("currentPage").value;
    if(current_page = ""){
        current_page = 0
    }
    else{
        current_page = Number(current_page)
    }
    fetch_and_generate_table(current_page);
}
);
nextPageButton.addEventListener("click", () => {
    var current_page = Number(document.getElementById("currentPage").value);
    current_page += 1;
    document.getElementById("currentPage").value = String(current_page)
    fetch_and_generate_table(current_page);
}
);
previousPageButton.addEventListener("click", () => {
    var current_page = Number(document.getElementById("currentPage").value);
    current_page -= 1;
    if(current_page < 0){
        current_page = 0;
    }
    document.getElementById("currentPage").value = String(current_page)
    fetch_and_generate_table(current_page);
}
);


async function fetch_and_generate_table(page){
    tableArea.innerHTML = '';

    document.getElementById("currentPage").value = Number(page);
    page_str = String(page)
    const column1 = document.getElementById("column1").value;
    const column2 = document.getElementById("column2").value;
    const column3 = document.getElementById("column3").value;

    const category1 = document.getElementById("category1").value;
    const category2 = document.getElementById("category2").value;
    const category3 = document.getElementById("category3").value;
    var data = {
        "columns": [column1, column2, column3],
        "categories": [category1, category2, category3]
    };
    const url = `http://localhost:5000/api/businesses/${page_str}`;
    fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
    })
    .then((response) => response.json())
    .then(json => {
        console.log(json);
        createTable(json);
    });
}

function createTable(data) {
    tableArea.innerHTML = '';

    if (data.length == 0){
        nextPageButton.disabled = true
        previousPageButton.disabled = false
        return;
    }
    if(document.getElementById("currentPage").value <= 0){
        nextPageButton.disabled = false
        previousPageButton.disabled = true
    }
    else{
        nextPageButton.disabled = false
        previousPageButton.disabled = false
    }

    const tbl = document.createElement("table");
    const tblBody = document.createElement("tbody");

    column_names = Object.keys(data[0]).sort().reverse();

    for (let i = 0; i < data.length + 1; i++) {
      const row = document.createElement("tr");

      for (let j = 0; j < column_names.length; j++) {
        const cell = document.createElement("td");
        const current_business_data = data[i - 1]

        var cellText = null;
        if(i == 0){
            cellText = document.createTextNode(column_names[j]);
        }
        else{
            cellText = document.createTextNode(current_business_data[column_names[j]]);
        }
        cell.appendChild(cellText);
        row.appendChild(cell);
      }

      // add the row to the end of the table body
      tblBody.appendChild(row);
    }

    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // appends <table> into <body>
    tableArea.appendChild(tbl);
    // sets the border attribute of tbl to '2'
    tbl.setAttribute("border", "2");
    tbl.setAttribute("id", "TableToExport")
  }