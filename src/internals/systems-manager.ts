import { Entity } from '../entity';
import { sortByOrder, System } from '../system/system';
import { SystemGroup } from '../system/system-group';
import { Constructor, Option, SystemClass } from '../types';
import { SystemRegisterOptions, World } from '../world';

export class SystemManager<E extends Entity, W extends World<E>> {
  private _world: W;
  private _groups: SystemGroup<E, W>[];

  public constructor(world: W) {
    this._world = world;
    this._groups = [new SystemGroup(this._world)];
  }

  public register<T extends System>(
    Class: SystemClass<T>,
    opts: SystemRegisterOptions = {}
  ): this {
    const { group = Class.group ?? SystemGroup } = opts;
    let groupInstance = this._groups.find((g: SystemGroup) => {
      return (g.constructor as Constructor<SystemGroup>) === group;
    });
    if (!groupInstance) {
      groupInstance = new group();
    }
    groupInstance.add(new Class());
    groupInstance.sort();
    return this;
  }

  public tick(delta: number): void {
    const groups = this._groups;
    for (const group of groups) {
      group.tick(delta);
    }
  }

  public sort(): this {
    this._groups.sort(sortByOrder);
    return this;
  }

  public group<T extends SystemGroup>(Class: Constructor<T>): Option<T> {
    return this._groups.find((group: SystemGroup) => {
      Class === group.constructor;
    }) as Option<T>;
  }
}
