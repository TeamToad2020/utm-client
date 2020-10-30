import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

interface InventoryItem {
  id: string;
  title: string;
  img: string;
  desc: string;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryManager {
  inventoryItems: BehaviorSubject<InventoryItem[]> = new BehaviorSubject<
    InventoryItem[]
  >([]);
  allInventoryItems: InventoryItem[] = [];

  constructor(private http: HttpClient) {
    this.load();
  }

  async load() {
    this.allInventoryItems = await this.http
      .get<any>('/assets/data-models/InventoryItems/InventoryItems.json')
      .toPromise();

    const rawCollectedItems = JSON.parse(
      localStorage.getItem('collectedItems')
    );

    if (!rawCollectedItems) {
      this.initInventory();
      return;
    }

    const inventoryItems = rawCollectedItems.map((rawItem: { id: string }) => {
      const fullItem = this.allInventoryItems.find(
        item => rawItem.id === item.id
      );
      if (!fullItem) {
        console.error('Item ID is unknown', rawItem.id);
        return;
      }
      return fullItem;
    });
    this.inventoryItems.next(inventoryItems);
  }

  clearInventory() {
    this.inventoryItems.next([]);
    localStorage.clear();
  }

  addItemToInventory(itemId: string) {
    const fullItem = this.allInventoryItems.find(item => itemId === item.id);

    const newInventoryItems = this.inventoryItems.getValue();
    newInventoryItems.push(fullItem);

    this.inventoryItems.next(newInventoryItems);
    this.updatePersistentStorage();
    console.log(`${itemId} was added to inventory`); // DEBUG
  }

  removeItemFromInventory(itemId: string) {
    const newInventoryItems = this.inventoryItems.getValue();
    this.inventoryItems.next(
      newInventoryItems.filter(item => item.id !== itemId)
    );
  }

  initInventory() {
    this.inventoryItems.next([]);
    this.updatePersistentStorage();
  }

  updatePersistentStorage() {
    const minInventory = this.inventoryItems.getValue().map(item => {
      return { id: item.id };
    });
    localStorage.setItem('collectedItems', JSON.stringify(minInventory));
  }
}
