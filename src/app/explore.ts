import { NgTemplateOutlet, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { arvoreConsulta, localizarItem } from './consulta';

interface Referencia {
  titulo: string;
  url: string;
  trecho: string;
}

interface Beneficio {
  id: string;
  titulo: string;
  abrangencia: string;
  territorio?: string;
  direito: string;
  obtencao: string;
  manutencao: string;
  solicitacao?: string;
  fontes: Referencia[];
}

interface SalarioMinimo {
  inicio: string;
  fim?: string;
  centavos: number;
  fonte: Referencia;
}

interface Catalogo {
  beneficios: Beneficio[];
  salariosMinimos: SalarioMinimo[];
}

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

@Component({
  imports: [RouterLink, NgTemplateOutlet],
  host: { class: 'explore-page' },
  templateUrl: './explore.html',
})
export class Explore {
  private readonly params = toSignal(inject(ActivatedRoute).queryParamMap, { requireSync: true });
  protected readonly catalogo = toSignal(
    inject(HttpClient).get<Catalogo>('beneficios.json').pipe(catchError(() => of(null))),
  );
  protected readonly arvore = arvoreConsulta;
  protected readonly item = computed(() => {
    const params = this.params();
    // Links anteriores das fichas usam o parâmetro beneficio.
    const id = params.get('beneficio') ?? params.get('secao') ?? 'atualizacoes';
    return localizarItem(this.arvore, id) ?? this.arvore[0];
  });
  protected readonly beneficio = computed(() =>
    this.catalogo()?.beneficios.find(({ id }) => id === this.item().id),
  );
  protected readonly salarioMinimo = computed(() => {
    const hoje = formatDate(new Date(), 'yyyy-MM-dd', 'en-US', '-0300');
    return this.catalogo()?.salariosMinimos
      .filter(({ inicio, fim }) => inicio <= hoje && (!fim || hoje <= fim))
      .sort((a, b) => b.inicio.localeCompare(a.inicio))[0];
  });

  protected formatarMoeda(centavos: number) {
    return moeda.format(centavos / 100);
  }

  protected formatarCriterio(texto: string) {
    const salario = this.salarioMinimo();
    return texto.replace(/\s*\{\{sm:(\d+)(?:\/(\d+))?\}\}/g, (_, numerador, denominador = '1') =>
      salario
        ? ` (${this.formatarMoeda(Math.round(salario.centavos * Number(numerador) / Number(denominador)))})`
        : '',
    );
  }
}
