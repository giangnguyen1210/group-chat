import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from 'src/shemas/Project.schema';
import { ProjectMembers } from 'src/shemas/ProjectMembers.schema';
import { Role } from 'src/shemas/Role.schema';
import { User } from 'src/shemas/User.schema';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class ProjectMembersService {
  constructor(
    @InjectModel(ProjectMembers.name)
    private projectMemberModel: Model<ProjectMembers>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {}

  async addMember(addMemberDto: AddMemberDto): Promise<ProjectMembers> {
    const project = await this.projectModel.findById(addMemberDto.project_id);
    const user = await this.userModel.findById(addMemberDto.user_id);
    const role = await this.roleModel.findById(addMemberDto.role_id);
    const checkUserExist = await this.projectMemberModel.findOne({
      user_id: addMemberDto.user_id,
    });
    if (!project || !user || !role) {
      throw new NotFoundException('Invalid project, user, or role ID');
    }

    if (checkUserExist) {
      throw new ConflictException('This member is exist');
    }

    const newProjectMember = new this.projectMemberModel(addMemberDto);
    return newProjectMember.save();
  }

  async getMembers(project_id: string): Promise<ProjectMembers[]> {
    return this.projectMemberModel
      .find({ project_id: new Types.ObjectId(project_id) })
      .populate('project_id')
      .populate({
        path: 'user_id',
        select: '-password', // Exclude the password field
      })
      .populate('role_id')
      .exec();
  }
}
