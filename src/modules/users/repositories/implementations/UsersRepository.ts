import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const userRepository: Repository<User> = getRepository(User);

    const user = await userRepository.findOne(user_id, {
      relations: ['games'],
    });

    if (!user) {
      throw new Error("Usuário não existe")
    }
  
    return user;
    }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query('SELECT * FROM users ORDER BY first_name');
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const query = `
      SELECT *
      FROM users
      WHERE LOWER(first_name) = LOWER($1) AND LOWER(last_name) = LOWER($2)
    `;
    const users = await this.repository.query(query, [first_name, last_name]);
  
    return users;
  }
}
