import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '@app/api/api.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {merge} from 'rxjs';

@Component({
  selector: 'app-users-big-data',
  templateUrl: './users-big-data.component.html',
  styleUrls: ['./users-big-data.component.css']
})

export class UsersBigDataComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'rightType.name', 'email', 'comment', 'createdAt'];

  usersDataSource = new MatTableDataSource();

  resultsLength = 0;
  isDataLoading = false;
  isErrorOnGettingData = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.paginator.pageSize = 10;
    this.onRefreshClick();
    merge(this.sort.sortChange, this.paginator.page)
      .subscribe(() => this.onRefreshClick());
  }

  onRefreshClick() {
    this.isDataLoading = true;
    this.apiService.getUsers(this.paginator.pageSize * this.paginator.pageIndex,
      this.paginator.pageSize, this.sort.active, this.sort.direction)
        .subscribe(
          data => {
            this.isDataLoading = false;
            this.isErrorOnGettingData = false;
            this.resultsLength = data.total_count;
            this.usersDataSource.data = data.items;
          },
          () => {
            this.isDataLoading = false;
            this.isErrorOnGettingData = true;
            this.resultsLength = 0;
            this.usersDataSource.data = [];
          }
        );
  }
}



