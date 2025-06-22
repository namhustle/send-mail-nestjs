import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, PaginateModel } from 'mongoose'
import { User, UserDocument } from './shemas'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: PaginateModel<UserDocument>,
  ) {}

  async create(payload: Omit<User, '_id'>) {
    return this.userModel.create(payload)
  }

  async findOneById(userId: string) {
    return this.userModel.findById(userId)
  }

  async findOne(
    filter: FilterQuery<User>,
    options: {
      select?: string | string[]
    } = {},
  ) {
    return this.userModel.findOne(filter).select(options.select || {})
  }

  async exists(filter: FilterQuery<User>) {
    return this.userModel.exists(filter)
  }

  async findOneAndUpdate(
    filter: FilterQuery<User>,
    payload: Partial<Omit<User, '_id'>>,
  ) {
    if (payload.email) {
      const existing = await this.exists({ email: payload.email })
      if (existing) throw new Error('Email already exists')
    }

    return this.userModel.findOneAndUpdate(filter, payload, {
      new: true,
    })
  }

  async deleteOne(filter: FilterQuery<User>) {
    return this.userModel.deleteOne(filter)
  }
}
