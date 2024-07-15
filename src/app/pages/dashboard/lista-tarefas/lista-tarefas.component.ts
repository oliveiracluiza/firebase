import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-lista-tarefas',
  templateUrl: './lista-tarefas.component.html',
  styleUrl: './lista-tarefas.component.scss'
  
})
export class ListaTarefasComponent implements OnInit {

  //lista iniciada ou não
  visualizarLista: boolean = false;

  // formulário da tarefa
  tarefaForm: FormGroup;

  //formularioo de edição da tarefa
  editarTarefaForm: FormGroup;

  // vetor de tarefas 
  tarefas: any[] = [];

  //guarda temporariamente a tarefa sendo editada; começa vazia
  edicaoTarefa: any = null;

  //inicializa formulário para adicionar e editar tarefas
  constructor(private fb: FormBuilder, private db: AngularFirestore) { 
    this.tarefaForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      dificuldade: ['', Validators.required]
    });

    this.editarTarefaForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      dificuldade: ['', Validators.required]
    });
  }
  
  //ativa a visualização da lista de tarefas
  ativarLista(){
    this.visualizarLista = true;
  }

  //após criar a lista de tarefas, carrge as tarefas que já existem no FireStore
  ngOnInit(): void {
    this.loadTarefas();
  }

  //método para carregar tarefas do FireStore e as armazenar em 'tarefas'
  loadTarefas(): void {
    this.db.collection('tarefas').valueChanges({ idField: 'id' }).subscribe(tarefas => {
      this.tarefas = tarefas;
    }, error => {
      console.error('Erro ao carregar tarefas: ', error);
    });
  }
  
 //adiciona nova tarefa: iniciada como pendente, carrega banco de dados, adiciona, reseta o formulario e carrega novamente as tarefas pelo banco
  adicionarTarefa(): void {
    if (this.tarefaForm.valid) {
      let tarefa = this.tarefaForm.value;
      tarefa.concluida = false;
      this.db.collection('tarefas').add(tarefa).then(() => {
        alert('Tarefa adicionada!');
        this.tarefaForm.reset();
        this.loadTarefas();
      }).catch(error => {
        console.error('Erro ao adicionar tarefa: ', error);
      });
    }
  }

  // mudar tarefa de pendente para concluida: quando concluida for true
  concluirTarefa(titulo: string): void {
    const tarefa = this.tarefas.find(t => t.titulo === titulo);
    if (tarefa) {
      this.db.collection('tarefas').doc(tarefa.id).update({concluida: true}).then(() =>{
        this.loadTarefas();
      }).catch(error => {
        console.error('Erro ao concluir tarefa: ', error);
      });
    }
  }

  // procura a tarefa a partir de seu título e a exclui no banco
  excluirTarefa(titulo: string): void {
    const index = this.tarefas.find(t => t.titulo === titulo);
    if (index) {
      this.db.collection('tarefas').doc(index.id).delete().then (() => { 
        this.loadTarefas();
      }).catch(error => {
        console.log('Erro ao excluir tarefa: ', error);
      });
    }
  }

  //editar tarefa: primeiro, abrir editor da tarefa e, depois, se a edição for valida, substituir no banco de dados a tarefa atualizada

  editorTarefa(tarefa: any) {
    this.edicaoTarefa = tarefa; //guarda tarefa na variavel edicaoTarefa temporariamente
    this.editarTarefaForm.patchValue ({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      dificuldade: tarefa.dificuldade
    });
  }

  editarTarefa(id: string): void {
    if(this.editarTarefaForm.valid) {
      const tarefaEditada = this.editarTarefaForm.value;
      this.db.collection('tarefas').doc(id).update(tarefaEditada).then (() => {
        this.loadTarefas(); //carrega nova lista
        this.edicaoTarefa = null; //limpa variavel temporaria
        this.editarTarefaForm.reset(); //reseta formulario
        alert('Tarefa atualizada com sucesso!');
      }).catch(error => {
        console.log('Erro ao editar tarefa: ', error);
      });
    }
  }
      
 }
