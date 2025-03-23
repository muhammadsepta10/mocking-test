import { JoiValidationPipe } from '@common/pipes/joi-validation.pipe';
import * as Joi from 'joi';
import { CreatePostDTO, PatchUpdatePostDTO, UpdatePostDTO } from './post.dto';

export class PatchUpdatePostPipe extends JoiValidationPipe {
  public buildSchema(): Joi.Schema {
    return Joi.object<PatchUpdatePostDTO>({
      body: Joi.string().optional().allow(''),
      title: Joi.string().optional().allow(''),
    });
  }
}

export class UpdatePostPipe extends JoiValidationPipe {
  public buildSchema(): Joi.Schema {
    return Joi.object<UpdatePostDTO>({
      body: Joi.string().required().allow(''),
      title: Joi.string().required().allow(''),
    });
  }
}

export class CreatePostPipe extends JoiValidationPipe {
  public buildSchema(): Joi.Schema {
    return Joi.object<CreatePostDTO>({
      body: Joi.string().required().allow(''),
      title: Joi.string().required().allow(''),
      userId: Joi.number().required().positive(),
    });
  }
}
