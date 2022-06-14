type Values = { id: string; src: string; title: string; active: boolean };

class Storage {
  constructor() {
    if (!localStorage["windows"]) {
      localStorage["windows"] = `[]`;
    }
  }

  update(data: Values) {
    const current = this.get();
    const updateIndex = current.findIndex((item) => item.id === data.id);

    if (updateIndex > -1) {
      current[updateIndex] = data;

      this.set(current);
    }
  }

  delete(id: string) {
    const current = this.get();
    this.set(current.filter((item) => item.id !== id));
  }

  add(data: Values) {
    const current = this.get();
    this.set([...current, data] as Values[]);
  }

  private set(data: Values[]) {
    localStorage["windows"] = JSON.stringify(data);
  }

  get(): Values[] {
    return JSON.parse(localStorage["windows"]);
  }
}

const storage = new Storage();

export { storage };
