// Task Controller - Presentation Layer
(function () {
  ("use strict");

  angular.module("taskApp").controller("TaskController", TaskController);

  //   TaskController.$inject = ["TaskService", "MyServiceService"];
  TaskController.$inject = ["MyServiceService"];

  //   function TaskController(TaskService, MyServiceService) {
  function TaskController(MyServiceService) {
    var vm = this;

    // Bindable properties
    vm.tasks = [];
    vm.newTask = {};
    vm.searchText = "";
    vm.showCompleted = true;
    vm.priorityFilter = "";
    vm.sortBy = "-createdAt";

    // Bindable methods
    vm.addTask = addTask;
    vm.deleteTask = deleteTask;
    vm.toggleTask = toggleTask;
    vm.getFilteredTasks = getFilteredTasks;
    vm.getCompletedCount = getCompletedCount;
    vm.resetForm = resetForm;
    vm.getTaskStats = getTaskStats;

    // Initialize
    activate();

    // Controller Methods
    function activate() {
      loadTasks();
      resetForm();
    }

    // function loadTasks() {
    //   vm.tasks = TaskService.getAllTasks();
    // }

    function loadTasks() {
      MyServiceService.getAllTasks().subscribe((tasks) => (vm.tasks = tasks));
    }

    //  function addTask() {
    //   if (vm.newTask.title && vm.newTask.title.trim()) {
    //     TaskService.addTask(vm.newTask);
    //     loadTasks();
    //     resetForm();
    //   }
    // }

    function addTask() {
      if (vm.newTask.title && vm.newTask.title.trim()) {
        MyServiceService.addTask(vm.newTask).subscribe(() => {
          loadTasks();
          resetForm();
        });
      }
    }

    //  function deleteTask(taskId) {
    //   if (confirm("Are you sure you want to delete this task?")) {
    //     TaskService.deleteTask(taskId);
    //     loadTasks();
    //   }
    // }

    function deleteTask(taskId) {
      if (confirm("Are you sure you want to delete this task?")) {
        MyServiceService.deleteTask(taskId).subscribe(() => {
          loadTasks();
        });
      }
    }

    // function toggleTask(taskId) {
    //   TaskService.toggleTaskComplete(taskId);
    //   loadTasks();
    // }

    function toggleTask(taskId) {
      MyServiceService.toggleTaskComplete(taskId).subscribe(() => {
        loadTasks();
      });
    }

    //  function getFilteredTasks() {
    //   var filtered = vm.tasks;

    //   // Apply search filter using lodash
    //   if (vm.searchText) {
    //     filtered = _.filter(filtered, function (task) {
    //       var searchLower = vm.searchText.toLowerCase();
    //       return (
    //         task.title.toLowerCase().includes(searchLower) ||
    //         task.description.toLowerCase().includes(searchLower)
    //       );
    //     });
    //   }

    //   // Apply priority filter using underscore
    //   if (vm.priorityFilter) {
    //     filtered = _.where(filtered, { priority: vm.priorityFilter });
    //   }

    //   // Apply completion filter
    //   if (!vm.showCompleted) {
    //     filtered = _.reject(filtered, { completed: true });
    //   }

    //   return filtered;
    // }

    function getFilteredTasks() {
      var filtered = vm.tasks;

      if (vm.searchText) {
        filtered = filtered.filter(
          (task) =>
            task.title.toLowerCase().includes(vm.searchText.toLowerCase()) ||
            task.description.toLowerCase().includes(vm.searchText)
        );
      }

      if (vm.priorityFilter) {
        filtered = filtered.filter(
          (task) => task.priority === vm.priorityFilter
        );
      }

      if (!vm.showCompleted) {
        filtered = filtered.filter((task) => !task.completed);
      }

      return filtered;
    }

    // function getCompletedCount() {
    //   return _.where(vm.getFilteredTasks(), { completed: true }).length;
    // }

    function getCompletedCount() {
      return vm.tasks.filter((task) => task.completed).length;
    }

    function resetForm() {
      vm.newTask = {
        title: "",
        description: "",
        priority: "medium",
        dueDate: new Date(),
      };
    }

    // function getTaskStats() {
    //   return TaskService.getTaskStats();
    // }

    function getTaskStats() {
      return MyServiceService.getTaskStats();
    }

    // vm.groupTasksByPriority = function () {
    //   return _.groupBy(vm.tasks, "priority");
    // };

    vm.groupTasksByPriority = function () {
      return vm.tasks.reduce((acc, task) => {
        (acc[task.priority] = acc[task.priority] || []).push(task);
        return acc;
      }, {});
    };

    // vm.getHighPriorityTasks = function () {
    //   return _.filter(vm.tasks, { priority: "high" });
    // };

    vm.getHighPriorityTasks = function () {
      return vm.tasks.filter((task) => task.priority === "high");
    };

    // vm.sortTasksByDate = function () {
    //   return _.sortBy(vm.tasks, "createdAt");
    // };

    vm.sortTasksByDate = function () {
      return vm.tasks.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    };

    // vm.getTasksWithinDays = function (days) {
    //   var targetDate = new Date();
    //   targetDate.setDate(targetDate.getDate() + days);

    //   return _.filter(vm.tasks, function (task) {
    //     return new Date(task.dueDate) <= targetDate && !task.completed;
    //   });
    // };

    vm.getTasksWithinDays = function (days) {
      var targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);

      return vm.tasks.filter(
        (task) => new Date(task.dueDate) <= targetDate && !task.completed
      );
    };
  }
})();
