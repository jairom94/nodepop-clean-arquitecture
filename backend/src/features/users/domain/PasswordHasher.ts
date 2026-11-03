export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
  /** true si el hash se creó con un coste menor al actual y conviene regenerarlo. */
  needsRehash(hash: string): boolean;
}
