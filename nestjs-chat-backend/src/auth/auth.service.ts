import { Injectable } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common/enums'
import { ForbiddenException, HttpException } from '@nestjs/common/exceptions'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto } from './dto/auth.dto'
import * as bcrypt from 'bcrypt'
import { Tokens } from './types/tokens.type'
import { JwtService } from '@nestjs/jwt/dist'
import { UserService } from 'src/user/user.service'
import { parse } from 'cookie'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService, private userService: UserService) {}

  async signup(dto: AuthDto): Promise<Tokens> {
    const isExist = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    })

    if (isExist) {
      throw new HttpException({ message: 'User already exists', type: 'username' }, HttpStatus.BAD_REQUEST)
    }

    const hashedPass = await this.hashData(dto.password)

    const newUser = await this.userService.createUser(dto.username, hashedPass)

    // generate refresh and access
    const tokens = await this.generateTokens(newUser.id, newUser.username)

    // save refresh in db
    await this.updateRtHash(newUser.id, tokens.refresh_token)

    return tokens
  }

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    })

    if (!user) {
      throw new HttpException({ message: 'This username does not exist.', type: 'username' }, HttpStatus.BAD_REQUEST)
    }

    const isPassMatches = await bcrypt.compare(dto.password, user.password)

    if (!isPassMatches) {
      throw new HttpException({ message: 'Incorrect password.', type: 'password' }, HttpStatus.BAD_REQUEST)
    }

    const tokens = await this.generateTokens(user.id, user.username)

    await this.updateRtHash(user.id, tokens.refresh_token)

    return tokens
  }

  async logout(userId: string) {
    return this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    })
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access denied.')
    }

    const rtMatches = bcrypt.compare(rt, user.hashedRt)

    if (!rtMatches) {
      throw new ForbiddenException('Access denied.')
    }

    const tokens = await this.generateTokens(user.id, user.username)

    await this.updateRtHash(user.id, tokens.refresh_token)

    return tokens
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt)
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    })
  }

  async generateTokens(userId: string, username: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync({ sub: userId, username }, { secret: 'at-secret', expiresIn: '15m' }),
      this.jwtService.signAsync({ sub: userId, username }, { secret: 'rt-secret', expiresIn: '7d' }),
    ])

    return {
      access_token: at,
      refresh_token: rt,
    }
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10)
  }

  parseCookies(cookie: string) {
    const cookies = parse(cookie)
    const user = this.jwtService.decode(cookies.REFRESH_TOKEN)

    return { cookies, user }
  }
}
