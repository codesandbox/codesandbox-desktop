type Values = { id: number; src: string; title: string; active: boolean };

class Storage {
  constructor() {
    if (!localStorage["windows"]) {
      localStorage["windows"] = `[]`;
    }
  }

  update(data: Partial<Values>) {
    let current = this.get();
    const updateIndex = current.findIndex((item) => item.id === data.id);

    if (updateIndex > -1) {
      current[updateIndex] = { ...current[updateIndex], ...data };
    }

    // Toggle active value
    if (data.active) {
      current = current.map((item) => ({
        ...item,
        active: item.id === data.id,
      }));
    }

    this.set(current);
  }

  delete(id: number) {
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
