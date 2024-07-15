import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface Tarefa {
  id?: string;
  titulo: string;
  descricao: string;
  dificuldade: string;
  concluida: boolean;
}

export enum Dificuldade {
  facil = 'facil',
  medio = 'medio',
  dificil = 'dificil'
}

@Injectable({
  providedIn: 'root'
})
export class ListaService {

  constructor(private firestore: AngularFirestore) { }

  getTarefas(): Observable<any> {
    return this.firestore.collection('tarefas').snapshotChanges();
  }

  addTarefa(tarefa: Tarefa): Promise<void> {
    return this.firestore.collection('tarefas').add(tarefa).then(() => {
      console.log('Tarefa adicionada com sucesso!');
    }).catch(error => {
      console.error('Erro ao adicionar a tarefa: ', error);
    });
  }

  updateTarefa(id: string, tarefa: Tarefa): Promise<void> {
    return this.firestore.collection('tarefas').doc(id).update(tarefa).then(() => {
      console.log('Tarefa atualizada com sucesso!');
    }).catch(error => {
      console.error('Erro ao atualizar a tarefa: ', error);
    });
  }

  deleteTarefa(id: string): Promise<void> {
    return this.firestore.collection('tarefas').doc(id).delete().then(() => {
      console.log('Tarefa excluída com sucesso!');
    }).catch(error => {
      console.error('Erro ao excluir a tarefa: ', error);
    });
  }
}

