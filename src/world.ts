import { Entity } from './entity.js';
import { ArchetypeManager } from './internals/archetype-manager.js';
import { ComponentManager } from './internals/component-manager.js';
import { QueryManager } from './internals/query-manager.js';
import { SystemManager } from './internals/system-manager.js';
import { System } from './system.js';
import { SystemGroup } from './system-group.js';
import { ComponentClass, Constructor, EntityOf, SystemClass } from './types';
import { createUUID } from './utils.js';
import { GenericComponent } from './component.js';
import { Query, QueryComponents } from './query.js';

export class World<E extends Entity = Entity> {

  protected readonly _archetypes: ArchetypeManager<this>;
  protected readonly _queries: QueryManager<this>;
  protected readonly _entities: Map<string, E>;
  protected readonly _components: ComponentManager;
  protected readonly _systems: SystemManager<this>;
  protected readonly _EntityClass: Constructor<E>;

  public constructor(options: Partial<WorldOptions<E>> = {}) {
    const {
      maxComponentType = 256,
      EntityClass = Entity as EntityClass<E>
    } = options;
    this._archetypes = new ArchetypeManager(this);
    this._queries = new QueryManager(this);
    this._systems = new SystemManager(this);
    this._entities = new Map();
    this._components = new ComponentManager({ maxComponentType });
    this._EntityClass = EntityClass;
  }

  public register<T extends System<this>>(
    Class: SystemClass<T>,
    opts: SystemRegisterOptions<this>
  ): this {
    this._systems.register(Class, opts);
    return this;
  }

  public create(id?: string): E {
    id = id ?? createUUID();
    // @todo: __DEV__ #define
    // if (this._entities.has(id)) {
    //   throw new Error(`found duplicated entity with id: '${id}'`);
    // }
    const entity = new this._EntityClass(this, id);
    this._entities.set(id, entity);
    return entity;
  }

  public tick(delta: number): void {
    this._systems.tick(delta);
  }

  public getComponentId(Class: ComponentClass): number {
    return this._components.getIdentifier(Class);
  }

  public get maxComponentTypeCount(): number {
    return this._components.maxComponentTypeCount;
  }

  public _registerComponent<T extends GenericComponent>(
    Class: ComponentClass<T>
  ): number {
    return this._components.registerComponent(Class);
  }

  public _requestQuery(components: QueryComponents): Query<EntityOf<this>> {
    return this._queries.request(components);
  }

  public _onEntityDestroyed(entity: E): void {
    this._archetypes.removeEntity(entity);
  }

  public _onRemoveComponentFromEntity<T extends GenericComponent>(
    entity: EntityOf<this>,
    Class: ComponentClass<T>
  ): T {
    // @todo: object pool.
    // @todo: check in dev mode for duplicate.
    this._registerComponent(Class);
    this._archetypes.addComponent(entity, Class);
    return new Class();
  }

  public _onAddComponentToEntity<T extends GenericComponent>(
    entity: EntityOf<this>,
    Class: ComponentClass<T>
  ): void {
    // @todo: object pool.
    this._archetypes.removeComponent(entity, Class);

  }
}

export type WorldOptions<E extends Entity> = {
  maxComponentType: number;
  components: ComponentClass[];
  EntityClass: EntityClass<E>;
};

export interface SystemRegisterOptions<WorldType extends World> {
  group?: Constructor<SystemGroup<WorldType>>;
  order?: number;
}

export type EntityClass<E extends Entity> = Constructor<E>;
