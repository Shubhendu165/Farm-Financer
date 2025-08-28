import { Component, OnInit } from '@angular/core';
import { AdminLogService } from '../../services/admin-log.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-log',
  templateUrl: './admin-log.component.html',
  styleUrls: ['./admin-log.component.css']
})
export class AdminLogComponent implements OnInit {
  columnDefs = [
    { headerName: 'User ID', field: 'userId', sortable: true, filter: 'agNumberColumnFilter', flex: 1 },
    { headerName: 'User Name', field: 'username', sortable: true, filter: 'agTextColumnFilter', flex: 2 },
    { headerName: 'Email Address', field: 'email', sortable: true, filter: 'agTextColumnFilter', flex: 3 },
    { headerName: 'Role', field: 'role', sortable: true, filter: 'agTextColumnFilter', flex: 2 },
    { headerName: 'Action', field: 'action', sortable: true, filter: 'agSetColumnFilter', flex: 2 },
    {
      headerName: 'Time Stamp',
      field: 'timestamp',
      sortable: true,
      filter: 'agDateColumnFilter',
      flex: 4,
      valueFormatter: params => {
        const date = new Date(params.value);
        return date.toLocaleString();
      },
      filterParams: {
        comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
          const cellDate = new Date(cellValue);
          if (cellDate < filterLocalDateAtMidnight) return -1;
          if (cellDate > filterLocalDateAtMidnight) return 1;
          return 0;
        }
      }
    }
  ];

  rowData: any[] = [];

  constructor(private logService: AdminLogService, private router: Router) {}

  ngOnInit(): void {
    this.logService.getAllLogs().subscribe({
      next: data => this.rowData = data,
      error: err => console.error('Error fetching logs:', err)
    });
  }
}
