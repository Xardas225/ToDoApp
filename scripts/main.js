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
		this.init();
		this.elements = {
			header: new Header(this.userName),
			content: new Content(this.userName),
			sideBar: new SideBar()
		}
	}

	init() {
		this.userName = this.getLocalStorageName();
	}

	getLocalStorageName() {
		return 'user';
	}
}

class SideBar {

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
	}

	setUserName(name) {
		$('.user__name').html(name);
	}
}

class Content {
	/**	
	 * constructor
	 */
	constructor(name) {
		this.init(name);
	}

	init(name) {
		this.getLocaleStorageData(name);
		this.initElements();
		this.showTaskPanelBtn.on('click', this.toggleTaskPanelShow.bind(this));
		this.newTaskBtn.on('click', this.addTask.bind(this));
		this.newTaskCancel.on('click', this.toggleTaskPanelShow.bind(this));
		this.title.on('click', this.changeTitle.bind(this));
	}

	initElements() {
		this.title = $('.task__card__title');
		this.showTaskPanelBtn = $('.add__task');
		this.taskPanel = $('.new__task');
		this.taskTitle = $('#new__task__title');
		this.taskDesc = $('#new__task__text');
		this.newTaskBtn = $('#new__task__add');
		this.newTaskCancel = $('#new__task__cancel');
		this.taskList = $('.task__list');
	}

	changeTitle() {
		this.title.addClass('d-none');
		
		const titleInputBlock = $('.task__card__title-block');

		titleInputBlock
			.removeClass('d-none')
		.end()
			.find('.task__card__title-input')
				.val(this.title.html().trim())
		.end()
		
	}

	toggleTaskPanelShow() {
		this.showTaskPanelBtn.toggleClass('d-none');
		this.taskPanel.toggleClass('d-none');
	}

	addTask() {
		if (this.taskTitle.val() === '') {
			SERVICE.handleStatus('error', 'В новой задаче отсутствует заголовок');
			throw new Error('В новой задаче отсутствует заголовок');
		}

		if (this.taskDesc.val() === '') {
			SERVICE.handleStatus('error', 'В новой задаче отсутствует описание');
			throw new Error('В новой задаче отсутствует описание');
		}

		const task = $('.task__list-item').clone();

		task
			.find('.task__list__title')
				.html(this.taskTitle.val())
		.end()
			.find('.task__list__text')
				.html(this.taskDesc.val())
		.end()
			.append(this.taskList)
		.end()
			.removeClass('d-none')
	}

	cancelNewTask() {
		this.newTaskInput.val('')
	}

	getLocaleStorageData(name) {

	}
}