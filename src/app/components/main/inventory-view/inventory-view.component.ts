import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InventoryManager } from '../../../services/inventory-manager.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'utm-inventory-view',
  templateUrl: './inventory-view.component.html',
  styleUrls: ['./inventory-view.component.scss'],
})
export class InventoryViewComponent {
  InventoryItems = this.inventoryManager.inventoryItems;

  constructor(
    private router: Router,
    private http: HttpClient,
    private inventoryManager: InventoryManager
  ) {}

  Back() {
    this.router.navigate(['']);
  }
}
