import {getRepository, Repository} from "typeorm";
import {User} from "../models/User";
import bcrypt from "bcrypt";
import {SignUpUser} from "../types/signUpUser";
import {ChangeUserDataRequest} from "../types/changeUserDataRequest";

export default class UserService {
  private readonly repository: Repository<User>;

  constructor() {
    this.repository = getRepository<User>(User);
  }

  async find(id: number): Promise<User | void> {
    try {
      return await this.repository.findOne({id});
    } catch (e) {
      console.error(e);
    }
  }

  // если пользователь успешно создался, то возвращает true, иначе false
  async create(createProps: SignUpUser): Promise<boolean> {
    try {
      const salt = await bcrypt.genSalt(10);
      await this.repository.insert({
        email: createProps.email,
        password: await bcrypt.hash(createProps.password, salt),
        firstName: createProps.firstName,
        lastName: createProps.lastName,
        tags: [],
        types: [],
      });

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  // если пользователь с таким email уже существент, то возвращает true, иначе false
  async checkIfExists(email: string): Promise<boolean> {
    const user: User | undefined = await this.repository.findOne({email});

    return user !== undefined;
  }

  async update(id: number, data: ChangeUserDataRequest): Promise<User | boolean | void> {
    const user = await this.find(id);
    if (!user) {
      return false;
    }

    const newData = {
      id,
      tags: data.tags,
      types: data.shotTypes,
    };

    try {
      await this.repository.save(newData);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
