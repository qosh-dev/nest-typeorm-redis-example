import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('article')
export class ArticleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  @Index()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt!: string;

  @Column()
  authorId: string;

  @ManyToOne(() => UserEntity, (e) => e.articles, { onDelete: 'CASCADE' })
  author: UserEntity;
}
