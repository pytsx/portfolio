export interface EntityReader<Entity> {
  list(): Promise<Entity[]>
  get(id: string): Promise<Entity | null>
}

export interface EntityRepository<Entity, CreateInput, UpdateInput>
  extends EntityReader<Entity> {
  create(input: CreateInput): Promise<Entity>
  update(id: string, input: UpdateInput): Promise<Entity>
  delete(id: string): Promise<void>
}
