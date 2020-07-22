import { ToastrService } from 'ngx-toastr';
import { EventoService } from './services/evento.service';
import { SalaService } from './services/sala.service';
import { Sala } from './models/sala';
import { Evento } from './models/evento';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Eventos';

  evento = {} as Evento;
  eventos: Evento[];
  salas: Sala[];
  operacao: string;

  constructor(private salaService: SalaService, private eventoService: EventoService, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.getEventos();
    this.getSalas();
  }
  getSalas() {
    this.salaService.getSalas().subscribe(
      (salas: Sala[]) => {
        this.salas = salas;
      }
    );
  }
  getEventos() {
    this.eventoService.getEventos().subscribe(
      (eventos: Evento[]) => {
        this.eventos = eventos;
        this.operacao = 'P';
      });
  }

  saveEvento(form: NgForm) {
    if (this.evento.dataFim <= this.evento.dataInicio) {
      this.toastr.warning('Favor colocar Data de Fim após Data de Início');
      return;
    }
    if (this.evento.id) {
      this.eventoService.updateEvento(this.evento).subscribe(result => {
        this.cleanForm(form);
        this.toastr.success(result.toString());
      });
    } else {
      this.eventoService.saveEvento(this.evento).subscribe(result => {
        this.cleanForm(form);
        this.toastr.success(result.toString());
      });
    }
  }

  deleteEvento(evento: Evento) {
    if (confirm('Tem certeza que deseja cancelar o evento?')) {
      this.eventoService.deleteEvento(evento).subscribe(result => {
        this.toastr.success(result.toString());
        this.getEventos();
      });
    }
  }

  editEvento(evento: Evento) {
    this.evento = { ...evento };
    this.operacao = 'E';
  }

  addEvento(form: NgForm) {
    this.evento = {} as Evento;
    this.operacao = 'A';
  }

  cleanForm(form: NgForm) {
    this.getEventos();
    form.resetForm();
    this.evento = {} as Evento;
  }

}
