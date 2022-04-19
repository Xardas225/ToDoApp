let APP, SERVICE;
$(function () {
	SERVICE = new Service();
	APP = new App();
})

class Service {
	/**	
	 * constructor
	 */
	constructor() {

	}

	handleStatus(status, text) {
		switch (true) {
			case status === 'error':
				this.showError(text);
				break;
			case status === 'success':
				this.showSuccess(text)
				break;
			default:
				throw new Error('Не распознан статус сообщения');
		}
	}

	showSuccess(text) {
		let $container = $('.show__status__block');
		$container
			.css('backgroundColor', 'rgba(0,0,255,0.8)')
			.find('.show__status__title')
			.html('Успешно!')
			.end()
			.find('.show__status__text')
			.html(text)
			.end()
			.removeClass('d-none')


		this.hideStatus();
	}

	showError(text) {
		let $container = $('.show__status__block');
		$container
			.css('backgroundColor', 'rgba(255,0,0,0.8)')
			.find('.show__status__title')
			.html('Ошибка!')
			.end()
			.find('.show__status__text')
			.html(text)
			.end()
			.removeClass('d-none')

		this.hideStatus();
	}

	hideStatus() {
		let $container = $('.show__status__block');

		setTimeout(() => { $container.addClass('d-none') }, 2000);
	}


}

class App {
	/**	
	 * constructor
	 */
	constructor() {
		this.userName = this.getLocalStorageName();

		this.elements = {
			header: new Header(this.userName),
			sidePanel: new SidePanel(this.panel)
		}
		this.init();
	}

	init() {
	}

	getLocalStorageName() {
		return 'user';
	}
}


class Header {

	/**	
	 * constructor
	 */
	constructor(name) {
		this.init(name);
	}

	init(name) {
		this.setUserName(name);
		this.initElements();

		this.toggleSideBarBtn.on('click', this.toggleSideBar);
	}

	initElements() {
		this.toggleSideBarBtn = $('.nav__control__toggleMenu');
	}

	toggleSideBar() {
		$('.side__panel').toggleClass('toggle__side__panel');
	}

	setUserName(name) {
		$('.user__name').html(name);
	}
}

class SidePanel {

	/**
	 * constructor
	 */
	constructor() {
		this.elements = {
			actualTasks: new ActualTasks(),

		}
		this.init();
	}

	init() {
		this.title = $('.side__panel__actual');
		this.changeTitle();
	}

	changeTitle(title) {
		this.title.html(title ? title : this.getLocalStorageTitle());
	}

	getLocalStorageTitle() {
		return localStorage.getItem('title');
	}


}


class ActualTasks {
	/**	
	 * constructor
	 */
	constructor() {
		this.elements = {
			title: new ActualTitle(),
			popup: new PopupTask()
		}
		this.idx = 0;
		this.data = [];

		this.init();
		this.requestTasks();
	}

	/**
	 * Инициализация
	 */
	init() {
		this.initElements();
		this.initListeners();
		this.initDate();
	}

	/**
	 * Инициализация элементов
	 */
	initElements() {
		this.showTaskPanelBtn = $('.add__task');
		this.taskPanel = $('.new__task');
		this.taskTitle = $('#new__task__title');
		this.taskDesc = $('#new__task__text');
		this.newTaskBtn = $('#new__task__add');
		this.newTaskCancel = $('#new__task__cancel');
		this.taskList = $('.task__list');
	}

	/**
	 * Инициализация слушателей событий
	 */
	initListeners() {
		this.showTaskPanelBtn.on('click', this.toggleTaskPanel.bind(this));
		this.newTaskBtn.on('click', () => this.addTask());
		this.newTaskCancel.on('click', this.toggleTaskPanel.bind(this));
	}

	initDate() {
		$('.task__card__title-time').html(moment().format('ll'));
	}

	/**
	 * Показать панель добавления новой задачи
	 */
	toggleTaskPanel() {
		this.showTaskPanelBtn.toggleClass('d-none');
		this.taskPanel.toggleClass('d-none');
		this.resetTaskPanel();
	}

	/**
	 * Очистить панель добавление новой задачи
	 */
	resetTaskPanel() {
		this.taskTitle.val('')
		this.taskDesc.val('')
	}

