import { IsNotEmpty, IsString } from 'class-validator';
// import { IsUnique } from 'src/commons/decorators/is-unique.decorator';

export class CreateTeamsChatDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  project_id: string;
}
