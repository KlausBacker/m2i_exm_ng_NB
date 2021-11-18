import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Perso } from './models/perso';
import { PersoService } from './services/perso.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddComponent } from './layouts/add/add.component';
import { DeleteComponent } from './layouts/delete/delete.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'lolCrud';
  persos: Perso[] = [];
  displayedColumns = ['id', 'title', 'name', 'active', 'actions'];
  index: number;
  id: number;

  constructor(private persoService: PersoService, public dialog: MatDialog) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ngOnInit(): void {
    this.loadData();
    this.persoService.getAllPersos();
  }

  refresh = (): void => {
    this.loadData();
  };

  loadData = (): void => {
    this.persoService.persoStream.subscribe((data) => {
      this.persos = data;
    });
  };

  addNew = (): void => {
    const dialogRef = this.dialog.open(AddComponent, {
      data: { perso: Object },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.persoService.persoStream.value.push(
          this.persoService.getDialogData()
        );
      }
    });
  };

  startEdit = (): void => {};

  /*  deletePerso = (data: number): void => {
    this.persoService.deletePerso(data).subscribe(
      (data) => {
        this.persoService.getPerso();
      },
      (err) => console.error(err)
    );
  }; */

  deletePerso(id: number, title: string, active: boolean) {
    this.id = id;
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { id: id, title: title },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.persoService.persoStream.value.findIndex(
          (x) => x.id === this.id
        );
        this.persoService.persoStream.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}