	/**
	 * Добавить задачу
	 */
	addTask(value = null) {
		if (this.taskTitle.val() === '' && value === null) {
			SERVICE.handleStatus('error', 'В новой задаче отсутствует заголовок');
			throw new Error('В новой задаче отсутствует заголовок');
		}

		if (this.taskDesc.val() === '' && value === null) {
			SERVICE.handleStatus('error', 'В новой задаче отсутствует описание');
			throw new Error('В новой задаче отсутствует описание');
		}

		let task = $(`<li class="task__list-item" data-idx="${this.idx}">
                   <div class="task__list__content">
									 <button class="task__list-btn">
									 <svg class='check d-none'><path fill="currentColor" d="M11.23 13.7l-2.15-2a.55.55 0 0 0-.74-.01l.03-.03a.46.46 0 0 0 0 .68L11.24 15l5.4-5.01a.45.45 0 0 0 0-.68l.02.03a.55.55 0 0 0-.73 0l-4.7 4.35z"></path></svg>
									 </button>
    								<div class="task__list__fields">
      								<h3 class="task__list__title"></h3>
      								<div class="task__list__text"></div>
    								</div>
									 </div>
									 <div class="task__list__settings">
										<div class="task__list__time">
										</div>
										<div class="task__list-delete">
										</div>
									 </div>
  								</li>`);
		this.idx++;
		task
			.find('.task__list-btn')
			.on('click', this.toggleTaskStatus)
			.end()
			.find('.task__list-delete')
			.on('click', this.deleteTask)
			.end()
			.find('.task__list__title')
			.html(value ? value.title : this.taskTitle.val())
			.end()
			.find('.task__list__text')
			.html(value ? value.desc : this.taskDesc.val())
			.end()
			.find('.task__list__time')
			.html(value ? value.time : this.getTaskTime())

		this.taskList.append(task)

		this.data.push(
			{
				title: this.taskTitle.val(),
				desc: this.taskDesc.val(),
				time: this.getTaskTime(),
			}
		)
		this.setLocaleStorageTasks();

		this.toggleTaskPanel()
	}

	/**
	 * Удалить задачу
	 */
	deleteTask() {
		console.log(this.data)
	}

	/**
	 * Задача выполнена
	 */
	toggleTaskStatus(event) {
		$(event.currentTarget)
			.parent()
			.toggleClass('complete')
			.find('.task__list-btn svg')
			.toggleClass('d-none')
	}

	/**
	 * Получить время задачи
	 */
	getTaskTime() {
		return moment().format('lll');
	}

	/**
	 * Отменить добавление новой задачи
	 */
	cancelNewTask() {
		this.newTaskInput.val('')
	}

	getLocaleStorageTasks() {
		return [];
		// return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
	}

	requestTasks() {
		this.data = this.getLocaleStorageTasks();
		this.handleTasks();
	}

	handleTasks() {
		this.data.map(elem => this.addTask(elem))
	}

	/**
	 * Добавить данные в LocalStorage
	 */
	setLocaleStorageTasks() {
		localStorage.setItem('tasks', JSON.stringify(this.data));
	}

}

class ActualTitle {
	/**	
	 * constructor
	 */
	constructor() {
		this.init();
		this.saveActualTitle(this.getLocalStorageTitle());
	}

	init() {
		this.initElements();
		this.title.on('click', this.changeTitle.bind(this));
	}

	initElements() {
		this.title = $('.task__card__title');
	}

	changeTitle() {
		this.title.addClass('d-none');

		this.titleInputBlock = $('.task__card__title-block');

		this.titleInputBlock
			.removeClass('d-none')
			.end()
			.find('.task__card__title-input')
			.val(this.title.html().trim())
			.end()
			.find('.task__card__title-block__save')
			.on('click', () => this.saveActualTitle())
			.end()
			.find('.task__card__title-block__cancel')
			.on('click', () => this.cancelTitle())
	}

	/**
	 * Сохранить изменение заголовка
	 */
	saveActualTitle(value = null) {
		let titleValue = value ? value : this.titleInputBlock.find('.task__card__title-input').val();

		this.title
			.html(titleValue)

		if (!value) {
			this.hideBlock()
			APP.elements.sidePanel.changeTitle(titleValue);
		}

		this.setLocalStorageTitle();
	}

	hideBlock() {
		this.titleInputBlock.addClass('d-none')
		this.title.removeClass('d-none');
	}

	/**
	 * Отменить изменение заголовка
	 */
	cancelTitle() {
		this.titleInputBlock.addClass('d-none')
		this.title.removeClass('d-none')
	}

	/**
	 * Записать название заголовка в LocalStorage
	 */
	setLocalStorageTitle() {
		localStorage.setItem('title', this.title.html())
	}

	/**
	 * Получить название заголовка из LocalStorage
	 */
	getLocalStorageTitle() {
		return localStorage.getItem('title');
	}
}