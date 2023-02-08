import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage-angular";

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private database: Storage) {
    this.init();
  }

  async init() {
    await this.database.create();
  }

  async addElement(element: any) {
    // element.id = DbService.genUniqueId();
    await this.database.set(element.id, element);
  }

  async updateElement(element: any) {
    await this.database.set(element.id!!.toString(), element);
    this.getAllElements();
  }

  async deleteElement(id: string) {
    await this.database.remove(id.toString());
  }

  async setElements(elements: any[]) {
    await this.database.clear();
    for (const elem of elements) {
      elem.id = elem.id.toString();
      await this.addElement(elem);
    }
  }

  getAllElements() {
    let elements: any[] = []
    this.database.forEach((elem) => {
      elements.push(elem)
    });
    return elements;
  }

  private static genUniqueId(): string {
    return (Math.floor(Math.random() * 40) + 60).toString();
  }
}
