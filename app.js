// 找到页面元素
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const filterButtons = document.querySelectorAll(".filters button");

// 从浏览器中读取以前保存的数据
const savedTasks = localStorage.getItem("todoTasks");

// 如果存在旧数据，就将它转回数组；否则使用空数组
let tasks = savedTasks ? JSON.parse(savedTasks) : [];

let currentFilter = "all";

// 保存数据
function saveTasks() {
  const tasksAsText = JSON.stringify(tasks);
  localStorage.setItem("todoTasks", tasksAsText);
}

// 根据 tasks 数组重新显示页面
function renderTasks() {
  // 先清空当前列表，防止重复显示
  taskList.innerHTML = "";

  let visibleTasks = tasks;

  if(currentFilter === "active"){
    visibleTasks = tasks.filter(function(task){
        return task.completed === false;
    });
  }

  if(currentFilter === "completed"){
    visibleTasks = tasks.filter(function(task){
        return task.completed === true;
    });
  }

  visibleTasks.forEach(function (task) {
    // 创建一条列表项
    const listItem = document.createElement("li");

    // 如果任务已经完成，添加 completed 类
    if (task.completed) {
      listItem.classList.add("completed");
    }

    // 创建复选框
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    // 创建事项文字
    const text = document.createElement("span");
    text.textContent = task.text;

    // 创建删除按钮
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "delete";

    // 勾选或取消勾选
    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;

      saveTasks();
      renderTasks();
    });

    // 删除事项
    deleteButton.addEventListener("click", function () {
      tasks = tasks.filter(function (currentTask) {
        return currentTask.id !== task.id;
      });

      saveTasks();
      renderTasks();
    });

    // 将元素放进列表
    listItem.append(checkbox, text, deleteButton);
    taskList.append(listItem);
  });

const remainingTasks = tasks.filter(function (task) {
    return task.completed === false;
});

taskCount.textContent = remainingTasks.length + " items to be done";
}

// 提交表单时添加事项
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = input.value.trim();

  if (taskText === "") {
    return;
  }

  // 创建一个表示待办事项的对象
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  // 将新事项放进数组
  tasks.push(newTask);

  // 保存并更新页面
  saveTasks();
  renderTasks();

  input.value = "";
  input.focus();
});

filterButtons.forEach(function(button){
    button.addEventListener("click", function(){
        //读取按钮上的data-filter
        currentFilter = button.dataset.filter;

        //更新按钮的选中样式
        filterButtons.forEach(function(currentButton){
            currentButton.classList.remove("active");
        });

        button.classList.add("active");
        
        // 使用新的筛选条件重新显示页面
        renderTasks();
    })
});

// 页面刚打开时，显示已经保存的事项
renderTasks();