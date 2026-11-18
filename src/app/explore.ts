import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  templateUrl: './explore.html',
})
export class Explore {
  protected readonly section = signal<'PAIF' | 'SCFV' | 'atualizacoes'>('PAIF');
}
