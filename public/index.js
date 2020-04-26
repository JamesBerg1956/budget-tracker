let transactions = [];
let myChart;

// START trigger /api/transaction route
fetch("/api/transaction")
  
  // START promise callback function with GET response as parameter 
  .then(response => {
    // return response object in json format
    return response.json();
  })
  // END promise callback function with GET response as parameter

  // START second promise callback function
  .then(data => {
    
    // save db data on global variable
    transactions = data;

    // populate #total span element
    populateTotal();
    // populate #tbody in table
    populateTable();
    // populate chart
    populateChart();

  });
  // END second promise callback function
  // END trigger /api/transaction route

// START populateTotal function
function populateTotal() {

  // reduce transaction amounts to a single total value
  let total = transactions.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  // create var of #total span element
  let totalEl = document.querySelector("#total");
  // assign total transactions to text of #total span element
  totalEl.textContent = total;

}
// END populateTotal function

// START populateTable function
function populateTable() {

  // create var of #tbody element
  let tbody = document.querySelector("#tbody");
  // clear all elements from #tbody
  tbody.innerHTML = "";

  // START iterating through transactions object array
  transactions.forEach(transaction => {

    // create and populate a table row
    let tr = document.createElement("tr");
    // assign td elements with the current transaction's name and value
    tr.innerHTML = `<td>${transaction.name}</td>
      <td>${transaction.value}</td>`;

    // append tr element to #tbody element
    tbody.appendChild(tr);

  });
  // END iterating through transactions object array

}
// END populateTable function

// START populateChart function
function populateChart() {

  // copy array and reverse it
  let reversed = transactions.slice().reverse();
  // create var to track sum of transactions
  let sum = 0;

  // START create date labels for chart
  let labels = reversed.map(t => {

    // create var with current transaction's date key value
    let date = new Date(t.date);
    // return formatted dates to labels array 
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  });
  // END create date labels for chart

  // START create incremental values for chart
  let data = reversed.map(t => {

    // sum current transaction's value key value
    sum += parseInt(t.value);

    // return sum
    return sum;

  });
  // END create incremental values for chart

  // remove old chart if it exists
  if (myChart) {
    myChart.destroy();
  }

  // create var of #myChart canvas element
  let ctx = document.getElementById("myChart").getContext("2d");

  // START create a new chart in the 2d context
  myChart = new Chart(ctx, {
    type: 'line',
      data: {
        labels,
        datasets: [{
            label: "Total Over Time",
            fill: true,
            backgroundColor: "#6666ff",
            data
        }]
    }
  });
  // END create a new chart in the 2d context

}
// END populateChart function

// START sendTransaction function
function sendTransaction(isAdding) {

  // create var of Name of transaction input
  let nameEl = document.querySelector("#t-name");
  // create var of Transaction amount input
  let amountEl = document.querySelector("#t-amount");
  // create var of error message p element
  let errorEl = document.querySelector(".form .error");

  // START validate form for blank inputs
  if (nameEl.value === "" || amountEl.value === "") {
    
    // add error message 
    errorEl.textContent = "Missing Information";

    // break out of function
    return;

  }
  // END validate form for blank inputs
  // START else - inputs have values
  else {
    // empty text of error message
    errorEl.textContent = "";
  }
  // END else

  // START create transaction from input values
  let transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString()
  };
  // START create transaction from input values

  // START if subtracting funds
  if (!isAdding) {
    // convert amount to negative number
    transaction.value *= -1;
  }
  // END if subtracting funds

  // add to beginning of current array of data
  transactions.unshift(transaction);

  // re-run logic to populate ui with new record
  populateChart();
  populateTable();
  populateTotal();
  
  // START POST transaction object to server
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
  // END POST transaction object to server

  // START POST promise callback function with response as parameter
  .then(response => {    
    // return response in json format
    return response.json();
  })
  // END POST promise callback function with response as parameter

  // START second promise callback function
  .then(data => {

    // START check for errors in data
    if (data.errors) {

      // add error message to element
      errorEl.textContent = "Missing Information";

    }
    // END check for errors in data
    // START else
    else {

      // clear form
      nameEl.value = "";
      amountEl.value = "";

    }
    // END else

  })
  // END second promise callback function

  // START catch
  .catch(err => {

    // fetch failed, so save in indexed db
    saveRecord(transaction);

    // clear form
    nameEl.value = "";
    amountEl.value = "";

  });
  // END catch
}
// END sendTransaction function

// START #add-button click event listener
document.querySelector("#add-btn").onclick = function() {
  // call sendTransaction to add funds
  sendTransaction(true);
};
// END #add-button click event listener

// START #sub-btn event listener
document.querySelector("#sub-btn").onclick = function() {
  // call sendTransaction to subtract funds
  sendTransaction(false);
};
// END #sub-btn event listener
