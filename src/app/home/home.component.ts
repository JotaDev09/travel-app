import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent {
  showChoice: boolean = false;
  required: boolean = false;
  empty: boolean = true;
  userName: string = 'Alex';
  showForm: boolean = true;
  showResults: boolean = false;
  showRandomResults: boolean = false;
  submissionCount: number = 0;
  quarters: any[] = [];
  quartersData: any[] = [];

  choices = Array.from({ length: 4 }, (_, index) => ({
    showChoice: true,
    value: '',
  }));

  constructor() {}

  toggleVisibility(index: number) {
    this.choices[index].showChoice = !this.choices[index].showChoice;
  }

  submitForm(form: any) {
    if (this.areAllFieldsFilled()) {
      const userChoices = this.choices.map((choice) => choice.value);
      const localStorageKey = this.userName.toLowerCase().replace(' ', '');

      localStorage.setItem(localStorageKey, JSON.stringify(userChoices));

      this.submissionCount++;

      if (this.submissionCount === 1) {
        this.nextUser(form);
      } else if (this.submissionCount === 2) {
        this.showForm = false;
        this.showResults = true;

        const alexChoices = JSON.parse(localStorage.getItem('alex') || '[]');
        const jotaChoices = JSON.parse(localStorage.getItem('jota') || '[]');
        const pairs = this.combineRandomly(alexChoices, jotaChoices);

        localStorage.setItem('quarters', JSON.stringify(pairs));
        setTimeout(() => {
          this.getQuarters();
        }, 1000);
      }
    } else {
      this.required = true;
    }
  }

  areAllFieldsFilled(): boolean {
    return this.choices.every((choice) => choice.value.trim() !== '');
  }

  nextUser(form: any) {
    form.reset();
    this.required = false;
    this.userName = 'Jota';
  }

  showInput(index: number) {
    this.required = false;
  }

  combineRandomly(array1: any[], array2: any[]): any[] {
    const combined = [];
    const totalLength = Math.max(array1.length, array2.length);

    for (let i = 0; i < totalLength; i++) {
      const choice1 = array1[i % array1.length];
      const choice2 = array2[i % array2.length];
      combined.push([choice1, choice2]);
    }

    return combined;
  }

  chooseWinner() {
    if (this.quarters.length > 0) {
      const winnerIndex = Math.floor(Math.random() * 2); // 0 o 1 para elegir aleatoriamente
      const winner = this.quarters[0][winnerIndex];
      console.log('Winner:', winner);
      // Puedes realizar otras acciones con el ganador según tus necesidades
    }
  }

  /**
   * get quarters from local storage
   */
  getQuarters() {
    this.quartersData = JSON.parse(localStorage.getItem('quarters') || '[]');
    console.log('Quarters Data:', this.quartersData);
  }
}
