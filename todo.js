todoMain();

function todoMain() {
  const DEFAULT_OPTION = "choose category";

  let inputEle, button, inputEle2, ulElem, selectElem;
  let todoList = [];

  getElements();
  addListeners();
  load();
  renderRows();
  updateSelectOptions();

  function getElements() {
    inputEle = document.getElementsByTagName("input")[0];
    inputEle2 = document.getElementsByTagName("input")[1];
    ulElem = document.getElementsByTagName("ul")[0];
    selectElem = document.getElementById("categoryFilter");
    button = document.getElementById("add-btn");
  }

  function addListeners() {
    button.addEventListener("click", addTask, false);
    selectElem.addEventListener("change", filterEntries, false);
  }

  function addTask(event) {
    let inputValue = inputEle.value;
    inputEle.value = "";

    let inputValue2 = inputEle2.value;
    inputEle2.value = "";

    let obj = {
      todo: inputValue,
      category: inputValue2,
    };

    renderRow(obj);

    todoList.push(obj);

    save();
    updateSelectOptions();
  }
  function filterEntries() {
    let selection = selectElem.value;

    if (selection === DEFAULT_OPTION) {
      let rows = document.getElementsByTagName("tr");
      Array.from(rows).forEach((row, index) => {
        row.style.display = "";
      });
    } else {
      let rows = document.getElementsByTagName("tr");
      Array.from(rows).forEach((row, index) => {
        if (index === 0) return;
        let category = row.getElementsByTagName("td")[2].innerText;
        if (category === selectElem.value) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    }
  }

  function updateSelectOptions() {
    let options = [];
    let rows = document.getElementsByTagName("tr");
    Array.from(rows).forEach((row, index) => {
      if (index === 0) return;
      let category = row.getElementsByTagName("td")[2].innerText;

      options.push(category);
    });
    let optionsSet = new Set(options);

    //empty options
    selectElem.innerHTML = "";

    let newOptionElem = document.createElement("option");
    newOptionElem.value = DEFAULT_OPTION;
    newOptionElem.innerText = DEFAULT_OPTION;
    selectElem.appendChild(newOptionElem);

    for (let option of optionsSet) {
      let newOptionElem = document.createElement("option");
      newOptionElem.value = option;
      newOptionElem.innerText = option;
      selectElem.appendChild(newOptionElem);
    }
  }
  function save() {
    let stringified = JSON.stringify(todoList);
    localStorage.setItem("todoList", stringified);
  }
  function load() {
    let retrieved = localStorage.getItem("todoList");
    todoList = JSON.parse(retrieved);
    console.log(typeof todoList);
    if (todoList === null) {
      todoList = [];
    }
  }
  function renderRows() {
    todoList.forEach((todoObj) => {
      renderRow(todoObj);
    });
  }
  function renderRow(obj) {
    let { todo: inputValue, category: inputValue2 } = obj;

    //add a new Row

    let table = document.getElementById("todoTable");

    let trElem = document.createElement("tr");
    table.appendChild(trElem);
    //checkbox cell,
    let checkboxElem = document.createElement("input");
    checkboxElem.type = "checkbox";
    checkboxElem.addEventListener("click", done, false);
    let tdElem = document.createElement("td");
    tdElem.appendChild(checkboxElem);
    trElem.appendChild(tdElem);

    //todo cell
    let tdElem2 = document.createElement("td");
    tdElem2.innerText = inputValue;
    trElem.appendChild(tdElem2);

    //category cell
    let tdElem3 = document.createElement("td");
    tdElem3.innerText = inputValue2;
    trElem.appendChild(tdElem3);

    //delete cell
    let spanElem = document.createElement("span");
    spanElem.innerText = "delete";
    spanElem.className = "material-symbols-outlined";
    spanElem.addEventListener("click", deleteItem, false);
    let tdElem4 = document.createElement("td");
    tdElem4.appendChild(spanElem);
    trElem.appendChild(tdElem4);

    function deleteItem() {
      trElem.remove();
      updateSelectOptions();
    }
    function done() {
      trElem.classList.toggle("strike");
    }
  }
}
