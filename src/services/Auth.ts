import {getRepository, Repository} from "typeorm";
import {User} from "../models/User";
import jwt from "jsonwebtoken";
import getenv from "getenv";
import bcrypt from "bcrypt";
import {SignInUser} from "../types/signInUser";
import {AuthResponseData} from "../types/authResponse";

interface TokenInterface {
  email: string;
  userId: number;
  iat: number;
  exp: number;
}

export default class AuthService {
  private readonly repository: Repository<User>;
  private readonly jwtKey: string;

  constructor() {
    this.repository = getRepository<User>(User);
    this.jwtKey = getenv.string("JWT");
  }

  // Если ошибка работы с БД, то void
  // Если пароли совпали — возвращается AuthResponseData, иначе пустой объект
  async createJWT(data: SignInUser): Promise<AuthResponseData> {
    const user: User | undefined = await this.repository.findOne({email: data.email});
    if (!user) {
      throw new Error("404");
    }
    const passwordResult: boolean = await bcrypt.compare(data.password, user.password);

    if (!passwordResult) {
      throw new Error("403");
    }

    const expiresAt = 2 * 3600;
    const token: string = jwt.sign(
      {
        email: data.email,
        userId: user.id,
      },
      this.jwtKey,
      {expiresIn: expiresAt},
    );

    return {
      token,
      expiresAt,
    };
  }

  decodeToken(token: string): TokenInterface | null {
    try {
      const decoded = jwt.verify(token, this.jwtKey) as TokenInterface;
      return decoded;
    } catch {
      return null;
    }
  }
}
