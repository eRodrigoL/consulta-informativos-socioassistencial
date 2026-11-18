import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly topic = signal<'PAIF' | 'SCFV'>('PAIF');
}
