todoMain();

function todoMain() {
  const DEFAULT_OPTION = "choose category";
  let todoList = [];
  let inputEle,
    addButton,
    inputEle2,
    selectElem,
    dateInput,
    sortButton,
    shortlistBtn,
    prior,
    sortBtnPrio,
    searchInput,
    searchbtn;

  getElements();
  addListeners();
  load();
  renderRows(todoList);
  updateSelectOptions();

  function getElements() {
    inputEle = document.getElementsByTagName("input")[1];
    inputEle2 = document.getElementsByTagName("input")[2];
    selectElem = document.getElementById("categoryFilter");
    addButton = document.getElementById("add-btn");
    dateInput = document.getElementById("dateInput");
    prior = document.getElementById("priorityId");
    sortButton = document.getElementById("sortBtn");
    shortlistBtn = document.getElementById("shortlistBtn");
    sortBtnPrio = document.getElementById("sortBtnPrio");
    searchInput = document.getElementById("searchInput");
    searchbtn = document.getElementById("searchbtn");
  }

  function addListeners() {
    addButton.addEventListener("click", addTask, false);
    sortButton.addEventListener("click", sortEntry, false);
    sortBtnPrio.addEventListener("click", sortEntryPrio, false);
    selectElem.addEventListener("change", multipleFilter, false);
    shortlistBtn.addEventListener("change", multipleFilter, false);
    searchbtn.addEventListener("click", searchTodos, false);
    //event delegation
    document
      .getElementById("todoTable")
      .addEventListener("click", onTableClicked, false);
  }

  function addTask(event) {
    if (
      inputEle.value == "" ||
      inputEle2.value == "" ||
      prior.value == "" ||
      dateInput.value == ""
    ) {
      alert("please enter every field");
      return;
    }
    console.log(inputEle2.value);
    let inputValue = inputEle.value;
    inputEle.value = "";

    let inputValue2 = inputEle2.value;
    inputEle2.value = "";

    let selectedOption = prior.value;
    let dateValue = dateInput.value;
    dateInput.value = "";
    console.log(prior);
    let obj = {
      id: _uuid(),
      todo: inputValue,
      category: inputValue2,
      date: dateValue,
      priority: selectedOption,
      done: false,
    };
    renderRow(obj);

    todoList.push(obj);

    save();
    updateSelectOptions();
  }

  function updateSelectOptions() {
    let options = [];
    todoList.forEach((obj) => {
      options.push(obj.category);
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
    if (todoList === null) {
      todoList = [];
    }
  }
  function renderRows(arr) {
    arr.forEach((todoObj) => {
      renderRow(todoObj);
    });
  }
  function renderRow({
    id,
    todo: inputValue,
    category: inputValue2,
    date,
    priority: selectedOption,
    done,
  }) {
    //add a new Row
    let table = document.getElementById("todoTable");

    let trElem = document.createElement("tr");
    table.appendChild(trElem);

    //checkbox cell,
    let checkboxElem = document.createElement("input");
    checkboxElem.type = "checkbox";
    checkboxElem.addEventListener("click", checkboxClickCallback, false);
    checkboxElem.dataset.id = id;
    let tdElem = document.createElement("td");
    tdElem.appendChild(checkboxElem);
    trElem.appendChild(tdElem);

    //date Cell
    let dateElem = document.createElement("td");
    let dateObj = new Date(date);

    dateElem.innerText = date;
    trElem.appendChild(dateElem);
    //priority cell
    let tdprior = document.createElement("td");
    tdprior.innerText = selectedOption;
    trElem.appendChild(tdprior);

    let tdElem2 = document.createElement("td");
    tdElem2.innerText = inputValue;
    trElem.appendChild(tdElem2);

    //category cell
    let tdElem3 = document.createElement("td");
    tdElem3.innerText = inputValue2;
    tdElem.className = "categoryCell";
    trElem.appendChild(tdElem3);

    //edit cell
    // let editSpan = document.createElement("span");
    // editSpan.innerText = "edit";
    // editSpan.className = "material-symbols-outlined";
    // editSpan.addEventListener("click", allowEdit, false);
    // editSpan.dataset.id = id;
    // let editTd = document.createElement("td");
    // editTd.appendChild(editSpan);
    // trElem.appendChild(editTd);

    //delete cell
    let spanElem = document.createElement("span");
    spanElem.innerText = "delete";
    spanElem.className = "material-symbols-outlined";
    spanElem.addEventListener("click", deleteItem, false);
    spanElem.dataset.id = id;
    let tdElem4 = document.createElement("td");
    tdElem4.appendChild(spanElem);
    trElem.appendChild(tdElem4);

    checkboxElem.checked = done;
    if (done) {
      trElem.classList.add("strike");
    } else {
      trElem.classList.remove("strike");
    }
    //For edit on cell feature
    dateElem.dataset.editable = true;
    tdElem2.dataset.editable = true;
    tdElem3.dataset.editable = true;

    dateElem.dataset.type = "date";
    dateElem.dataset.value = date;
    tdElem2.dataset.type = "todo";
    tdElem3.dataset.type = "category";

    dateElem.dataset.id = id;
    tdElem2.dataset.id = id;
    tdElem3.dataset.id = id;

    function deleteItem() {
      trElem.remove();
      updateSelectOptions();
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id) {
          todoList.splice(i, 1);
        }
      }
      save();
    }

    function checkboxClickCallback() {
      trElem.classList.toggle("strike");
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id) {
          todoList[i]["done"] = this.checked;
        }
      }
      save();
    }
    function allowEdit(event) {
      let currentText = event.target.innerText;
      event.target.innerText = "";
      let tempTextbox = document.createElement("input");
      event.target.appendChild(tempTextbox);
      tempTextbox.value = currentText;

      tempTextbox.addEventListener("change", onChange, false);
      function onChange(event) {
        let changedValue = event.target.value;
        todoList.forEach((todoObj) => {
          if (todoObj.id == event.target.parentNode.dataset.id) {
            todoObj.todo = changedValue;
          }
        });
        save();

        event.target.parentNode.innerText = changedValue;
      }
    }
  }

  function _uuid() {
    var d = Date.now();
    if (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
    ) {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }
  function sortEntry() {
    todoList.sort((a, b) => {
      let aDate = Date.parse(a.date);
      let bDate = Date.parse(b.date);
      return aDate - bDate;
    });
    save();

    clearTable();
    renderRows(todoList);
  }
  function sortEntryPrio() {
    todoList.sort(customSort);
    function customSort(a, b) {
      const priorityOrder = { High: 1, medium: 2, low: 3 };
      const priorityA = priorityOrder[a.priority];
      const priorityB = priorityOrder[b.priority];
      return priorityA - priorityB;
    }
    console.log(todoList);
    save();

    clearTable();
    renderRows(todoList);
  }
  function clearTable() {
    //empty the table, keeping the first row
    let trElems = document.getElementsByTagName("tr");
    for (let i = trElems.length - 1; i > 0; i--) {
      trElems[i].remove();
    }
  }

  function multipleFilter() {
    clearTable();

    //shortListBtn.checked
    let selection = selectElem.value;
    if (selection == DEFAULT_OPTION) {
      if (shortlistBtn.checked) {
        let filteredIncompArray = todoList.filter((obj) => obj.done == false);
        renderRows(filteredIncompArray);
        let filteredCompArray = todoList.filter((obj) => obj.done == true);
        renderRows(filteredCompArray);
      } else {
        renderRows(todoList);
      }
    } else {
      let filteredCategoryArray = todoList.filter(
        (obj) => obj.category === selection
      );
      if (shortlistBtn.checked) {
        let filteredIncompArray = filteredCategoryArray.filter(
          (obj) => obj.done == false
        );
        renderRows(filteredIncompArray);
        let filteredCompArray = filteredCategoryArray.filter(
          (obj) => obj.done == true
        );
        renderRows(filteredCompArray);
      } else {
        renderRows(filteredCategoryArray);
      }
    }
  }
  function onTableClicked(event) {
    if (event.target.matches("td") && event.target.dataset.editable == "true") {
      let tempInputElem;
      switch (event.target.dataset.type) {
        case "date":
          tempInputElem = document.createElement("input");
          tempInputElem.type = "date";
          tempInputElem.value = event.target.dataset.value;

          event.target.appendChild(tempInputElem);

          break;
        case "todo":
        case "category":
          tempInputElem = document.createElement("input");
          tempInputElem.value = event.target.innerText;
          event.target.appendChild(tempInputElem);
          break;

        default:
      }
      event.target.innerText = "";
      event.target.appendChild(tempInputElem);

      tempInputElem.addEventListener("change", onChange, false);
      function onChange(event) {
        let changedValue = event.target.value;
        todoList.forEach((todoObj) => {
          if (todoObj.id == event.target.parentNode.dataset.id) {
            todoObj.todo = changedValue;
            todoObj[event.target.parentNode.dataset.type] = changedValue;
          }
        });
        save();

        event.target.parentNode.innerText = changedValue;
      }
    }
  }

  function priorityChange(event) {
    selectedOption = event.target.value;
  }

  function searchTodos() {
    console.log(searchInput);
    const searchTerm = searchInput.value.trim().toLowerCase();
    console.log(searchTerm);
    if (searchTerm === "") {
      alert("Please enter something to search");
      return;
    }
    let searchResults = [];
    searchResults = todoList.filter(
      (todo) => todo.todo.toLowerCase().indexOf(searchTerm) !== -1
    );

    console.log(searchResults);
    if (searchResults.length <= 0) {
      alert("No such task");
      return;
    }
    save();
    clearTable();
    renderRows(searchResults);
  }
}
