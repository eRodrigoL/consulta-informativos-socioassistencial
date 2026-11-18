import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  host: { class: 'home-page' },
  template: `
    <main class="hero">
      <div class="wrap hero-inner">
        <h1>Referências técnicas e atualizadas para o atendimento nos CRAS</h1>
        <p class="intro">Todas as informações aqui vêm de documentos oficiais e estão devidamente referenciadas.</p>
        <a class="cta" routerLink="/explorar">Explorar</a>
      </div>
    </main>
  `,
})
export class Home {}
