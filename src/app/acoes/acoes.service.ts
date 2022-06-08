import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, pluck, tap } from 'rxjs/operators';
import { Acao, AcoesAPI } from './modelo/acoes';

@Injectable({
  providedIn: 'root'
})
export class AcoesService {

  constructor(private httpCliente: HttpClient) { }

  getAcoes(valor?:string) {
    const params = valor ? new HttpParams().append('valor', valor) : undefined;

    return this.httpCliente.get<AcoesAPI>('http://localhost:3000/acoes', {params})
      .pipe(
        // a cada metodo abaixo o valor retornado é passado para o proximo método
        tap((valor)=>{console.log(valor)}), //metodo que nao influencia em nada
        pluck('payload'), //metodo que serve para extrair a propriedade que eu quero do retorno da api
        map((acoes) => acoes.sort( //map() manipular os dados recebidos
          (acaoA, acaoB) => this.ordenaPorCodigo(acaoA,acaoB))
          )
        )
  }

  private ordenaPorCodigo(acaoA:Acao,acaoB:Acao) {
    if(acaoA.codigo > acaoB.codigo){ // '.codigo' é a propriedade que vem na api
      return 1;
    }
     if(acaoA.codigo < acaoB.codigo){
       return -1;
     }

     return 0;
  }
}


