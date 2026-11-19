import { DOCUMENT, NgTemplateOutlet, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, isDevMode, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { arvoreConsulta, ItemConsulta, localizarItem } from './consulta';

interface Referencia {
  titulo: string;
  url: string;
  trecho: string;
}

interface Pagina {
  id: string;
  titulo: string;
  descricao?: string;
  fontes: Referencia[];
}

interface Beneficio extends Pagina {
  abrangencia: string;
  territorio?: string;
  direito: string;
  publico?: string;
  obtencao: string;
  manutencao: string;
  solicitacao?: string;
}

interface SalarioMinimo {
  inicio: string;
  fim?: string;
  centavos: number;
  fonte: Referencia;
}

interface Atualizacao {
  id: string;
  titulo: string;
  resumo: string;
  publicadaEm: string;
  efeitosEm?: string;
  fontes: Referencia[];
}

interface Catalogo {
  atualizacoes?: Atualizacao[];
  paginas?: Pagina[];
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
    inject(HttpClient)
      .get<Catalogo>(isDevMode() && this.params().get('previa') === '1' ? 'beneficios.previa.json' : 'beneficios.json')
      .pipe(catchError(() => of(null))),
  );
  protected readonly previa = isDevMode() && this.params().get('previa') === '1';
  protected readonly menuAberto = signal(
    !inject(DOCUMENT).defaultView?.matchMedia('(max-width: 620px)').matches,
  );
  protected readonly arvore = arvoreConsulta;
  protected readonly item = computed(() => {
    const params = this.params();
    // Links anteriores das fichas usam o parâmetro beneficio.
    const id = params.get('beneficio') ?? params.get('secao') ?? 'atualizacoes';
    return localizarItem(this.arvore, id) ?? this.arvore[0];
  });
  protected readonly pagina = computed(() =>
    this.catalogo()?.paginas?.find(({ id }) => id === this.item().id),
  );
  protected readonly beneficio = computed(() =>
    this.catalogo()?.beneficios.find(({ id }) => id === this.item().id),
  );
  protected readonly atualizacoes = computed(() => {
    const hoje = formatDate(new Date(), 'yyyy-MM-dd', 'en-US', '-0300');
    const limite = new Date(hoje);
    limite.setUTCDate(limite.getUTCDate() - 29);
    const inicio = limite.toISOString().slice(0, 10);
    return this.catalogo()?.atualizacoes?.filter(({ publicadaEm }) =>
      publicadaEm >= inicio && publicadaEm <= hoje,
    ) ?? [];
  });

  protected readonly salarioMinimo = computed(() => {
    const hoje = formatDate(new Date(), 'yyyy-MM-dd', 'en-US', '-0300');
    return this.catalogo()?.salariosMinimos
      .filter(({ inicio, fim }) => inicio <= hoje && (!fim || hoje <= fim))
      .sort((a, b) => b.inicio.localeCompare(a.inicio))[0];
  });

  private readonly titulos = computed(() => {
    const dados = this.catalogo();
    return new Map([...(dados?.paginas ?? []), ...(dados?.beneficios ?? [])]
      .map(({ id, titulo }) => [id, titulo]));
  });

  protected tituloDoItem(item: ItemConsulta) {
    return this.titulos().get(item.id) ?? item.titulo ?? item.rotulo;
  }

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
