export class Tutorial {
	constructor() {
		this.currentStep = 0;
		// Check if 'showTutorial' is initialized, if it's uninitialized, set it to true.
		this.showTutorial = localStorage.getItem('showTutorial') !== 'false';
	}
}

// Advances the tutorial to the next step
Tutorial.prototype.nextStep = function () {
	var humanGrid = document.querySelector('.human-player');
	var computerGrid = document.querySelector('.computer-player');
	switch (this.currentStep) {
		case 0:
			document.getElementById('roster-sidebar').setAttribute('class', 'highlight');
			document.getElementById('step1').setAttribute('class', 'current-step');
			this.currentStep++;
			break;
		case 1:
			document.getElementById('roster-sidebar').removeAttribute('class');
			document.getElementById('step1').removeAttribute('class');
			humanGrid.setAttribute('class', humanGrid.getAttribute('class') + ' highlight');
			document.getElementById('step2').setAttribute('class', 'current-step');
			this.currentStep++;
			break;
		case 2:
			document.getElementById('step2').removeAttribute('class');
			var humanClasses = humanGrid.getAttribute('class');
			humanClasses = humanClasses.replace(' highlight', '');
			humanGrid.setAttribute('class', humanClasses);
			this.currentStep++;
			break;
		case 3:
			computerGrid.setAttribute('class', computerGrid.getAttribute('class') + ' highlight');
			document.getElementById('step3').setAttribute('class', 'current-step');
			this.currentStep++;
			break;
		case 4:
			var computerClasses = computerGrid.getAttribute('class');
			document.getElementById('step3').removeAttribute('class');
			computerClasses = computerClasses.replace(' highlight', '');
			computerGrid.setAttribute('class', computerClasses);
			document.getElementById('step4').setAttribute('class', 'current-step');
			this.currentStep++;
			break;
		case 5:
			document.getElementById('step4').removeAttribute('class');
			this.currentStep = 6;
			this.showTutorial = false;
			localStorage.setItem('showTutorial', false);
			break;
		default:
			break;
	}
};
