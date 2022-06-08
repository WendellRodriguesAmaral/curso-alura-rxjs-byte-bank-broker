import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { AcoesService } from './acoes.service';

const ESPERA_DIGITACAO = 300;

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent  {
  acoesInput = new FormControl();

  //requisição que traz todas as ações
  todasAcoes$ = this.acoesService.getAcoes().pipe(tap(()=>{console.log('fluxo inicial')}));

  //requisição que traz as ações conforme é digitado
  filtroPeloInput$ = this.acoesInput.valueChanges //valueChanges emite o valor cada vez que sofrer alteração
  .pipe( 
    debounceTime(ESPERA_DIGITACAO), 
    tap(()=>{console.log('fluxo do filtro')}),
    tap(console.log),
    filter((valorDigitado)=>valorDigitado.length >= 3 || !valorDigitado.length ), //so passa o valor pro switchMap se o valor digitado for igual a 0 ou maior que 3
    distinctUntilChanged(), // compara com o ultimo valor digitado e se for igual, ja retorna os mesmos dados sem realizar a requisição
    switchMap((valorDigitado)=>this.acoesService.getAcoes(valorDigitado)) //switchMap para o fluxo anterior e gera um novo fluxo fazendo a requisição
     )
  
  acoes$ = merge(this.todasAcoes$, this.filtroPeloInput$)

  constructor(private acoesService:AcoesService) {}
  
  
}
