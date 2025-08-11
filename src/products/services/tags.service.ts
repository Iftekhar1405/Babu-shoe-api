import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tags, TagsDocument } from '../schemas/tags.schema';
import { CreateTagDto, UpdateTagDto } from '../dto/tags';


@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tags.name) private tagsModel: Model<TagsDocument>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tags> {

    // const existingTag = await this.tagsModel.findOne({
    //   name: { $regex: new RegExp(`^${createTagDto.name}$`, 'i') }
    // });

    // if (existingTag) {
    //   throw new ConflictException('Tag with this name already exists');
    // }

    // TODO: If we not want duplicasy here un comment the upper code

    const newTag = new this.tagsModel(createTagDto);
    return await newTag.save();
  }

  async findAll(): Promise<Tags[]> {
    return await this.tagsModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<Tags> {
    const tag = await this.tagsModel.findById(id).exec();
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tags> {
    // Before Updating the name check for its duplicate
    if (updateTagDto.name) {
      const existingTag = await this.tagsModel.findOne({
        name: { $regex: new RegExp(`^${updateTagDto.name}$`, 'i') },
        _id: { $ne: id }
      });

      if (existingTag) {
        throw new ConflictException('Tag with this name already exists');
      }
    }

    const updatedTag = await this.tagsModel
      .findByIdAndUpdate(id, updateTagDto, { new: true })
      .exec();

    if (!updatedTag) {
      throw new NotFoundException('Tag not found');
    }

    return updatedTag;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedTag = await this.tagsModel.findByIdAndDelete(id).exec();
    
    if (!deletedTag) {
      throw new NotFoundException('Tag not found');
    }

    return { message: 'Tag deleted successfully' };
  }

  async search(searchTerm: string): Promise<Tags[]> {
    return await this.tagsModel
      .find({
        name: { $regex: searchTerm, $options: 'i' }
      })
      .sort({ name: 1 })
      .exec();
  }

  async getTagsCount(): Promise<number> {
    return await this.tagsModel.countDocuments();
  }
}